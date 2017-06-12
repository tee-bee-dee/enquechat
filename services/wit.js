'use strict'

var Config = require('../config')
var FB = require('../connectors/facebook')
var Wit = require('node-wit').Wit
var request = require('request')

var firstEntityValue = function (entities, entity) {
	var val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value

	if (!val) {
		return null
	}
	return typeof val === 'object' ? val.value : val
}


var actions = {
	say (sessionId, context, message, cb) {
		// Bot testing mode, run cb() and return
		if (require.main === module) {
			cb()
			return
		}

		console.log('WIT WANTS TO TALK TO:', context._fbid_)
		console.log('WIT HAS SOMETHING TO SAY:', message)
		console.log('WIT HAS A CONTEXT:', context)

		if (checkURL(message)) {
			FB.newMessage(context._fbid_, message, true)
		} else {
			FB.newMessage(context._fbid_, message)
		}

		cb()
	},

	merge(sessionId, context, entities, message, cb) {
    //delete story missing component for a refresh
    delete context.missingDT;
   
    // Retrive the intent entity and store it in the context field
		var intent = firstEntityValue(entities, 'intent')
		if (intent) {
			context.intent = intent
    }

		var apptact = firstEntityValue(entities, 'apptaction')
		if (apptact) {
			context.apptaction = apptact
		}

		// Retrieve the contact
		var contact = firstEntityValue(entities, 'contact')
		if (contact) {
			context.contact = contact
		}

		// Retrieve the datetime
		var datetime = firstEntityValue(entities, 'datetime')
		if (datetime) {
			context.datetime = datetime
		} else {
      context.missingDT = true
    }
    
		cb(context)
	},

	error(sessionId, context, error) {
		console.log(error.message)
	},

	// list of functions Wit.ai can execute
	['fetch-weather'](sessionId, context, cb) {
		// Here we can place an API call to a weather service
		// if (context.loc) {
		// 	getWeather(context.loc)
		// 		.then(function (forecast) {
		// 			context.forecast = forecast || 'sunny'
		// 		})
		// 		.catch(function (err) {
		// 			console.log(err)
		// 		})
		// }

		context.forecast = 'Sunny'

		cb(context)
	},

	['fetch-pics'](sessionId, context, cb) {
		var wantedPics = allPics[context.cat || 'default']
		context.pics = wantedPics[Math.floor(Math.random() * wantedPics.length)]

		cb(context)
	},

  
	['clearContext'](sessionId, context, cb) {
    var temp = context._fbid_
    context = {};

    context._fbid_ = temp

    cb(context)
	},

	['checkAppt'](sessionId, context, cb) {
    if(context.datetime && context.apptaction && context.contact) {
      context.apptPossible = true;

      console.log("apptaction check");
      console.log(context.apptaction);

      console.log("contact: check");
      console.log(context.contact);
    }

    if(context.datetime) {
      console.log("datetime check");
      console.log(context.datetime);
    } else {
      delete context.datetime;
      context.missingDT = true;
    }

    if(context) {
      console.log("context: check");
      console.log(context);
    }
		cb(context)
	},

  getDT({context, entities}) {
    var dt = firstEntityValue(entities, 'datetime');
    if (dt) {
      context.datetime = dt;
      delete context.missingDT;
    } else {
      context.missingDT = true;
      delete context.datetime;
    }
    return context;
  },
}

// SETUP THE WIT.AI SERVICE
var getWit = function () {
	console.log('GRABBING WIT')
	return new Wit(Config.WIT_TOKEN, actions)
}

module.exports = {
	getWit: getWit,
}

// BOT TESTING MODE
if (require.main === module) {
	console.log('Bot testing mode!')
	var client = getWit()
	client.interactive()
}

// GET WEATHER FROM API
var getWeather = function (location) {
	return new Promise(function (resolve, reject) {
		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+ location +'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
		request(url, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	var jsonData = JSON.parse(body)
		    	var forecast = jsonData.query.results.channel.item.forecast[0].text
		      console.log('WEATHER API SAYS....', jsonData.query.results.channel.item.forecast[0].text)
		      return forecast
		    }
			})
	})
}

// CHECK IF URL IS AN IMAGE FILE
var checkURL = function (url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// LIST OF ALL PICS
var allPics = {
  corgis: [
    'http://i.imgur.com/uYyICl0.jpeg',
		'http://i.imgur.com/RxoU9o9.jpeg',
  ],
  racoons: [
    'http://i.imgur.com/zCC3npm.jpeg',
		'http://i.imgur.com/HAeMnSq.jpeg',
  ],
  default: [
    'http://blog.uprinting.com/wp-content/uploads/2011/09/Cute-Baby-Pictures-29.jpg',
  ],
};
