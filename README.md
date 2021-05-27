# alerts-api — API wrapper for Donation Alerts written in NodeJS with promises support

![GitHub top language](https://img.shields.io/github/languages/top/VityaSchel/alerts-api)
![GitHub](https://img.shields.io/github/license/VityaSchel/alerts-api)
![npm](https://img.shields.io/npm/dm/VityaSchel/alerts-api)

There was no library so I did it myself. Fuck Mail.ru and their developers. PRs are welcome, email me (vityaschel@utidteam.com) if you want to maintain this repository.

Currently supports only 2 methods: getUser; getDonations() with pagination and recursive searching, do not supports Merchandises API, do not supports polls, do not supports custom alerts.

## Installation

`$ npm i alerts-api`

## Usage

```javascript
const AlertsAPI = require('alerts-api')
/* OR USE ES6 IMPORT:
import AlertsAPI from 'alerts-api'
*/

const donationAlerts = new AlertsAPI({ access_token: '' })

async function getUserPictureURL() {
  let user = await donationAlerts.getUser()
  console.log(user.avatar)
}

getUserPictureURL()
```

## API reference

### Constructor config object

Constructor accepts exactly 1 argument: config object

```javascript
{
  access_token: 'def502...e8d',   // required; must be a string; token you obtain from exchanging authorization code
  version: 1                      // optional; defaults to 1; must be a number; version of API
}
```

### All methods

- STATIC ASYNC **generateOauthLink(config)**
  - Generates an oauth authorization link which you have to send to user in order to get authorization code to exchange it to access_token later
  - Method accepts exactly 1 argument: config object
  - ```javascript
    {
      clientID: 690,                         // required; must be a number; app id in your app's settings
      redirectURI: 'https://example.com/',   // required; must be a string; correct url specified in your app's settings; must end with slash
      scopes: ['oauth-user-show']            // required; must be an array of strings; possible scopes are below in this documentation
    }
    ```

- STATIC ASYNC **getAccessToken(config)**
  - Exchanges authorization code on access token needed for every API request
  - Method accepts exactly 1 argument: config object
  - ```javascript
    {
      clientID: 690,                        // required; must be a number; app id in your app's settings;
      clientSecret: '7N...RDY',             // required; must be a string; private "API key" in your app's settings;
      redirectURI: 'https://example.com/',  // required; must be a string; correct url specified in your app's settings; must end with slash
      code: 'def502...e8d',                 // required; must be a string; code you got from oauth authorization after redirection
    }
    ```

- ASYNC **refreshToken(config)**
  - Refreshes access token to prevent expiring by exchanging refresh_token
  - Method accepts exactly 1 argument: config object
  - ** DO NOT CHANGE SCOPES! USE EXACTLY THE SAME SCOPES YOU USED FOR OBRAINING AUTHORZATION CODE!!! **
  - ```javascript
    {
      clientID: 690,                        // required; must be a number; app id in your app's settings;
      clientSecret: 'd50...bc',             // required; must be a string; private "API key" in your app's settings;
      refreshToken: 'https://example.com/', // required; must be a string; refresh_token you received in the same response with access_token;
      scopes: ['oauth-user-show'],          // required; must be an array of strings; possible scopes are below in this documentation
    }
    ```

- ASYNC **getUser()**
  - Method returns user information (endpoint: https://www.donationalerts.com/api/vXXX/user/oauth)

- ASYNC **getDonations(page, raw)**
  - Method returns latest donations (endpoint: https://www.donationalerts.com/api/v1/alerts/donations)
  - page is optional; defaults to 1; must be a number;
  - raw is optional; defaults to false; must be a boolean;
  - use raw = true if you want to get raw response from donation alerts api
  - returns an object; below is an example of it
  - data will always be array
  - use .next() and .prev() functions to fetch new pages (use with await/.then)
  - if there is no next/previous page, no function will be in response
  - ```javascript
    {
      data: [
        id: 123456,
        name: 'donation',
        username: 'user name',
        recipient_name: 'your name',
        message: 'most valuable in donations',
        message_type: 'text',
        payin_system: { title: 'Bank card RUB' },
        amount: 24,
        currency: 'RUB',
        is_shown: 1,
        amount_in_user_currency: 24,
        created_at: '2019-01-17 17:17:09',
        shown_at: null
      ],
      page: 1
      next: Function,
      prev: Function
    }
    ```

- ASYNC **searchWithinMessage(term, pageLimit, caseSensetive)**
  - Method searching through every donation and returns the ones with term included() in message field
  - pageLimit is optional; defaults to 0 (no limit)
  - caseSensetive is optional; defaults to true!!

## Bonus (all scopes)

Since mailru is piece of garbage, trash, autists, dcp, patau, dodick, just dicks, ducks, idiots, motherfuckers, thieves, worst place to work if you are programming, they fucked up everything including documentation.

Fortunately for you, I screenshoted all scopes and sent it to them when documentation was fine.

Scopes may not be up to date, anyway, better than literally nothing.

Scope | Description
----- | -----------
oauth-user-show | Obtain profile data
oauth-donation-subscribe | Subscribe to new donation alerts
oauth-donation-index | View donations
oauth-custom_alert-store | Create custom alerts
oauth-goal-subscribe | Subscribe to donation goals updates
oauth-poll-subscribe | Subscribe to polls updates
