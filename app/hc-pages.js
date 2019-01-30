const debug = require('debug')('hcepPdfServer:hcPage')
const generateLaunchOptions = () => {
  const options = {
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  }
  if (process.env.HCEP_USE_CHROMIUM === 'true') {
    debug('use Chromium')
  } else {
    const chromeBinary = process.env.HCEP_CHROME_BINARY || '/usr/bin/google-chrome'
    options['executablePath'] = chromeBinary
    debug('use chromeBinary:', chromeBinary)
  }
  return options
}
module.exports.hcPages = async (pagesNum) => {
  if (!pagesNum) {
    pagesNum = 1
  }
  const puppeteer = require('puppeteer')
  const launchOptions = generateLaunchOptions()
  debug('launchOptions:', launchOptions)
  // launch browser and page only once
  const browser = await puppeteer.launch(launchOptions)
  const chromeVersion = await browser.version()
  debug('chromeVersion:', chromeVersion)
  const pages = []
  for(let i=0; i < pagesNum; i++){
    debug('page launched No.' + i)
    pages.push(await browser.newPage())
  }
  return pages
}
