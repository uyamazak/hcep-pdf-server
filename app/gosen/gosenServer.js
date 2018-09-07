const { hcPage } = require('../hcPage')
const { gosenExpressApp } = require('./gosenExpressApp')

const main = async () => {
  const browserPage = await hcPage()
  gosenExpressApp(browserPage)
}
main()
