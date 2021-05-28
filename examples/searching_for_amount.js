const AlertsAPI = require('alerts-api')
const donationAlerts = new AlertsAPI({ access_token: '25t46...jMY_' })

async function findRich() {
  let donationsFiltered = []; let page = 1;
  while(true) {
    let donations = await donationAlerts.getDonations(page)
    donationsFiltered.push(...donations.data.filter(don => don.amount >= 150 && don.currency === 'RUB'))
    if(donations.next === undefined){
      break;
    }
    page++
  }
  console.log('Rich people are', donationsFiltered.map(don => don.username).join(', '))
} findRich()