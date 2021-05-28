const AlertsAPI = require('alerts-api')
const donationAlerts = new AlertsAPI({ access_token: '25t46...jMY_' })

async function findVityaSchel() {
  let donations = await donationAlerts.searchWithinMessage('vityaschel@utidteam.com')
  console.log('Best people are', donations.filter(don => don.amount >= 10 && don.currency === 'RUB').map(don => don.username).join(', '))
} findVityaSchel()