
const puppeteer = require('puppeteer');
const fs = require('fs');

let scrape = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://arifl3.sg-host.com/qb-login');
    await page.$eval('#user_login', el => el.value = 'qist.admin');
    await page.$eval('#user_pass', el => el.value = 'NnD08RVtzwEApAeBWgaj72^1'); 
    ///#wp-submit
    await page.click('#wp-submit');
    await page.waitForTimeout(5000)

    await page.goto('https://arifl3.sg-host.com/wp-admin/edit.php?post_type=shop_order');

    var results = []; 
    var lastPageNumber = 99;
    let numbers_ofarray = 0;
   for (let index = 0; index < lastPageNumber; index++) {
     await page.waitForTimeout(4000)
    results =results.concat(await extractedEvaluateCall(page));
    
    if (index != lastPageNumber - 1) {            
        await page.waitForSelector('#posts-filter > div.tablenav.top > div.tablenav-pages > span.pagination-links > a.next-page.button',{visible:true});
        await page.click('#posts-filter > div.tablenav.top > div.tablenav-pages > span.pagination-links > a.next-page.button');    
    }
    // if (results[numbers_ofarray-40]==results[numbers_ofarray+40]) {
    //     await page.waitForSelector('#root > div > div.ant-row.c10-Cg > div > div > div.ant-col-20.ant-col-push-4.c1z9Ut > div.c3gNPq > div > ul > li.ant-pagination-next > a',{visible:true});
    //     await page.click('#root > div > div.ant-row.c10-Cg > div > div > div.ant-col-20.ant-col-push-4.c1z9Ut > div.c3gNPq > div > ul > li.ant-pagination-next > a');    
   
    //    results = results.filter(function(item, pos) {
    //     return results.indexOf(item) == pos;
    // })
    //     results =results.concat(await extractedEvaluateCall(page));
      
    // }
    // results = results.filter(function(item, pos) {
    //     return results.indexOf(item) == pos;
    // })
       
   }
    console.log({results})
    browser.close();
    return results;
};

async function extractedEvaluateCall(page) {
    return await page.evaluate(() => {
        let data = [];
        let elements =document.querySelectorAll("td.order_number.column-order_number.has-row-actions.column-primary > a.order-view > strong").forEach((value,index)=>{
            data.push(value.innerText.replace('#','').split(' ')[0])
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


