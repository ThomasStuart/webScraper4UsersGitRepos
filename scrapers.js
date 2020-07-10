const puppeteer = require('puppeteer');
const fetch = require("node-fetch");

async function scrapeProject(url){
  const browser = await puppeteer.launch();
  const page    = await browser.newPage();
  await page.goto(url);

  //For an image
  // const [el1]  = await page.$x('');
  // const imgSrc = await el1.getProperty('src');
  // const srcTxt = await imgSrc.jsonValue();

  const [el2]  = await page.$x('//*[@id="js-repo-pjax-container"]/div[2]/div/div[2]/div[1]/div[2]/div[1]/div/div[4]/ul/li[1]/a/span/strong');
  const txt    = await el2.getProperty('textContent');
  const rawTxt = await txt.jsonValue();

  console.log({rawTxt});
  browser.close();
}


async function getRepos(){
  let response = await fetch('https://api.github.com/users/ThomasStuart/repos');
  let data     = await response.json()
  return data;
}

function collectRepoNamesFromUser(data){
  var repoNameList = [];
  for(var i = 0; i < data.length; i++){
      var name = data[i].name;
      //repoNameList.push(name);
      console.log("name: " + data[i].name);
  }
  return repoNameList;
}

function print( names ){
  for(var i = 0; i < names.length; i++){
      console.log("name: " + names );
  }
}

//scrapeProject('https://github.com/ThomasStuart/prework-repo');
//getRepos().then(data => console.log(data));
getRepos().then( data => collectRepoNamesFromUser( data ) );

// same as above, but response.json() parses the remote content as JSON
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => alert(user.name)); // iliakan, got user name
