const nock = require('nock');

const OnesignalApi = require('./onesignal-api');

describe('OneSignalApi', () => {
  const credentials = {
    restKey: 'somerestKey',
    appId: 'someappId',
  };

  const api = new OnesignalApi(credentials.restKey, credentials.appId);

  it('should set restKey and appId', () => {
    expect(api.restKey).toBe(credentials.restKey);
    expect(api.appId).toBe(credentials.appId);
  });

  it('should set header', () => {
    const headers = {
      Authorization: `Basic ${credentials.restKey}`,
      'Content-Type': 'application/json; charset=utf-8',
    };

    expect(api.headers()).toEqual(headers);
  });

  it('should set appId', () => {
    const appId = {
      app_id: credentials.appId,
    };

    expect(api.getAppId()).toEqual(appId);
  });

  it('should set content', () => {
    const message = {
      it: 'Some dummy text',
      en: 'Some dummy text',
    };

    const content = {
      contents: message,
    };

    expect(OnesignalApi.content(message)).toEqual(content);
  });


  it('should set data', () => {
    const data = {
      foo: 'bar',
    };

    expect(OnesignalApi.data()).toEqual({ data: {} });
    expect(OnesignalApi.data(data)).toEqual({ data });
  });

  it('should build body', () => {
    const message = {};
    let action = 'segment';
    let option = null;

    let body = api.buildBody(message, action, option);
    let expected = {
      contents: message,
      app_id: api.appId,
      data: {},
      included_segments: ['All'],
    };

    expect(body).toEqual(expected);

    action = 'filter';
    option = [
      {
        field: 'tag', key: 'level', relation: '=', value: '10',
      },
      { operator: 'OR' }, { field: 'amount_spent', relation: '>', value: '0' },
    ];
    body = api.buildBody(message, action, option);

    expected = {
      contents: message,
      app_id: api.appId,
      data: {},
      filters: option,
    };

    expect(body).toEqual(expected);

    action = 'player';
    option = ['6392d91a-b206-4b7b-a620-cd68e32c3a76', '76ece62b-bcfe-468c-8a78-839aeaa8c5fa', '8e0f21fa-9a5a-4ae7-a9a6-ca1f24294b86'];
    body = api.buildBody(message, action, option);

    expected = {
      contents: message,
      app_id: api.appId,
      data: {},
      include_player_ids: option,
    };

    expect(body).toEqual(expected);
  });

  it('should build request option', () => {
    const message = {};
    const action = 'segment';
    const option = null;

    const body = api.buildOptions(message, action, option);

    const expected = {
      method: 'POST',
      uri: 'https://onesignal.com/api/v1/notifications',
      headers: {
        Authorization: `Basic ${credentials.restKey}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      json: true,
      body: {
        contents: message,
        app_id: api.appId,
        data: {},
        included_segments: ['All'],
      },
    };

    expect(body).toEqual(expected);
  });

  describe('#sendToAll', () => {
    it('should return 200', () => {
      nock('https://onesignal.com/api/v1')
        .post('/notifications')
        .reply(200, {
          id: '458dcec4-cf53-11e3-add2-000c2940e62c',
          recipients: 3,
        });

      const message = {
        it: 'Some dummy text',
        en: 'Some dummy text',
      };

      const options = null;

      api.sendToAll(message, options, (err, res) => {
        expect(res).toEqual({
          id: '458dcec4-cf53-11e3-add2-000c2940e62c',
          recipients: 3,
        });
      });
    });
  });

  describe('#sendToSegments', () => {
    test('should call sendToAll', () => {
      api.sendToAll = jest.fn();
      api.sendToSegments('', ['my-fashion-segment'], {});

      expect(api.sendToAll.mock.calls).toHaveLength(1);
    });
  });
});
