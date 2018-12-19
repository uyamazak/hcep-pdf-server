const debug = require('debug')('hcepPdfServer:hcPage')
const hcPage = async () => {
  const puppeteer = require('puppeteer')
  const launchOptions = (() => {
    const options = {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    }
    if (process.env.HCEP_USE_CHROMIUM === 'true') {
      debug('use Chromium:')
    } else {
      const chromeBinary = process.env.HCEP_CHROME_BINARY || '/usr/bin/google-chrome'
      options['executablePath'] = chromeBinary
      debug('use chromeBinary:', chromeBinary)
    }
    return options
  })()
  debug('launchOptions:', launchOptions)
  // launch browser and page only once
  const browser = await puppeteer.launch(launchOptions)
  const chromeVersion = await browser.version()
  const page = await browser.newPage()
  debug('chromeVersion:', chromeVersion)
  /**
   * Close browser with exit signal.
   */
  const exitHandler = async () => {
    debug('process exit with SIGINT')
    await browser.close()
    debug('complete browser.close()')
    await process.exit()
  }
  process.on('SIGINT', exitHandler)
  process.on('SIGTERM', exitHandler)
  return page
}
module.exports.hcPage = hcPage
