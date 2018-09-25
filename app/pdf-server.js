const { hcPage } = require('./hc-page')
const { expressApp } = require('./express-app')
process.on('unhandledRejection', function(e){
  console.dir(e)
  console.error('unhandledRejection. process.exit')
  process.exit()
})

const main = async () => {
  const browserPage = await hcPage()
  expressApp(browserPage)
}
main()
