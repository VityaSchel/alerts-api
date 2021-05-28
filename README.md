# alerts-api — API wrapper for Donation Alerts written in NodeJS with promises support

![GitHub top language](https://img.shields.io/github/languages/top/VityaSchel/alerts-api)
![GitHub](https://img.shields.io/github/license/VityaSchel/alerts-api)
![npm](https://img.shields.io/npm/dw/alerts-api)

There was no library so I did it myself. Fuck Mail.ru and their developers.

Feature matrix:

✅ Latest donations with pagination\
✅ Retreiving user profile information\
✅ Recursive searching through donations messages\
✅ Custom alerts (reusable)\
✅ Refreshing tokens\
✅ Access token generation\
✅ OAuth link generation\
❌ Merchandise API\
❌ Centrifugo & Polls updates

## Installation

```
$ npm i alerts-api
```

OR

```
yarn add alerts-api
```

## Usage

```javascript
const AlertsAPI = require('alerts-api')
/*    OR USE ES6 IMPORT:   */
import AlertsAPI from 'alerts-api'

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
  - Config object example:
  - ```javascript
    {
      clientID: 690,                        // required; must be a number; app id in your app's settings;
      clientSecret: '7N...RDY',             // required; must be a string; private "API key" in your app's settings;
      redirectURI: 'https://example.com/',  // required; must be a string; correct url specified in your app's settings; must end with slash
      code: 'def502...e8d',                 // required; must be a string; code you got from oauth authorization after redirection
    }
    ```
  - Returned object example:
  - ```javascript
    {
      token_type: 'Bearer',
      expires_in: 61235,
      access_token: 'RDY...7N',
      refreshToken: 'd50...bc'
    }
    ```

- ASYNC **refreshToken(config)**
  - Refreshes access token to prevent expiring by exchanging refresh_token
  - Method accepts exactly 1 argument: config object
  - DO NOT CHANGE SCOPES! USE EXACTLY THE SAME SCOPES YOU USED FOR OBTAINING AUTHORZATION CODE!!!
  - Config object example:
  - ```javascript
    {
      clientID: 690,                        // required; must be a number; app id in your app's settings;
      clientSecret: 'd50...bc',             // required; must be a string; private "API key" in your app's settings;
      refreshToken: 'https://example.com/', // required; must be a string; refresh_token you received in the same response with access_token;
      scopes: ['oauth-user-show'],          // required; must be an array of strings; possible scopes are below in this documentation
    }
    ```
  - Returned object example:
  - ```javascript
    {
      token_type: 'Bearer',
      expires_in: 61235,
      access_token: 'RDY...7N',
      refreshToken: 'd50...bc'
    }
    ```

- ASYNC **getUser()**
  - Method returns user information (endpoint: https://www.donationalerts.com/api/vXXX/user/oauth)
  - Returned object example:
  - ```javascript
      {
        data: {
          id: 918237,
          code: 'vityaschel',
          name: 'VityaSchel',
          avatar: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/41780b5a-def8-11e9-94d9-784f43822e80-profile_image-300x300.png',
          email: 'vityaschel@utidteam.com',
          language: 'en_US',
          socket_connection_token: 'sfysjdhgaskduqhtwldiqdguaskdajsd'
      }
    }
    ```

- ASYNC **getDonations(page, raw)**
  - Method returns latest donations (endpoint: https://www.donationalerts.com/api/v1/alerts/donations)
  - page is optional; defaults to 1; must be a number;
  - raw is optional; defaults to false; must be a boolean;
  - use raw = true if you want to get raw response from donation alerts api
  - returns an object; below is an example of it
  - data will always be array
  - use .next() and .prev() functions to fetch new pages (use with await/.then)
  - if there is no next/previous page, no function will be in response
  - Returned object example:
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
  - Returned object example:
  - ```javascript
    [
      id: 123456,
      name: 'donation',
      username: 'donator`s name',
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
    ]
    ```

- ASYNC **sendCustomAlert(alert)**
  - Method sends custom alert to user (endpoint: https://www.donationalerts.com/api/v1/custom_alert)
  - alert is an instance of CustomAlert class created with constructor with specifig config (see api reference below)
  - Usage example:
  - ```javascript
    await sendCustomAlert(myAlert)
    ```

- class **CustomAlert** inside AlertsAPI class
  - Use it for sendCustomAlert method (see above)
  - Constructor accepts exactly 1 argument: object
  - external_id is generated automatically from 0 up to Number.MAX_SAFE_INTEGER
  - ```javascript
    {
      header: 'Text',                             // optional; defaults to ''; up to 255 characters long string that will be displayed as a header
      message: 'Text',                            // optional; defaults to ''; Up to 300 characters long string that will be displayed inside the message box
      is_shown: 1,                                // optional; defaults to 1; A value containing 0 or 1. Determines whether the alert should be displayed or not.
      image_url: 'https://example.com/image.png', // optional; defaults to ''; Up to 255 characters long URL to the image file that will displayed along with the custom alert
      sound_url: 'https://example.com/sound.mp3'  // optional; defaults to ''; Up to 255 characters long URL to the sound file that will played when displaying the custom
    }
    ```
  - Example of creation instance:
  - ```javascript
    let myAlert = new AlertsAPI.CustomAlert({ header: 'My Alert', message: 'Hello world!' })
    ```

## More examples

- [Generating OAuth authorization link](https://github.com/VityaSchel/alerts-api/blob/master/examples/oauth_link_generation.js)
- [Obtaining access token by exchanging authorization code](https://github.com/VityaSchel/alerts-api/blob/master/examples/access_token_exchanging.js)
- [Collecting user profile](https://github.com/VityaSchel/alerts-api/blob/master/examples/collecting_user_profile.js)
- [Searching for specific email through all donations](https://github.com/VityaSchel/alerts-api/blob/master/examples/searching_for_specific_email.js)
- [Searching every donation with amount >= 228](https://github.com/VityaSchel/alerts-api/blob/master/examples/searching_for_amount.js)

## Contribution

Please maintain this repository please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please please 🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏  🙏

PRs are welcome, email me (vityaschel@utidteam.com) if you want to maintain this repository.
