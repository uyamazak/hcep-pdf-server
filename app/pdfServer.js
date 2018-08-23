(async () => {
  const puppeteer = require('puppeteer')
  const express = require('express')
  const morgan = require('morgan')
  const timeout = require('connect-timeout')
  const bodyParser = require('body-parser')
  const debug = require('debug')('hcepPdfServer')
  const { getPdfOption } = require('./pdfOption')

  const chromeBinary = process.env.HCEP_CHROME_BINARY || '/usr/bin/google-chrome'
  const appTimeoutMsec = process.env.HCEP_APP_TIMEOUT_MSEC || 30000
  const pageTimeoutMsec = process.env.HCEP_PAGE_TIMEOUT_MSEC || 10000
  const listenPort = process.env.HCEP_PORT || 8000
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
      console.log("chromeBinary:", chromeBinary)
    }
    return options
  })(useChromium)

  // launch browser and page only once
  const browser = await puppeteer.launch(launchOptions)
  const chromeVersion = await browser.version()
  const page = await browser.newPage()
  console.log("chromeVersion:", chromeVersion)
  console.log('useChromium:', useChromium)
  /**
   * express settings
   */
  const app = express()
  const env = app.get('env')
  console.log('env:', env)
  if (env == 'production') {
    app.use(morgan())
  } else {
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
  app.use(timeout(appTimeoutMsec))
  app.listen(listenPort, () => {
    console.log('Listening on:', listenPort)
  })

  /**
   * Receive get request with target page's url
   * @req.query.url {String} page's url
   * @req.query.pdf_option {String} a key of pdfOptions
   * @return binary of PDF or error response
   */
  app.get('/', async (req, res) => {
    const url = req.query.url
    if (!url) {
      await res.status(400)
      res.end('get parameter "url" is not set')
      return
    }
    try {
      await page.goto(
        url, {
          timeout: pageTimeoutMsec,
          waitUntil: ["load", "domcontentloaded"]
        }
      )
      const buff = await page.pdf(getPdfOption(req.query.pdf_option))
      await res.status(200)
      await res.contentType("application/pdf")
      await res.send(buff)
      res.end()
    } catch (e) {
      await console.log(e)
      await res.status(503)
      res.end()
    }
  })

  /**
   * Receive post request with target html
   * @req.body.html {String} page's html content
   * @req.body.pdf_option {String} a key of pdfOptions
   * @return binary of PDF or error response
   */
  app.post('/', async (req, res) => {
    const html = req.body.html
    if (!html) {
      await res.status(400)
      res.end('post parameter "html" is not set')
      return
    }
    try {
      await page.setContent(html)
      const buff = await page.pdf(getPdfOption(req.body.pdf_option))
      await res.status(200)
      await res.contentType("application/pdf")
      await res.send(buff)
      res.end()
    } catch (e) {
      console.log(e)
      await res.status(503)
      res.end()
    }
  })

  /**
   * Receive post request with target html
   * @req.body.html {String} page's html content
   * @return binary of PNG or error response
   */
  app.post('/screenshot', async (req, res) => {
    const html = req.body.html
    if (!html) {
      await res.status(400)
      res.end('post parameter "html" is not set')
      return
    }
    try {
      await page.setContent(html)
      const buff = await page.screenshot({ fullPage: true })
      await res.status(200)
      await res.contentType("image/png")
      await res.send(buff)
      await res.end()
    } catch (e) {
      console.log(e)
      await res.status(503)
      res.end()
    }
  })

  /**
   * Health Check and show Chrome version in header
   */
  app.get('/hc', async (req, res) => {
    debug('health check ok')
    await res.status(200)
    await res.setHeader('X-Chrome-Version', chromeVersion)
    res.end('ok')
  })

  /**
   * Close browser with exit signal.
   */
  process.on('SIGINT', async () => {
    await browser.close()
    console.log('complete browser.close()')
    console.log('process exit with SIGINT')
    await process.exit()
  })
})()
