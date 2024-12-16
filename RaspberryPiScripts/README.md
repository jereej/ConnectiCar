# Instructions on how to use the startup script

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
    sudo minicom - D /dev/ttyUSB2
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
INSTRUCTIONS_TO_BE_ADDED_HERE

## Running the startupscript.sh manually
You can run the startupscript simply by navigating to the RaspberryPiScripts directory and executing:
```sh
./startupscript.sh
```

Main contents of the startupscript.sh:
```sh
# captures the interface starting with the prefix enx
interface=$(ifconfig -a | grep "enx" | awk '{gsub(/:/, "")}; print $1') 
# configures the netword interface using DHCP (Dynamic Host Configuration Protocol)
dhclient -v "$interface"
# uses the captured interface to negotiate a lease with the DHCP server
udhcpc -i "$interface"
# adds the captured interface to the routing tables
route add -net 0.0.0.0 "$interface"
```