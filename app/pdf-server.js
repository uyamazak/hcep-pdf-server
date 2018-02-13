(async function() {
  /**
   * puppeteer settings
   */
  const puppeteer = require('puppeteer');
  const pdfOptions = {
    landscape: false,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin :{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  };
  console.log("pdfOptions\n", pdfOptions);
  const chromeBinary = '/usr/bin/google-chrome'
  const launchOptions = {
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    executablePath: chromeBinary,
  };
  const pageTimeoutMsec = 10000;
  // launch browser and page only once
  const browser = await puppeteer.launch(launchOptions);
  console.log("chrome version:", await browser.version());
  const page = await browser.newPage();

  /**
   * express settings
   */
  const express = require('express');
  const app = express();
  const bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({ extended: false }));

  const timeout = require('connect-timeout');
  const appTimeoutMsec = 30000;
  app.use(timeout(appTimeoutMsec));

  app.listen(8000, function(){
    console.log('Listening on 8000');
  });

  /**
   * Receive get request with target page's url
   * @param url {String} page's url
   * @return binary of PDF or error response
   */
  app.get('/', async (req, res) => {
    //PDF from url
    const url = req.query.url;
    if (! url) {
      res.status(400);
      res.end('get parameter "url" is not set');
      return;
    }
    try{
      console.time('PDF_FROM_URL');
      await page.goto(
        url,
        {
          timeout: pageTimeoutMsec,
          waitUntil:["load", "domcontentloaded"]
        }
      );
      const buff = await page.pdf(pdfOptions);
      console.timeEnd('PDF_FROM_URL');
      res.status(200);
      res.contentType("application/pdf");
      res.send(buff);
      res.end();
    } catch(e) {
      console.log(e);
      res.status(503);
      res.end();
    }

  });

  /**
   * Receive post request with target html
   * @param url {String} page's html content
   * @return binary of PDF or error response
   */
  app.post('/', async (req, res) => {
    // PDF from html
    const html = req.body.html;
    if (! html) {
      res.status(400);
      res.end('post parameter "html" is not set');
      return;
    }
    try{
      console.time('PDF_FROM_CONTENT');
      await page.goto(
        `data:text/html,${html}`,
        {
          timeout: pageTimeoutMsec,
          waitUntil:["load", "domcontentloaded"]
        }
      );
      const buff = await page.pdf(pdfOptions);
      console.timeEnd('PDF_FROM_CONTENT');
      res.status(200);
      res.contentType("application/pdf");
      res.send(buff);
      res.end();
    } catch(e) {
      console.log(e);
      res.status(503);
      res.end();
    }
  });

  // Health Check
  app.get('/hc', function (req, res) {
    console.log('health check ok');
    res.setHeader( 'X-Chrome-Version', chromeVersion);
    res.status(200);
    res.end('ok');
  });

  process.on('SIGINT', async function() {
    await browser.close();
    console.log('complete browser.close()');
    console.log('process exit with SIGINT');
    await process.exit();
  });
})();

