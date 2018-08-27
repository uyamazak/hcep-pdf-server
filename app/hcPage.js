const hcPage = async () => {
  const puppeteer = require('puppeteer')
  const chromeBinary = process.env.HCEP_CHROME_BINARY || '/usr/bin/google-chrome'
  const useChromium = (value => {
    if (value === 'true') {
      return true
    } else {
      return false
    }
  })(process.env.HCEP_USE_CHROMIUM)

  const launchOptions = (useChromium => {
    let options = {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    }
    if (!useChromium) {
      options['executablePath'] = chromeBinary
      console.log("use chromeBinary:", chromeBinary)
    }
    return options
  })(useChromium)

  // launch browser and page only once
  const browser = await puppeteer.launch(launchOptions)
  const chromeVersion = await browser.version()
  const page = browser.newPage()
  console.log("chromeVersion:", chromeVersion)
  console.log('useChromium:', useChromium)

  // expressApp(page)
  /**
   * Close browser with exit signal.
   */
  process.on('SIGINT', async () => {
    console.log('complete browser.close()')
    console.log('process exit with SIGINT')
    await browser.close()
    await process.exit()
  })
  return page
}
module.exports.hcPage = hcPage
