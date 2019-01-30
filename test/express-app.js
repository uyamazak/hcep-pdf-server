const request = require('supertest')
const { hcPages } = require('../app/hc-pages')
const { expressApp } = require('../app/express-app')
const SERVER_URL = process.env.HCEP_TEST_SERVER_URL || 'http://localhost:8000'
const TAREGT_URL = process.env.HCEP_TEST_TAREGT_URL || 'https://www.google.com'
const LAUNCH_HC_PAGES_NUM = Number(process.env.LAUNCH_HC_PAGES_NUM) || 5
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

describe('requests routes', function ()  {
  this.timeout(2000 * LAUNCH_HC_PAGES_NUM)
  let app
  before(beforeDone => {
    (async() => {
      const browserPages = await hcPages(LAUNCH_HC_PAGES_NUM)
      app = await expressApp(browserPages)
      beforeDone()
    })()
  })

  after(afterDone => {
    /*
    しばらくコネクションが残るため
    expressのプロセスが終わらないので
    テスト終了後、少し待って明示的に終了
    */
    (async ()=> {
      await app.close()
      sleep(5000, () => {
        console.log('testing express-app complete! process.exit()')
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
      .expect((res) => {
        const contentLength = Number(res.headers['content-length'])
        if (contentLength < 1024) {
          throw new Error('content-length is less than 1KB ' + contentLength)
        }
      })
      .expect(200)
  })

  it('POST / html=' + HTML_TEST_STRINGS, async () => {
    await req.post('/')
      .send('html=' + encodeURI(HTML_TEST_STRINGS))
      .expect('Content-Type', 'application/pdf')
      .expect((res) => {
        const contentLength = Number(res.headers['content-length'])
        if (contentLength < 1024) {
          throw new Error('content-length is less than 1KB ' + contentLength)
        }
      })
      .expect(200)
  })

  it('LAUNCH_HC_PAGES_NUM of concurrent access to POST / html=' + HTML_TEST_STRINGS, async () => {
    function task() {
      return new Promise(async function(resolve) {
        await req.post('/')
          .send('html=' + encodeURI(HTML_TEST_STRINGS))
          .expect('Content-Type', 'application/pdf')
          .expect(200)
        resolve()
      })
    }
    const tasks = []
    for (let i=0; i<LAUNCH_HC_PAGES_NUM; i++) {
      tasks.push(task())
    }
    await Promise.all(tasks)
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
