const puppeteer=require('puppeteer');
const fs = require('fs');

async function scrapeProduct(url,CurrentRow){
    const browser = await puppeteer.launch({ headless: false });
    const page =  await browser.newPage();
    await page.goto('https://arifl3.sg-host.com/qb-login');
    await page.$eval('#user_login', el => el.value = 'qist.admin');
    await page.$eval('#user_pass', el => el.value = 'NnD08RVtzwEApAeBWgaj72^1'); 
    ///#wp-submit
    await page.click('#wp-submit');
    await page.waitForTimeout(5000)
    var results = []; 

    for (let index = CurrentRow; index < url.length; index++) {
      await page.goto(url[index]);      
      await page.waitForTimeout(3000)
      var [user_cnic]=[];
    var [user_area]=[];
      //Elements
      const [user_ip] = await page.$x('//*[@id="order_data"]/p/span');
      const [user_address] = await page.$x('//*[@id="order_data"]/div[1]/div[2]/div[1]/p[1]');    
      const [user_email] = await page.$x('//*[@id="order_data"]/div[1]/div[2]/div[1]/p[2]/a');
      const [user_phone] = await page.$x('//*[@id="order_data"]/div[1]/div[2]/div[1]/p[3]/a');   
      const [user_designation] = await page.$x('//*[@id="order_data"]/div[1]/div[2]/div[3]/p[3]');
      
      
      ////*[@id="order_data"]/div[1]/div[2]/div[3]/p[2]
      let designation ="";
      //Filter out data
      if (user_designation!=null) {
       designation = await (await user_designation.getProperty('innerText')).jsonValue().then((value)=>value);
       [user_cnic] = await page.$x('//*[@id="order_data"]/div[1]/div[2]/div[3]/p[2]');
[user_area] = await page.$x('//*[@id="order_data"]/div[1]/div[2]/div[3]/p[3]');
        
      }else{
        [user_cnic] = await page.$x('//*[@id="order_data"]/div[1]/div[2]/div[3]/p[1]');
[user_area] = await page.$x('//*[@id="order_data"]/div[1]/div[2]/div[3]/p[2]');
      }
      const ip = await (await user_ip.getProperty('innerText')).jsonValue().then((value)=>value);
      const address = await (await user_address.getProperty('innerText')).jsonValue().then((value)=>value);    
      const email = await (await user_email.getProperty('innerText')).jsonValue().then((value)=>value);
      const phone = await (await user_phone.getProperty('innerText')).jsonValue().then((value)=>value);  
      const cnic = await (await user_cnic.getProperty('innerText')).jsonValue().then((value)=>value);
      const area = await (await user_area.getProperty('innerText')).jsonValue().then((value)=>value);
     
      //Basic Information
      var savingData = ip + ','+address.split('\n')[0] + ','+address.replace(/(\r\n|\n|\r)/gm, " ").replace(/,/g,"").trim() +  ','+email +','+phone.split('\n').pop() +','+cnic.split('\n').pop() +','+area.split('\n').pop();
      //results =results.concat(await extractedEvaluateCall(page));
      await writeCSV(savingData);

    }
    await browser.close();
    return {savingData};
}

async function ReadCSV_urls(){
    let data_lines=require('fs').readFileSync('urls.txt', 'utf-8').split(",");
    let CurrentRow=require('fs').readFileSync('Users.csv', 'utf-8').split("\n");
    data_lines = data_lines.map((value,index)=>"https://arifl3.sg-host.com/wp-admin/post.php?post="+data_lines[index].replace(","," ").trim().toString()+"&action=edit")
    // for (let line in data_lines) {
       var temp = await scrapeProduct(data_lines,CurrentRow.length-1);   
    //    var dir = './Users/'+data_lines[line].slice(24).split(".")[0];
    //    if (!fs.existsSync(dir)){
    //    await fs.mkdirSync(dir, { recursive: true });
    // }

      await writeCSV(temp.savingData);
    // }
}
async function writeCSV(obj){
  console.log(obj);
   await fs.appendFile('Users.csv', obj.split(",").map((x)=>JSON.stringify(x)).toString()+'\n', function (err) {
        if (err) throw err;
      });
}
ReadCSV_urls();
