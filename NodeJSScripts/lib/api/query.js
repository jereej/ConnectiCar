const { InfluxDB } = require('@influxdata/influxdb-client');

const url = 'https://influxdb-connecticar.2.rahtiapp.fi/';
const token = process.env.INFLUX_TOKEN;
const org = 'connecticar';
const bucket = 'car-data';

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

const query = `
from(bucket: "${bucket}")
  |> range(start: -10m)
  |> filter(fn: (r) => r._measurement == "signal_strength")
  |> filter(fn: (r) => r._field == "value")
`;

const dataStore = { latestData: null };

async function queryAndUpdateData() {
  let retryCount = 0;
  const maxRetries = 5;

  async function executeQuery() {
    try {
      let latestResult = null;
      await new Promise((resolve, reject) => {
        queryApi.queryRows(query, {
          next(row, tableMeta) {
            const parsed = tableMeta.toObject(row);
            const data = {
              signal_strength: parsed._value || 0,
              longitude: parseFloat(parsed.longitude) || 0.0,
              latitude: parseFloat(parsed.latitude) || 0.0,
              speed: parseFloat(parsed.speed) || 0,
            };
            latestResult = data;
          },
          error(err) {
            console.error('Query Error:', err);
            reject(err);
          },
          complete() {
            resolve();
          },
        });
      });

      dataStore.latestData = latestResult;
      console.log('Latest Data Updated:', dataStore.latestData);
      retryCount = 0;
    } catch (error) {
      console.error('Error during query:', error);
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying... Attempt ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await executeQuery();
      } else {
        console.error('Max retries reached, giving up.');
      }
    }
  }

  setInterval(async () => {
    await executeQuery();
  }, 10000);
}

queryAndUpdateData();

module.exports = dataStore;
