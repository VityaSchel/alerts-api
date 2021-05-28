const AlertsAPI = require('alerts-api')
const donationAlerts = new AlertsAPI({ access_token: '25t46...jMY_' })

async function exchangeCodeToAccessToken() {
  let token = await AlertsAPI.getAccessToken({
    clientID: 512,
    clientSecret: '7...9LODY',
    redirectURI: 'https://example.com/',
    code: 'c1a4...380693',
  })
  console.log(token.access_token)
} exchangeCodeToAccessToken()