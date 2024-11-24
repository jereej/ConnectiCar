'use strict';

const logger = require('../../logger.js');
const { InfluxDB } = require('@influxdata/influxdb-client');


const token = process.env.INFLUX_TOKEN;
const org = 'connecticar'; 
const bucket = 'car-data';
const url = 'https://influxdb-connecticar.2.rahtiapp.fi/';

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);


async function init() {
}

async function query(queryString) {
  try {
    const result = await queryApi.queryRows(queryString);
    return result;
  } catch (error) {
    logger.error('Error querying InfluxDB:', error);
    throw error;
  }
}

module.exports = {
  query,
  init,
};
