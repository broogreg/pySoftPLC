from pyModbusTCP.client import ModbusClient
from pyModbusTCP import utils

class MBIO():
    """ Modbus Client IO Scanner """
    def __init__(self, host="127.0.0.1", port=1502, unit_id=1):
        self.host = host
        self.port = port
        self.unit_id = unit_id
        self.connect()
        
    def connect(self):
        self.client = ModbusClient(host=self.host, port=self.port, unit_id=self.unit_id, auto_open=False)
        if not self.client.is_open:
            if not self.client.open():
                text="unable to connect to " + self.host + ":" + str(self.port) + ":" + str(self.unit_id)
                print(text)
        else:
            self.client.close()
            if not self.client.open():
                text="unable to connect to " + self.host + ":" + str(self.port) + ":" + str(self.unit_id)
                print(text)            
    
    

#IOScan = MBIO()
#IOScan.client.read_holding_registers(0)    

#IOScan.client.write_single_register(1, 123)
