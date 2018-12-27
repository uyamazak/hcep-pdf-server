const request = require('supertest')
const { hcPage } = require('../app/hc-page')
const { expressApp } = require('../app/express-app')
const SERVER_URL = process.env.HCEP_TEST_SERVER_URL || 'http://localhost:8000'
const TAREGT_URL = process.env.HCEP_TEST_TAREGT_URL || 'https://www.google.com'
const HTML_TEST_STRINGS = '<html>ok</html>'
console.log('SERVER_URL:', SERVER_URL)
console.log('TAREGT_URL:', TAREGT_URL)
console.log('HTML_TEST_STRINGS:', HTML_TEST_STRINGS)

const sleep = (waitSeconds, someFunction) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(someFunction())
    }, waitSeconds)
  })
}

describe('requests routes', () => {
  let app
  before(beforeDone => {
    (async() => {
      const browserPage = await hcPage()
      app =  await expressApp(browserPage)
      beforeDone()
    })()
  })
  after(afterDone => {
    (async ()=> {
      await app.close()
      sleep(5000, () => {
        console.log('process.exit!')
        process.exit()
      })
      afterDone()
    })()
  })

  const req = request(SERVER_URL)
  it('Health Check GET /hc', async () => {
    await req.get('/hc')
      .expect(200, 'ok')
  })
  it('GET / with no url', async () => {
    await req.get('/')
      .expect(400, 'get parameter "url" is not set')
  })
  it('GET / with url ' + TAREGT_URL, async () => {
    await req.get('/?url=' + TAREGT_URL)
      .expect('Content-Type', 'application/pdf')
      .expect(200)
  })
  it('POST / html=' + HTML_TEST_STRINGS, async () => {
    await req.post('/')
      .send('html=' + encodeURI(HTML_TEST_STRINGS))
      .expect('Content-Type', 'application/pdf')
      .expect(200)
  })
  it('GET /screenshot with url ' + TAREGT_URL, async () => {
    await req.get('/screenshot?url=' + TAREGT_URL)
      .expect('Content-Type', 'image/png')
      .expect(200)
  })
  it('POST /screenshot html=' + HTML_TEST_STRINGS, async () => {
    await req.post('/screenshot')
      .send('html=' + encodeURI(HTML_TEST_STRINGS))
      .expect('Content-Type', 'image/png')
      .expect(200)
  })
})
