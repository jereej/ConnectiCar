const { InfluxDB } = require('@influxdata/influxdb-client');

const url = 'https://influxdb-connecticar.2.rahtiapp.fi/';
const token = process.env.INFLUX_TOKEN;
const org = 'connecticar';
const bucket = 'car-data';

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

const query = `
from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "signal_strength")
  |> filter(fn: (r) => r._field == "value")
  |> last() // Fetch only the most recent value
`;

const dataStore = { latestData: null };

async function queryAndUpdateData() {
  try {
    const interval = setInterval(async () => {
      let latestData = null;

      try {
        await new Promise((resolve, reject) => {
          queryApi.queryRows(query, {
            next(row, tableMeta) {
              const parsed = tableMeta.toObject(row);
              latestData = {
                signal_strength: parsed._value || 0,
                longitude: parseFloat(parsed.longitude) || 0.0,
                latitude: parseFloat(parsed.latitude) || 0.0,
                speed: parseFloat(parsed.speed) || 0,
              };
            },
            error(err) {
              reject(err);
            },
            complete() {
              resolve();
            },
          });
        });

        if (latestData) {
          dataStore.latestData = latestData;
          console.log("Latest data updated:", dataStore.latestData);
        }
      } catch (error) {
        console.error("Error fetching latest data:", error);
      }
    }, 10000);
  } catch (error) {
    console.error("Error in query loop:", error);
  } finally {
    influxDB.close(); 
  }
}

queryAndUpdateData();

module.exports = dataStore;
