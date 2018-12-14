const { hcPage } = require('./hc-page')
const { expressApp } = require('./express-app')
process.on('unhandledRejection', function(e){
  console.error('unhandledRejection. process.exit', e)
  process.exit()
})

const main = async () => {
  const browserPage = await hcPage()
  expressApp(browserPage)
}
main()
