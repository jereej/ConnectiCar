import serial
import re


class SerialHandler:
    
    def __init__(self):
        """This class is used to read data through the serial port.
        """
        self.s = serial.Serial("/dev/ttyUSB2", 115200, timeout=1)
        
    def read_signal_strength_data(self):
        """Reads signal strength data through the serial port.

        Returns:
            int: Received signal strength indication. Possible values are:
                 0      -113 dBm or less
                 1      -111 dBm
                 2–30   -109 dBm to -53 dBm
                 31     -51 dBm or greater  # best signal strength
                 99      Not known or not detectable
        """
        try:
            regex_pattern = re.compile(r"\+CSQ: (?P<strength>\d+)")
            output = self.send_command_to_serial("AT+CSQ", return_output=True)
            match = re.match(regex_pattern, output)
            if match:
                signal_strength = match.group('strength')
                return int(signal_strength)
        except Exception as e:
            print(f"Unknown error occurred. Caught exception: {e}")
            return -1

    def read_gps_data(self):
        """Reads wanted GPS values through the serial port.

        Returns:
            str: UTC time    (hhmmss.sss)
            str: latitude    (ddmm.mmmmN/S)
            str: longitude   (ddmm.mmmmE/W)
            str: speed, km/h (xxxx.x)
            str: date        (ddmmyy)
            
        """
        try:
            regex_pattern = re.compile(r"""
            \+QGPSLOC:            # Match prefix
            (?P<utc>\S+),         # Capture UTC timestamp
            (?P<latitude>\S+),    # Capture latitude
            (?P<longitude>\S+),   # Capture longitude
            \S+,                  # Skip redundant values
            \S+,                  # Skip redundant values
            \S+,                  # Skip redundant values
            \S+,                  # Skip redundant values
            (?P<speed>\S+),       # Capture speed
            \S+,                  # Skip redundant values
            (?P<date>\S+)         # Capture date
            """, re.VERBOSE)
            
            output = self.send_command_to_serial("AT+QGPSLOC=0", return_output=True)
            match = re.match(regex_pattern, output)
            if match:
                return match.group('utc'), match.group('latitude'), match.group('longitude'), match.group('speed'), match.group('date')
            elif "ERROR" in output:
                print(f"Error found in output: {output}")
        except Exception as e:
            print(e)

    def send_command_to_serial(self, command, return_output=False):
        """Sends given command via serial and returns the output

        Args:
            command (str): given command
        
        Returns:
            string output
        """
        self.s.write(command + '\r\n'.encode())
        if return_output:
            return self.s.readline().decode().strip()
