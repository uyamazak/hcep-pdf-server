const { hcPage } = require('./hcPage')
const { expressApp } = require('./expressApp')

const main = async () => {
  const browserPage = await hcPage()
  expressApp(browserPage)
}
main()
