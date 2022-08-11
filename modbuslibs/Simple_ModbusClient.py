from pyModbusTCP.client import ModbusClient

client = ModbusClient(host="127.0.0.1", port=1502)
client.open()
client.read_holding_registers(0)
client.read_holding_registers(0)
client.read_holding_registers(0)
client.read_holding_registers(0)
client.write_single_register(1, 123)
client.write_single_register(1, 123)