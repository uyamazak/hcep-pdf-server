//const { hcPage } = require('./hc-page')
const { hcPages } = require('./hc-pages')
const { expressApp } = require('./express-app')
const LAUNCH_HC_PAGES_NUM = Number(process.env.LAUNCH_HC_PAGES_NUM) || 30
console.error('LAUNCH_HC_PAGES_NUM', LAUNCH_HC_PAGES_NUM)
process.on('unhandledRejection', function(e){
  console.error('unhandledRejection. process.exit', e)
  process.exit()
})

const main = async () => {
  const browserPages = await hcPages(LAUNCH_HC_PAGES_NUM)
  expressApp(browserPages)
}
main()
