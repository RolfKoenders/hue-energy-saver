'use strict';

require('dotenv').config();
const convict = require('convict');

let conf = convict({
	bridgeHost: {
		doc: 'Hue Bridge Host',
		format: String,
		default: null,
		env: 'HES_BRIDGE'
	},
	username: {
		doc: 'Hue username',
		format: String,
		default: null,
		env: 'HES_USERNAME'
	},
	lightName: {
		doc: 'The name of the light you want to save.',
		format: String,
		default: null,
		env: 'HES_LIGHTNAME'
	}
});

conf.validate({allowed: true});
module.exports = conf.getProperties();