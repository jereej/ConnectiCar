# Instructions on how to use the startup script

## Requirements
To run the startupscript.sh you'll need the following packages:
```
@opentelemetry/api
@opentelemetry/exporter-jaeger
@opentelemetry/instrumentation
@opentelemetry/instrumentation-express
@opentelemetry/instrumentation-http
@opentelemetry/instrumentation-pg
@opentelemetry/resources
@opentelemetry/sdk-trace-base
@opentelemetry/sdk-trace-node
@opentelemetry/semantic-conventions
@influxdata/influxdb-client
body-parser
express
express-async-handler
kube-service-bindings
pg
pino
eslint
eslint-config-semistandard
mocha
nodeshift
nyc
proxyquire
standard-version
supertest
```

If you haven't installed the packages on your machine, you'll need to run the commands:
```sh
COMMANDS TO BE ADDED HERE
```
## Creating a routine to run startupscript.sh every time the machine boots
INSTRUCTIONS_TO_BE_ADDED_HERE

## Running the startupscript.sh manually
You can run the startupscript simply by navigating to the RaspberryPiScripts directory and executing:
```sh
./startupscript.sh
```

Main contents of the : lib/api/query.js
```
Queries data from influxDB, needs specified url, API token, organization- and bucket name, saves the queried data to local variable latestData which is saved to local dataStore inorder to export it non statically.
the data has to be in the right format for the parsing to work properly but you can change this part to better fit your data:
const data = {
    signal_strength: parsed._value || 0,
    longitude: parseFloat(parsed.longitude) || 0.0,
    latitude: parseFloat(parsed.latitude) || 0.0,
    speed: parseFloat(parsed.speed) || 0,
  };

```
