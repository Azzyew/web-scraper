const puppeteer = require('puppeteer');
const fs = require('fs');

async function firstPage() {
  try {
    const URL = 'https://naruto.fandom.com/wiki/Category:Characters'
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()

    await page.goto(URL)
    // let pagesToScrape = 7;
    // let currentPage = 1;
    let data = []
    // while (currentPage <= pagesToScrape) {
      let newResults = await page.evaluate(() => {
        let results = []
        let items = document.querySelectorAll('.category-page__member-link')
        items.forEach((item) => {
          const sufix = item.getAttribute('href')
          const newUrl = `https://naruto.fandom.com${sufix}`
          results.push(
            newUrl,
          )
        })
        return results
      })
        
    data = data.concat(newResults)
    // if (currentPage < pagesToScrape) {
    //   await page.click('.category-page__pagination-next')
    //   await page.waitForSelector('.category-page__member-link')
    //   await page.waitForSelector('.category-page__pagination-next')
    // }

    // currentPage++;

    // }
    console.log(data)
    console.log(data.length)

    var newData = JSON.stringify(data);
    fs.writeFile('URLs.json', newData, err => {
      if(err) throw err;
      console.log("New data added");
    });

    await browser.close()
  } catch (error) {
    console.error(error)
  }
}

firstPage()
