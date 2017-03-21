'use strict'

const request = require('request')

class OnesignalApi {

  constructor(restKey, appId) {
    this.restKey = restKey
    this.appId = appId
  }

  sendToAll(message, options, callback) {
    
    const action = '_segment'
    request(
      this._buildOptions(message, action, options),
      (err, response, body) => {
        this._responder(err, response, body, callback)
      })

  }

  _responder(err, response, body, callback) {
    if (err) {
      return callback(err)
    }
    if (body.errors) {
      return callback(null, body.errors)
    }
    callback(null, body)
  }

  _headers() {
    return {
      'Authorization': `Basic ${this.restKey}`,
      'Content-Type': 'application/json'
    }
  }

  _appId() {
    return {
      'app_id': this.appId,
    }
  }

  _content(message) {
    return {
      'contents': message
    }
  }

  _data(data) {
    return {
      'data': data || {}
    }
  }

  _segment(segment) {
    return {
      'included_segments': segment || ['All']
    }
  }

  _filter(filters) {
    return {
      'filters': filters || []
    }
  }

  _player(player_ids) {
    return {
      'include_player_ids': player_ids || []
    }
  }

  _buildBody(message, action, option) {
    return Object.assign({},
      this._appId(),
      this._data(),
      this._content(message),
      this[action](option))
  }

  _buildOptions(message, action, options) {
    return {
      method: 'POST',
      uri: 'https://onesignal.com/api/v1/notifications',
      headers: this._headers(),
      json: true,
      body: this._buildBody(message, action, options)
    }
  }

}

module.exports = OnesignalApi