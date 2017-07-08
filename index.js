'use strict';

const NodeHue = require('node-hue-api'),
    HueApi = NodeHue.HueApi,
    lightstate = NodeHue.lightState;

const _ = require('lodash');
const moment = require('moment');
const pino = require('pino')();
const config = require('./config');

const hue = new HueApi(config.bridgeHost, config.username);
const states = lightstate.create();

const TIMEOUT = 5000; // 5 seconds in milliseconds

let memory = {
    lightId: null,
    state: null,
    offTimestamp: null
};

function getLightState() {
    if (memory.lightId) {
        return hue.lightStatus(memory.lightId);
    } else {
        return hue.lights()
            .then((result) => {
                const light = _.find(result.lights, {'name': config.lightName});
                if (light) {
                    memory.lightId = light.id;
                    return hue.lightStatus(light.id);
                } else {
                    throw new Error('light_not_found');
                }
            });
    }	
}

function stateChecker(id, state) {
    // If light is on
    if (state.on) {
        // If light was already on
        if (memory.state) {
            // Check if 5 minutes later
            const now = moment();
            if (now > memory.offTimestamp) {
                // Turn light off
                return hue.setLightState(memory.lightId, states.off());
            }
        } else {
            // Light was just turned on, save timestamp and state
            memory.state = true;
            memory.offTimestamp = moment(moment()).add(5, 'm');
            return;
        }
    } else {
        // Light is off, do nothing
        memory.state = false;
        memory.offTimestamp = null;
        return;
    }
}

pino.info('Huesaver watching light: ', config.lightName);
setInterval(() => {
    return getLightState()
        .then((lightState) => {
            return stateChecker(memory.lightId, lightState.state)
        })
        .catch((error) => {
            pino.error(error, 'An error occurred');
    });
}, TIMEOUT)