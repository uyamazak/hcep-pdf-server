const gosenExpressApp = (page) => {
  const bodyParser = require('body-parser')
  const debug = require('debug')('hcepPdfServer')
  const express = require('express')
  const ejs = require('ejs')
  const morgan = require('morgan')
  const timeout = require('connect-timeout')
  const appTimeoutMsec = process.env.HCEP_APP_TIMEOUT_MSEC || 30000
  const pageTimeoutMsec = process.env.HCEP_PAGE_TIMEOUT_MSEC || 10000
  const listenPort = process.env.HCEP_PORT || 8000
  /* bytes or string for https://www.npmjs.com/package/bytes */
  const maxRquestSize = process.env.HCEP_MAX_REQUEST_SIZE || '10mb'

  const app = express()
  const env = app.get('env')
  console.log('env:', env)
  if (env == 'production') {
    app.use(morgan())
  } else {
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: false, limit: maxRquestSize }))
  app.use(timeout(appTimeoutMsec))
  app.listen(listenPort, () => {
    console.log('Listening on:', listenPort)
  })
  // https://gist.github.com/malyw/b4e8284e42fdaeceab9a67a9b0263743
  app.route('/')
    .get(async (req, res) => {
      /*
      const html = req.body.html
      if (!html) {
        res.status(400)
        res.contentType("text/plain")
        res.end('post parameter "html" is not set')
        return
      }
      */
      const data = { line1: 'ホウレンソウ', line2: 'たべたい！' }
      const options = {}
      const html = await ejs.renderFile('app/gosen/gosen.html', data, options)
      const selector = '.gosen-preview'
      const padding = 0
      try {
        await page.setContent(html)
        const rect = await page.evaluate(selector => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const { x, y, width, height } = element.getBoundingClientRect();
          return { left: x, top: y, width, height, id: element.id };
        }, selector);
        const buff = await page.screenshot({
          omitBackground: false,
          clip: {
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2 - 150,
            height: rect.height + padding * 2
          }
        })
        res.status(200)
        res.contentType("image/png")
        res.send(buff)
        res.end()
      } catch (e) {
        console.error(e)
        res.contentType("text/plain")
        res.status(500)
        res.end()
      }
    })
  /**
   * Health Check
   */
  app.get('/hc', async (req, res) => {
    debug('health check ok')
    res.status(200)
    res.end('ok')
  })
  return app
}

module.exports.gosenExpressApp = gosenExpressApp
