'use strict'

const nock = require('nock')
const chai = require('chai')
const expect = chai.expect

const OnesignalApi = require('./../src/onesignal-api')

describe('OneSignalApi', () => {

  const credentials = {
    restKey: 'somerestKey',
    appId: 'someappId',
  }

  const api = new OnesignalApi(credentials.restKey, credentials.appId)

  it('should set restKey and appId', () => {

    expect(api.restKey).to.be.equal(credentials.restKey)
    expect(api.appId).to.be.equal(credentials.appId)

  })

  it('should set header', () => {

    const headers = {
      'Authorization': `Basic ${credentials.restKey}`,
      'Content-Type': 'application/json'
    }

    expect(api._headers()).to.be.deep.equal(headers)

  })

  it('should set appId', () => {

    const appId = {
      'app_id': credentials.appId,
    }

    expect(api._appId()).to.be.deep.equal(appId)

  })

  it('should set appId', () => {

    const message = {
      'it': 'Some dummy text',
      'en': 'Some dummy text'
    }

    const content = {
      'contents': message
    }

    expect(api._content(message)).to.be.deep.equal(content)

  })


  it('should set data', () => {

    const data = {
      'foo': 'bar'
    }    

    expect(api._data()).to.be.deep.equal({'data':{}})
    expect(api._data(data)).to.be.deep.equal({'data': data})

  })

  it('should build body', () => {

    const message = {}
    let action = '_segment'
    let option = null
    
    let body = api._buildBody(message, action, option)
    let expected = {
      'contents': message,
      'app_id': api.appId,
      'data': {},
      'included_segments': ['All']
    }

    expect(body).to.be.deep.equal(expected)

    action = '_filter'
    option = [
    	{'field': 'tag', 'key': 'level', 'relation': '=', 'value': '10'}, 
  	  {'operator': 'OR'}, {'field': 'amount_spent', 'relation': '>', 'value': '0'}
    ]
    body = api._buildBody(message, action, option)

    expected = {
      'contents': message,
      'app_id': api.appId,
      'data': {},
      'filters': option
    }

    expect(body).to.be.deep.equal(expected)

    action = '_player'
    option = ['6392d91a-b206-4b7b-a620-cd68e32c3a76','76ece62b-bcfe-468c-8a78-839aeaa8c5fa','8e0f21fa-9a5a-4ae7-a9a6-ca1f24294b86']
    body = api._buildBody(message, action, option)

    expected = {
      'contents': message,
      'app_id': api.appId,
      'data': {},
      'include_player_ids': option
    }
    
    expect(body).to.be.deep.equal(expected)

  })

  it('should build request option', () => {

    const message = {}
    const action = '_segment'
    const option = null
    
    const body = api._buildOptions(message, action, option)

    const expected = {
      method: 'POST',
      uri: 'https://onesignal.com/api/v1/notifications',
      headers: {
        'Authorization': `Basic ${credentials.restKey}`,
        'Content-Type': 'application/json'
      },
      json: true,
      body: {
        'contents': message,
        'app_id': api.appId,
        'data': {},
        'included_segments': ['All']
      }
    }

    expect(body).to.be.deep.equal(expected)

  })

  describe('#sendToAll', () => {

    it('should return 200', (done) => {

      nock('https://onesignal.com/api/v1')
        .post('/notifications')
        .reply(200, {
          'id': '458dcec4-cf53-11e3-add2-000c2940e62c',
          'recipients': 3
        })

      const message = {
        it:'Some dummy text', 
        en: 'Some dummy text'
      }

      const options = null        

      api.sendToAll(message, options, (err, res) => {

        if (err) return done(err)

        expect(res).to.be.deep.equal({
          'id': '458dcec4-cf53-11e3-add2-000c2940e62c',
          'recipients': 3
        })
        done()

      }) 
      
    })

  })

})