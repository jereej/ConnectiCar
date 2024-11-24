import SerialHandler
import influxdb_client


class InfluxDBClient:
    
    def __init__(self):
        self.url = "YOUR_URL_HERE"
        self.token = "YOUR_TOKEN_HERE"
        self.org = "YOUR_ORG_HERE"
        self.bucket = "YOUR_BUCKET_HERE"
        self.serial = None
    