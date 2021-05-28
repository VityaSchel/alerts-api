const fetch = require('node-fetch')

const ERRORS = {
  noAccessToken: 'AlertsAPI: No access token specified in config object in contructor',
  versionVariableType: 'AlertsAPI: Version number specified in config object in contstructor must be number',
  alertInstanceIncorrect: 'AlertsAPI: Provided alert to sendCustomAlert must be an instance of CustomAlert class',
}
const DEFAULT_API_VERSION = 1

class AlertsAPI {
  static CustomAlert = class CustomAlert {
    constructor(config) {
      this.config = config
    }
  }

  constructor(config) {
    this.access_token = config.access_token
    if(config.access_token === undefined || config.access_token === ''){ throw ERRORS.noAccessToken }
    if(config.version !== undefined && typeof config.version !== 'Number'){ throw ERRORS.versionVariableType }
    this.basePath = `https://www.donationalerts.com/api/v${config.version ?? DEFAULT_API_VERSION}`
  }

  static generateOauthLink(config) {
    let scopes = config.scopes.join(' ')
    return `https://www.donationalerts.com/oauth/authorize?client_id=${config.clientID}&redirect_uri=${encodeURI(config.redirectURI)}&response_type=code&scope=${encodeURI(scopes)}`
  }

  static async getAccessToken(config) {
    let request = await fetch(`https://www.donationalerts.com/oauth/token`, {
      method: 'POST', body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: config.clientID,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectURI,
        code: config.code
      }), headers: { 'Content-Type': 'application/json' },
    })

    return await request.json()
  }

  async refreshToken(config) {
    let request = await fetch(`https://www.donationalerts.com/oauth/token`, {
      method: 'POST', body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: config.clientID,
        client_secret: config.clientSecret,
        refresh_token: config.refreshToken,
        scope: config.scopes.join(' ')
      }), headers: { 'Content-Type': 'application/json' },
    })

    return await request.json()
  }

  async getUser() {
    let request = await fetch(`${this.basePath}/user/oauth`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.access_token}` }
    })
    return await request.json()
  }

  async getDonations(page = 1, raw = false) {
    page = page ?? 1
    let request = await fetch(`${this.basePath}/alerts/donations?page=${page}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.access_token}` }
    })
    let response = await request.json()
    if(raw){ return response }
    let apiResponse = {
      data: response.data ?? []
    }
    apiResponse.page = page
    if(response?.links?.next !== null){
      apiResponse.next = () => this.getDonations(response.next)
    }
    if(response?.links?.prev !== null){
      apiResponse.prev = () => this.getDonations(response.prev)
    }
    return apiResponse
  }

  async searchWithinMessage(term, pageLimit = 0, caseSensetive = true) {
    pageLimit = pageLimit<=0?pageLimit=Infinity:0
    let donationsFiltered = []
    for (let page = 1; page <= pageLimit; page++) {
      let donations = await this.getDonations(page)
      donationsFiltered.push(...donations.data.filter(donation => {
        if(!caseSensetive){
          return donation.message.toLowerCase().includes(term.toLowerCase())
        } else {
          return donation.message.includes(term)
        }
      }))
      if(donations.next === undefined){
        break;
      }
    }
    return donationsFiltered
  }

  async sendCustomAlert(alert) {
    let isInstance = false
    if(typeof alert !== 'object'){ throw ERRORS.alertInstanceIncorrect }
    try {
      isInstance = alert instanceof AlertsAPI.CustomAlert
    } catch(e) {
      throw ERRORS.alertInstanceIncorrect
    }
    if(!isInstance) { throw ERRORS.alertInstanceIncorrect }
    let request = await fetch(`${this.basePath}/custom_alert`, {
      method: 'POST',
      body: JSON.stringify({
        external_id: Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
        ...alert.config
      }),
      headers: { 'Authorization': `Bearer ${this.access_token}`, 'Content-Type': 'application/json' }
    })
    return await request.json()
  }
}

module.exports = AlertsAPI