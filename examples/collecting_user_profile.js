const AlertsAPI = require('alerts-api')
const donationAlerts = new AlertsAPI({ access_token: '25t46...jMY_' })

async function collectUserProfile() {
  let user = await donationAlerts.getUser()
  console.log(`${user.name} speaks in ${user.language} and has email ${user.email}!`)
} collectUserProfile()