# Instructions on how to use the startup script

## Requirements
To run the startupscript.sh you'll need the following packages:
```
dhclient
udhcpc
route
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