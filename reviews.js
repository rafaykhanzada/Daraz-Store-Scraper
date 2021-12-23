const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapper(url,lastPageNumber){
    let scrape = async () => {
         const browser = await puppeteer.launch({ headless: false });
         const page = await browser.newPage();
    
         await page.goto(url);
    
        var results = [];     
        for (let index = 0; index < lastPageNumber; index++) {
            
           await page.waitForTimeout(1000)
            results =await results.concat(await extractedEvaluateCall(page));
            
            if (index != lastPageNumber - 1) {            
                await page.waitForSelector('#module_product_review > div > div:nth-child(3) > div.next-pagination.next-pagination-normal.next-pagination-arrow-only.next-pagination-medium.medium.review-pagination',{visible:true});
                await page.click('#module_product_review > div > div:nth-child(3) > div.next-pagination.next-pagination-normal.next-pagination-arrow-only.next-pagination-medium.medium.review-pagination > div');
                await page.click('#module_product_review > div > div:nth-child(3) > div.next-pagination.next-pagination-normal.next-pagination-arrow-only.next-pagination-medium.medium.review-pagination > div > button.next-btn.next-btn-normal.next-btn-medium.next-pagination-item.next');
                
            }
        }
    browser.close();
        return results;
    };
    
    async function extractedEvaluateCall(page) {
        return page.evaluate(() => {
            let data = [];
            var rating_score=0;
            let elements = document.querySelectorAll('.mod-reviews');
            
    
            elements[0].childNodes.forEach((value,index)=>{
                let star = value.childNodes[0].childNodes[0].childNodes.forEach((value,index)=>{
                    if (value.getAttribute('src')=='//laz-img-cdn.alicdn.com/tfs/TB19ZvEgfDH8KJjy1XcXXcpdXXa-64-64.png') {
                        rating_score++;
                    }
                })
                
                let person_name = value.childNodes[1].childNodes[0].innerText;
                let comment = value.childNodes[2].childNodes[0].innerText;
                var arr={
                             rating_score,
                            person_name,
                            comment
                        }
                        rating_score=0;
                 data.push(arr);
            })      
           
            return data;
        });
    }
    
    scrape().then((value) => {
        console.log(value);
        fs.appendFile('data.csv', value.toString(), function (err) {
            if (err) throw err;
          });
    });
    
}
let uri = 'https://www.daraz.pk/products/haier-white-air-fryer-4-ltr-haf40w-i3371566-s12826354.html?mp=1';
scrapper(uri,4);
module.exports = {scrapper}