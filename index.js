const puppeteer=require('puppeteer');
const fs = require('fs');
const console = require('console');
const reviews = require('./reviews');

async function scrapeProduct(url){
    const browser = await puppeteer.launch({ headless: false });
    const page =  await browser.newPage();
    await page.goto(url);  
    
    
    //Elements
    const [name] = await page.$x('//*[@id="module_product_title_1"]/div/div/span');
    const [price] = await page.$x('//*[@id="module_product_price_1"]/div/div/span');
    const [discount] = await page.$x('//*[@id="module_product_price_1"]/div/div/div/span[2]');
    const [rating] = await page.$x('//*[@id="module_product_review_star_1"]/div/a[1]');
    const [brand] = await page.$x('//*[@id="module_product_brand_1"]/div/a[1]');
    const [QA] = await page.$x('//*[@id="module_product_review_star_1"]/div/a[2]');
    const [desc_title] = await page.$x('//*[@id="module_product_detail"]/h2');
    const [image] = await page.$x('//*[@id="module_item_gallery_1"]/div/div[1]/div/img');

    //Filter out data
    const product_name = await (await name.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));
    const product_price = await (await price.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));
    const product_discount = await (await discount.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));
    const product_rating = await (await rating.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));
    const product_brand = await (await brand.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));
    const product_QA = await (await QA.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));
    const product_desc_title = await (await desc_title.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));
    const product_image = await (await image.getProperty('src')).jsonValue().then((value)=>JSON.stringify(value));
    //Basic Information
    var savingData =product_name + ','+product_price + ','+product_discount + ','+product_rating + ','+product_brand + ','+product_QA + ','+product_desc_title + ','+product_image + ',\n';
     
    //Reviews
    // rating_numb=rating_numb.join("");
    let num = product_rating.split(" ")[0].replace('\"'," ").trim();
    // console.log(num);
    lastPageNumber = Math.round(num/5);
    
    //end 
    browser.close()   
    
    return {savingData,url,lastPageNumber};
}

async function ReadCSV_urls(){
   
    let data_lines=require('fs').readFileSync('urls.txt', 'utf-8').split(/\r?\n/);
    for (let line in data_lines) {
        await scrapeProduct("https:"+data_lines[line].replace(","," ").trim().toString())
            .then(async (product)=>{
              console.log(product)
              await writeCSV(product.savingData);     
              await reviews.scrapper(product.url,product.lastPageNumber).then(async ()=>{
              console.log("ok")
            });       
            });    
    }
}
async function writeCSV(obj){
   await fs.appendFile('data.csv', obj, function (err) {
        if (err) throw err;
      });
}
ReadCSV_urls();
