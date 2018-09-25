const { hcPage } = require('./hc-page')
const { expressApp } = require('./express-app')

const main = async () => {
  const browserPage = await hcPage()
  expressApp(browserPage)
}
try {
  main()
} catch(e) {
  console.error('Unhandling error in main(). process.exit:', e)
  process.exit()
}
