
# OneSignal Nodejs Notification api wrapper

[![Tests](https://travis-ci.org/Palmabit-IT/onesignal-notification.svg?branch=master)](https://travis-ci.org/Palmabit-IT/onesignal-notification)

This is an unofficial wrapper/client for the [OneSignal notification API](https://documentation.onesignal.com/reference#create-notification) that runs on Node.JS. 
A list of selected wrappers for different languages and environments is available at the Developer site's Libraries page.


## Installation

`$ npm install onesignal-notification`

## Usage

```
const OnesignalNotificationApi = require('onesignal-notification')
const api = new OnesignalNotificationApi('MY-REST-KEY', 'APP-ID')

const message = {
  it: 'Some message',
  en: 'Some message'
}

api.sendToAll(message, null, (err, res) => {
  console.log(err)
  console.log(res)
})
```

## API

### sendToAll

```
const OnesignalNotificationApi = require('onesignal-notification')
const api = sendToAll(message, options, callback)
```

### sendToSegment

//Coming Soon

### sendToDevices

//Coming Soon

### ...

## Test

`npm test`

### Coverage

`npm run coverage`

## Development

See something you think can be improved? [Open an issue](https://github.com/Palmabit-IT/onesignal-notification/issues/new) or clone the project and send a pull request with your changes.

## Author

[Palmabit](https://palmabit.com)

## License

[MIT license](LICENSE)