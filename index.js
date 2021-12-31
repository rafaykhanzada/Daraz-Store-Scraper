const puppeteer=require('puppeteer');
const fs = require('fs');

async function scrapeProduct(url){
    const browser = await puppeteer.launch({ headless: true });
    const page =  await browser.newPage();
    await page.goto(url);      
    
    //Elements
    const [name] = await page.$x('//*[@id="module_product_title_1"]/div/div/span');
    const [price] = await page.$x('//*[@id="module_product_price_1"]/div/div/span');    
    const [rating] = await page.$x('//*[@id="module_product_review_star_1"]/div/a[1]');
    const [brand] = await page.$x('//*[@id="module_product_brand_1"]/div/a[1]');   
    const [desc_title] = await page.$x('//*[@id="module_product_detail"]/h2');
    const [image] = await page.$x('//*[@id="module_item_gallery_1"]/div/div[1]/div/img');
    
    //Filter out data
    const product_name = await (await name.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));
    const product_price = await (await price.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));    
    const product_rating = await (await rating.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));
    const product_brand = await (await brand.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));  
    const product_desc_title = await (await desc_title.getProperty('innerText')).jsonValue().then((value)=>JSON.stringify(value));
    const product_image = await (await image.getProperty('src')).jsonValue().then((value)=>JSON.stringify(value));
   
    //Basic Information
    var savingData =product_name + ','+product_price + ','+product_rating + ','+product_brand + ','+product_desc_title + ','+product_image + ',\n';
    await browser.close();
    return {savingData};
}

async function ReadCSV_urls(){
    let data_lines=require('fs').readFileSync('urls.txt', 'utf-8').split(/\r?\n/);
    for (let line in data_lines) {
       var temp = await scrapeProduct("https:"+data_lines[line].replace(","," ").trim().toString());   

       var dir = './Products/'+data_lines[line].slice(24).split(".")[0];
       if (!fs.existsSync(dir)){
       await fs.mkdirSync(dir, { recursive: true });
    }

      await writeCSV(dir,temp.savingData);
    }
}
async function writeCSV(path,obj){
   await fs.appendFile(path+'/Product.csv', obj, function (err) {
        if (err) throw err;
      });
}
ReadCSV_urls();
