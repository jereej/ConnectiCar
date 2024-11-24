import serial
import time
import re


class SerialHandler:
    
    def __init__(self):
        self.s = serial.Serial("/dev/ttyUSB2", 115200, timeout=1)
        
    def read_data(self, command):
        """Read data from serial console

        Args:
            command (str): command to be given
        """
        pass