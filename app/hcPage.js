const hcPage = async () => {
  const puppeteer = require('puppeteer')
  const chromeBinary = process.env.HCEP_CHROME_BINARY || '/usr/bin/google-chrome'
  const launchOptions = (() => {
    let options = {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    }
    if (process.env.HCEP_USE_CHROMIUM === 'true') {
      console.log("use Chromium:")
    }else{
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
  const exitHandler =  async (args) => {
    console.log(args)
    const result =  await browser.close()
    console.log('browser.close()', result)
  }
  process.on('exit', exitHandler)
  process.on('SIGINT', function () {
  console.log('Got SIGINT.  Press Control-D to exit.');
});
  //process.on('SIGTERM', exitHandler)
  return page
}
module.exports.hcPage = hcPage
