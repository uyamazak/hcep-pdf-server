const hcPage = async () => {
  const puppeteer = require('puppeteer')
  const launchOptions = (() => {
    let options = {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    }
    if (process.env.HCEP_USE_CHROMIUM === 'true') {
      console.log("use Chromium:")
    }else{
      const chromeBinary = process.env.HCEP_CHROME_BINARY || '/usr/bin/google-chrome'
      options['executablePath'] = chromeBinary
      console.log("use chromeBinary:", chromeBinary)
    }
    return options
  })()
  console.log('launchOptions:', launchOptions)
  // launch browser and page only once
  const browser = await puppeteer.launch(launchOptions)
  const chromeVersion = await browser.version()
  const page = browser.newPage()
  console.log("chromeVersion:", chromeVersion)
  /**
   * Close browser with exit signal.
   */
  const exitHandler = async () => {
    console.log('process exit with SIGINT')
    await browser.close()
    console.log('complete browser.close()')
    await process.exit()
  }
  process.on('SIGINT', exitHandler)
  process.on('SIGTERM', exitHandler)
  return page
}
module.exports.hcPage = hcPage
