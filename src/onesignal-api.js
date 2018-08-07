const request = require('request');

const utils = require('./utils');

const isArrayString = utils.isArrayString;

class OnesignalApi {
  constructor(restKey, appId) {
    this.restKey = restKey;
    this.appId = appId;
  }

  sendToAll(message, options, action = 'filter', callback) {
    request(
      this.buildOptions(message, action, options),
      (err, response, body) => {
        OnesignalApi.responder(err, response, body, callback);
      });
  }

  sendToSegments(message, options, callback) {
    let segments;
    if (!Array.isArray(options) || !isArrayString(options)) {
      segments = [];
    }
    segments = options;
    return this.sendToAll(message, segments, 'segment', callback);
  }

  static responder(err, response, body, callback) {
    if (err) {
      return callback(err);
    }
    if (body.errors) {
      return callback(null, body.errors);
    }
    return callback(null, body);
  }

  headers() {
    return {
      Authorization: `Basic ${this.restKey}`,
      'Content-Type': 'application/json; charset=utf-8',
    };
  }

  getAppId() {
    return {
      app_id: this.appId,
    };
  }

  static content(message) {
    return {
      contents: message,
    };
  }

  static data(data) {
    return {
      data: data || {},
    };
  }

  static segment(segment) {
    return {
      included_segments: segment || ['All'],
    };
  }

  static filter(filters) {
    return {
      included_segments: ['All'],
      filters: filters || [],
    };
  }

  static player(playerIds) {
    return {
      include_player_ids: playerIds || [],
    };
  }

  buildBody(message, action, option) {
    return Object.assign(
      {},
      this.getAppId(),
      OnesignalApi.data(),
      OnesignalApi.content(message),
      OnesignalApi[action](option)
    );
  }

  buildOptions(message, action, options) {
    return {
      method: 'POST',
      uri: 'https://onesignal.com/api/v1/notifications',
      headers: this.headers(),
      json: true,
      body: this.buildBody(message, action, options),
    };
  }
}

module.exports = OnesignalApi;
