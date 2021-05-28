const AlertsAPI = require('alerts-api')

async function oauthlink() {
  console.log(await AlertsAPI.generateOauthLink(
    { clientID: 981, redirectURI: 'https://example.com/',
      scopes: ['oauth-user-show','oauth-donation-subscribe',
      'oauth-donation-index']
    })
  )
} oauthlink()