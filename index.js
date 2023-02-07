const puppeteer=require('puppeteer');
const fs = require('fs');

async function scrapeProduct(){
    const browser = await puppeteer.launch({ headless: true });
    const page =  await browser.newPage();
    await page.goto('https://google.com.pk/');
    var results = []; 

    for (let index = 1; index < 741; index++) {
    var results = []; 

      await page.goto("https://www.qistbazaar.pk/wp-json/wc/v3/orders?consumer_key=ck_414d7bae3787cdd403d86e8920d2ac598d4abf8d&consumer_secret=cs_5bc36625b282d7c33e4b6a7f6917d12137a91d41&per_page=99&page="+[index]);      
console.log(index);  
      const [user_ip] = await page.$x('/html/body/pre');
      const area = await (await user_ip.getProperty('innerText')).jsonValue().then((value)=>value);
      var data = JSON.parse(area);
     data.map((value)=>{
      if (value.meta_data.filter((e)=>e.key=='_billing_area_elaqa').length == 0) {
        var savingData =  value.billing.first_name.replace(/,/g,"").trim() + ' '+value.billing.last_name.replace(/,/g,"").trim()+","+value.billing.address_1.replace(":","").replace(/(\r\n|\n|\r)/gm, " ").replace(/,/g,"").trim() +  ','+value.billing.email +','+value.billing.phone+','+value.meta_data.filter((e)=>e.key=='_billing_nic')[0].value.replace(/,/g,"").trim() +","+value.billing.company.replace(/,/g,"").trim()+','+value.meta_data.filter((e)=>e.key=='_billing_designation')[0] !=undefined ? value.meta_data.filter((e)=>e.key=='_billing_designation')[0].value :''+','+''+","+value.billing.city;
        
      }if (value.meta_data.filter((e)=>e.key=='_billing_designation').length > 0 && value.meta_data.filter((e)=>e.key=='_billing_area_elaqa').length > 0) {
        var savingData =  value.billing.first_name.replace(/,/g,"").trim() + ' '+value.billing.last_name.replace(/,/g,"").trim()+","+value.billing.address_1.replace(":","").replace(/(\r\n|\n|\r)/gm, " ").replace(/,/g,"").trim() +  ','+value.billing.email +','+value.billing.phone+','+value.meta_data.filter((e)=>e.key=='_billing_nic')[0].value.replace(/,/g,"").trim() +","+value.billing.company.replace(/,/g,"").trim()+','+value.meta_data.filter((e)=>e.key=='_billing_designation')[0].value +','+value.meta_data.filter((e)=>e.key=='_billing_area_elaqa')[0].value+","+value.billing.city;
        
      }
      if(value.meta_data.filter((e)=>e.key=='_billing_designation').length == 0 && value.meta_data.filter((e)=>e.key=='_billing_area_elaqa').length == 0){
        var savingData =  value.billing.first_name.replace(/,/g,"").trim() + ' '+value.billing.last_name.replace(/,/g,"").trim()+","+value.billing.address_1.replace(":","").replace(/(\r\n|\n|\r)/gm, " ").replace(/,/g,"").trim() +  ','+value.billing.email +','+value.billing.phone+','+value.meta_data.filter((e)=>e.key=='_billing_nic')[0].value.replace(/,/g,"").trim() +","+value.billing.company.replace(/,/g,"").trim()+','+'' +','+value.meta_data.filter((e)=>e.key=='_billing_area_elaqa')[0].value+","+value.billing.city;

      }
      if(value.meta_data.filter((e)=>e.key=='_billing_designation').length == 0 && value.meta_data.filter((e)=>e.key=='_billing_area_elaqa').length > 0){
        var savingData =  value.billing.first_name.replace(/,/g,"").trim() + ' '+value.billing.last_name.replace(/,/g,"").trim()+","+value.billing.address_1.replace(":","").replace(/(\r\n|\n|\r)/gm, " ").replace(/,/g,"").trim() +  ','+value.billing.email +','+value.billing.phone+','+value.meta_data.filter((e)=>e.key=='_billing_nic')[0].value.replace(/,/g,"").trim() +","+value.billing.company.replace(/,/g,"").trim()+','+'' +','+value.meta_data.filter((e)=>e.key=='_billing_area_elaqa')[0].value+","+value.billing.city;

      }
        results.push(savingData);
      })
      results.map(async (text)=>{

        await writeCSV(text);
      
      }) 
  }
      // for (let index1 = 0; index1 < data.length; index1++) {
      //  data[index1].billing
      //  var savingData = data[index1].billing.first_name + ' '+data[index1].billing.last_name+","+data[index1].billing.address_1.replace(":","").replace(/(\r\n|\n|\r)/gm, " ").replace(/,/g,"").trim() +  ','+data[index1].billing.email +','+data[index1].billing.phone+','+data[index1].meta_data.map((value)=>value.value)[2]+","+data[index1].billing.company+','+","+data[index1].meta_data.map((value)=>value.value)[1]+','+data[index1].meta_data.map((value)=>value.value)[3];
results.map(async (text)=>{

  await writeCSV(text);

})        
      // }
      //Basic Information
     
      //results =results.concat(await extractedEvaluateCall(page));

    await browser.close();
    return {savingData};
}

async function ReadCSV_urls(){
       var temp = await scrapeProduct();   
}
async function writeCSV(obj){
  console.log(obj);
  var data = await fs.appendFile('Main_Data_'+new Date().getDate()+'-'+new Date().getMonth()+'.csv', obj.split(",").map((x)=>JSON.stringify(x)).toString()+'\n', function (err) {
        if (err) throw err;
      });
      console.log(data);
}
ReadCSV_urls();
