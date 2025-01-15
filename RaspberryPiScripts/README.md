# Instructions on how to use the scripts in this directory

## Requirements and manual installation of the OBU
To do the manual configuration *(in case if you have a SIM card in the OBU)* and running the startupscript.sh you'll need the following packages:
```
dhclient
udhcpc
route
minicom
```

If you haven't installed the packages on your machine, you'll need to run the commands:
```sh
sudo apt-get install minicom
sudo apt install udhcpc
sudo apt install net-tools
```

After this follow the instructions below **before running the startupscript.sh**:

You can follow the instructions on the [Waveshare website](https://www.waveshare.com/wiki/USB_TO_M.2_B_KEY#Working_With_Raspberry_Pi) on how to configure the machine, but here's a short rundown of the steps you need to take:
```sh
1. Install the packages mentioned above
2. Give the following commands:
    sudo apt purge modemmanager -y 
    sudo apt purge network-manager -y
    sudo minicom -D /dev/ttyUSB2
3. In the opened minicom give the following commands:
    # If AT+CPIN? doesn't return READY, you'll need to open up the SIM card.
    # You can do this by running AT+CLCK="SC",0 and then running AT+CFUN=1,1.
    AT+QCFG="usbnet",1
    AT+CGDCONT=1,"IPV4V6","YOUR_APN" # you'll need to confirm the APN through your operator.
    AT+CFUN=1,1 # Will reset the machine, wait around 30s for it to boot up again
    AT+QENG="servingcell"
```
After going through the steps mentioned above, you can run the startupscript.sh manually. After that, you should have a working internet connection and you can test this out by pinging a website through a terminal or opening a website in a browser.

>NOTE: *Some critique can be made in terms of removing the modem and network-managers, but this is how Waveshare has officially instructed to do.*

## Creating a routine to run startupscript.sh every time the machine boots

There are several ways to do this, but the simplest way is to add the startupscript.sh to either crontab or rc.local-file, which run the script at system startup.

Crontab: <p>
Set the file to executable
```sh
sudo chmod +x /path/to/startupscript.sh
```
Add the path to the script to crontab
```sh
$ crontab -e
@reboot  /path/to/startupscript.sh
```

Rc.local: <p>
Set the file to executable
```sh
sudo chmod +x /path/to/startupscript.sh
```
Open /etc/rc.local file and add the path to the startupscript.sh there
```sh
#!/bin/sh
/path/to/startupscript.sh
```
If Rc.local file is not executable already
```sh
sudo chmod +x /etc/rc.local
```
Finally initiate the service to run during boot
```sh
sudo systemctl start rc-local
```

## Running the startupscript.sh manually
You can run the startupscript simply by navigating to the RaspberryPiScripts directory and executing:
```sh
./startupscript.sh
```

Main contents of the startupscript.sh:
```sh
# captures the interface starting with the prefix enx
interface=$(ifconfig -a | grep "enx" | awk '{gsub(/:/, "")}; print $1') 
# configures the network interface using DHCP (Dynamic Host Configuration Protocol)
dhclient -v "$interface"
# uses the captured interface to negotiate a lease with the DHCP server
udhcpc -i "$interface"
# adds the captured interface to the routing tables
route add -net 0.0.0.0 "$interface"
```
> NOTE: The `startupscript.sh` will most likely not work properly if modemmanager and network-manager haven't been removed from the device.

## Running the other scripts after set-up is done

### Setting up
To ensure everything works correctly, some changes need to be made in `influx_db_handler.py` before running any of the other scripts. You need to change:
```python
self.url = "YOUR_URL_HERE"
self.token = "YOUR_TOKEN_HERE"
self.org = "YOUR_ORG_HERE"
self.bucket = "YOUR_BUCKET_HERE"
```
The values must be from an existing instance of InfluxDB that you are using or have created.

Also the following python libraries need to be installed:

```python
pip install influxdb-client
python -m pip install pyserial
```

### Contents of the scripts

- `main.py`:
    - Reads signal strength values from the device and sends them to the InfluxDB in a loop.
    - Everything regarding GPS data has been commented out since the GPS didn't work on our device.
- `testing_client.py`:
    - A simple client that can be used to test sending (AT) commands via the serial connection. Will create a log file (*serial_comms.log*) to record everything that has been sent and received.
    - The testing client will return all output, even if the given command is incorrect.
- `unit_tests.py`:
    - Simple unit tests testing the different parts of the functionality.
    - No unit tests were made for the GPS or anything that would be dependant on the GPS data since we were unable to get it from our device via AT commands.
- `influx_db_handler.py`:
    - Contains all the functionalities that have to do with InfluxDB, e.g. sending data to the database.
- `serial_handler.py`:
    - Contains all the functionalities that have to do with the serial connection - e.g. sending AT commands and reading the received output.

### Running the scripts
To run any of the scripts, simply give the following command:
```sh
sudo python3 <file_name>
```
> NOTE: sudo is required due to opening the serial connection.
