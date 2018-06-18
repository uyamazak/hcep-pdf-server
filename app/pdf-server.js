(async function () {
  /**
   * puppeteer settings
   */
  const puppeteer = require('puppeteer')
  const debug = require('debug')('hcep')
  const defaultMargin = '18mm'
  const defaultPdfOptionKey = 'A4'
  /**
   * PdfOption more detail
   * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
   */
  class PdfOption {
    constructor(options) {
      this.format = options.format
      this.landscape = options.landscape || false
      this.printBackground = typeof options.printBackground !== 'undefined' ? options.printBackground : true
      this.displayHeaderFooter = options.displayHeaderFooter || false
      this.margin = {
        top: options.marginTop || options.margin || defaultMargin,
        right: options.marginRight || options.margin || defaultMargin,
        bottom: options.marginBottom || options.margin || defaultMargin,
        left: options.marginLeft || options.margin || defaultMargin
      }
    }
  }
  const pdfOptions = {
    'A3': new PdfOption({'format': 'A3'}),
    'A3Full': new PdfOption({'format': 'A3', margin: '0mm'}),
    'A3Landscape': new PdfOption({'format': 'A3', landscape: true, margin: '0mm'}),
    'A3LandscapeFull': new PdfOption({'format': 'A3', landscape: true}),
    'A4': new PdfOption({'format': 'A4'}),
    'A4Full': new PdfOption({'format': 'A4', margin: '0mm'}),
    'A4Landscape': new PdfOption({'format': 'A4', landscape: true}),
    'A4LandscapeFull': new PdfOption({'format': 'A4', landscape: true, margin: '0mm'})
  }

  const getPdfOption = function (key) {
    if (!key) {
      debug('use defaultPdfOption:', defaultPdfOptionKey)
      return pdfOptions[defaultPdfOptionKey]
    }
    if (key in pdfOptions) {
      debug('use pdfOption', key)
      return pdfOptions[key]
    } else {
      console.error('key', key, ' is not exists in pdfOptions')
      return pdfOptions[defaultPdfOptionKey]
    }
  }
  const chromeBinary = '/usr/bin/google-chrome'
  const launchOptions = {
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    executablePath: chromeBinary,
  }
  const pageTimeoutMsec = 10000

  // launch browser and page only once
  const browser = await puppeteer.launch(launchOptions)
  const chromeVersion = await browser.version()
  console.log("chromeVersion: ", chromeVersion)
  const page = await browser.newPage()

  /**
   * express settings
   */
  const express = require('express')
  const morgan = require('morgan')
  const app = express()
  const env = app.get('env')
  console.log('env:', env)
  if (env == 'production') {
    app.use(morgan())
  } else {
    app.use(morgan('dev'))
  }

  const bodyParser = require('body-parser')
  app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}))

  const timeout = require('connect-timeout')
  const appTimeoutMsec = 30000
  app.use(timeout(appTimeoutMsec))

  app.listen(8000, function () {
    console.log('Listening on: 8000')
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
      const buff = await page.screenshot({fullPage: true})
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
  process.on('SIGINT', async function () {
    await browser.close()
    console.log('complete browser.close()')
    console.log('process exit with SIGINT')
    await process.exit()
  })
})()
