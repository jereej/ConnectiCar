import time
from RaspberryPiScripts.influx_db_handler import InfluxDBHandler

def main():
    influx_db_handler = InfluxDBHandler()
    try:
        influx_db_handler.serial.enable_gps()
        print("Waiting 2 minutes for GPS.")
        time.sleep(120)
        while True:
            influx_db_handler.read_and_write_signal_strength_data()
            influx_db_handler.read_and_write_gps_data()
            time.sleep(3)
    except KeyboardInterrupt:
        print("Code execution was interrupted by user.")
    finally:
        influx_db_handler.serial.close_gps()
        print("GPS connection close")

if __name__ == "__main__":
    main()
            