const puppeteer = require('puppeteer'); 
const mongoose = require('mongoose');
const fs = require('fs').promises;
const Character = require('./Character.js');
require('dotenv').config();

const uri = process.env.DB_CONNECTION_URI;
mongoose.connect(uri);

let links = [];

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    const urls = JSON.parse(data);
    links = urls;
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

async function getCharacterData() {
  try {
    await readFile('URLs.json');
    // console.log(links);
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    
    for (let link of links) {
      await page.goto(link);
      console.log(link);

      const newResults = await page.evaluate(() => {
        let results;
        let fullName;
        let imgSrc;
        
        const getFullName = document.querySelector('tbody th[class="mainheader lightheader"] span[class="title"]');
        const getName = document.querySelector('.mainheader').innerText;
        const prefixName = getName.substring('edit\n'.length);
        const name = prefixName.slice(0, prefixName.lastIndexOf('[1]')).trim();
        const img = document.querySelector('.imagecell img');
        
        getFullName ? fullName = getFullName.innerText : fullName = "";
        img ? imgSrc = img.getAttribute('src') : imgSrc = "";

        results = {
          fullName: fullName,
          name: name,
          img: imgSrc
        }
        
        return results;
      })
      await Character.create(newResults);
    }

    await browser.close();
  } catch(err) {
    console.error(err);
  }
}

getCharacterData();
