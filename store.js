
const puppeteer = require('puppeteer');
const fs = require('fs');

let scrape = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.daraz.pk/dawlance1621855818/?q=All-Products&langFlag=en&from=wangpu&lang=en&pageTypeId=2');

    var results = []; 
    var lastPageNumber = 4;
    let numbers_ofarray = 0;
   for (let index = 0; index < lastPageNumber; index++) {
    await page.waitForTimeout(1000)
    numbers_ofarray=results.length;
    results =results.concat(await extractedEvaluateCall(page));
    
    if (index != lastPageNumber - 1) {            
        await page.waitForSelector('#root > div > div.ant-row.c10-Cg > div > div > div.ant-col-20.ant-col-push-4.c1z9Ut > div.c3gNPq > div > ul > li.ant-pagination-next > a',{visible:true});
        await page.click('#root > div > div.ant-row.c10-Cg > div > div > div.ant-col-20.ant-col-push-4.c1z9Ut > div.c3gNPq > div > ul > li.ant-pagination-next > a');    
    }
    if (results[numbers_ofarray-40]==results[numbers_ofarray+40]) {
        await page.waitForSelector('#root > div > div.ant-row.c10-Cg > div > div > div.ant-col-20.ant-col-push-4.c1z9Ut > div.c3gNPq > div > ul > li.ant-pagination-next > a',{visible:true});
        await page.click('#root > div > div.ant-row.c10-Cg > div > div > div.ant-col-20.ant-col-push-4.c1z9Ut > div.c3gNPq > div > ul > li.ant-pagination-next > a');    
   
       results = results.filter(function(item, pos) {
        return results.indexOf(item) == pos;
    })
        results =results.concat(await extractedEvaluateCall(page));
      
    }
    results = results.filter(function(item, pos) {
        return results.indexOf(item) == pos;
    })
       
   }
    console.log({results})
    browser.close();
    return results;
};

async function extractedEvaluateCall(page) {
    return await page.evaluate(() => {
        let data = [];
        let elements =document.querySelectorAll('.c1_t2i'); 
        elements[0].childNodes.forEach((value,index)=>{
            let url = value.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].getAttribute('href');
            data.push(url+="\n");
        })    
       return data;
    });
}

scrape().then((value) => {
    console.log(value);
    fs.appendFile('urls.txt', value.toString(), function (err) {
                if (err) throw err;
              });     
});


