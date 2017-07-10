'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'CurrentStatusIntent': function () {
      fetchStatus((results) => {
          this.emit(':tell', results['answer']);
      });
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', "Try are there any outages");
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Cancelled');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Have a nice day');
    }
};

var https = require('https');

function fetchStatus(callback){
  var options = {
    host: 'status.cloud.google.com',
    path: '/incidents.json',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var retData = '';
  var ret = {};
  var req = https.request(options, res => {
    res.on('data', chunk => {
      retData = retData + chunk;
    });

    res.on('end', () => {
        var json = JSON.parse(retData);
        var first = json[0];
        if (first.end == (null || undefined)){
          ret['answer'] = 'Yes ' + json.service_name + ' is currently having an event'
        } else {
          ret['answer'] = 'Nope all services are operational'
        }

        callback(ret);
    })
  });

  req.end();
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
}
