const puppeteer = require('puppeteer');
const fetch     = require("node-fetch");


async function getJsonObject(){
  let response = await fetch('https://api.github.com/users/ThomasStuart/repos');
  let data     = await response.json();
  //console.log(data);
  return data;
}

function parseJsonGetRepoNames(data){
  var repoNameList = [];

  for(var i = 0; i < data.length; i++){
      var name = data[i].name;
      repoNameList.push(name);
      console.log("name: " + data[i].name);
  }
  return repoNameList;
}

async function collectCommitCount( repoNames ){
  let a = await scrapeCommitCounts(repoNames);
  return a;
}

async function scrapeCommitCounts( repoNames ){
  const browser = await puppeteer.launch();
  console.log('In scraper function ');

  var a = [];
  for(var i = 0; i < repoNames.length; i++){
      var name = repoNames[i];
      console.log('name' + name);
      var url  = 'https://github.com/ThomasStuart/' + name;
      const page    = await browser.newPage();
      await page.goto(url);
      var rawTxt = 0;
      
      try{
      // get a url
      const [el]   = await page.$x('//*[@id="js-repo-pjax-container"]/div[2]/div/div[2]/div[1]/div[2]/div[1]/div/div[4]/ul/li[1]/a/span/strong');

//*[@id="js-repo-pjax-container"]/div[2]/div/div[2]/div[1]/div[2]/div[1]/div/div[4]/ul/li[1]/a/span/strong
//*[@id="js-repo-pjax-container"]/div[2]/div/div[2]/div[1]/div[3]/div[1]/div/div[4]/ul/li[1]/a/span/strong // MyFirstPullRequest
//*[@id="js-repo-pjax-container"]/div[2]/div/div[2]/div[1]/div[3]/div[1]/div/div[4]/ul/li[1]/a/span/strong //March20
///html/body/div[4]/div/main/div[2]/div/div[2]/div[1]/div[2]/div[1]/div/div[4]/ul/li[1]/a/span/strong
      const txt    = await el.getProperty('textContent');
      rawTxt = await txt.jsonValue();
      console.log({rawTxt});
      //console.log('name:' + name + ', count: ' + rawTxt );
      //a.push([name, rawTxt]);
    }
    catch(err){
      console.log(err.message);
      try{
        const [el]   = await page.$x('//*[@id="js-repo-pjax-container"]/div[2]/div/div[2]/div[1]/div[3]/div[1]/div/div[4]/ul/li[1]/a/span/strong');
        const txt    = await el.getProperty('textContent');
        rawTxt = await txt.jsonValue();
        console.log({rawTxt});
      }
      catch{
        console.log(err.message);
        rawTxt = 0;
      }
    }
    finally{
        a.push([name, rawTxt]);
    }

      //console.log('name:' + name + ', count: ' + {rawTxt});
  }
  //console.log({rawTxt});

  return a;
}

function print( a ){
  console.log('print() method executed');
  for(var i = 0; i < a.length; i++){
      console.log("name: " + a[i][0] + ", commits: ", a[i][1] );
  }
}

getJsonObject()
  .then( allJson     => parseJsonGetRepoNames( allJson ) )
  .then( repoNames   => collectCommitCount( repoNames )   );
  // .then( a           =>  print( a) );
