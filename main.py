############################################################

from mbsoftlogicck import PLCInterp
from mbsoftlogicck import PLCCompile
from mbsoftlogicck import DLCkInstructions
from mbsoftlogicck import DLCkDataTable
from mbsoftlogicck import DLCkLibs

from modbuslibs import MBClient
import time

from pyModbusTCP.client import ModbusClient

############################################################

# Constants
HOST = '127.0.0.1'
PORT = 1502
PLCPRG = 'simpleconveyor.txt'

# Compiler for PLC program.
PLCCompiler = PLCCompile.PLCCompiler(DLCkInstructions.InstrDefList, 
                                         DLCkDataTable.InstrDataTable,PLCPRG)

# Read in the PLC program.
PLCCompiler.ReadInFile()

# Compile the PLC program.
plcprogram, instrcount, CompileErrors = PLCCompiler.CompileProgram()

# Get any compiler error messages.
CompileErrMsgs = PLCCompiler.GetCompileErrors()

for i in CompileErrMsgs:
    print(i)

# Initialise the interpreter with the PLC program and data table. 
if (not CompileErrors):
    MainInterp = PLCInterp.PLCInterp(plcprogram,  
                                             DLCkDataTable.BoolDataTable, DLCkDataTable.WordDataTable, 
                    DLCkDataTable.InstrDataTable,
                    DLCkLibs.TableOperations, DLCkDataTable.Accumulator,
                    DLCkLibs.BinMathLib, DLCkLibs.FloatMathLib, DLCkLibs.BCDMathLib,
                    DLCkLibs.WordConversions, DLCkLibs.CounterTimers, DLCkLibs.SystemScan)


# Loop in typical PLC Fashion: ReadInputs, Solve Program, WriteOutputs....Repeat
#################################################################################
while True:
    
    # ReadInputs
    clkbools = []
    boolinputs = {}
    for i in range(1,256):
        val = "X" + str(i)
        clkbools.append(val)
    
    #boolvals = IO.client.read_discrete_inputs(0, bit_nb=255)
    boolvals = ModbusClient(host=HOST,port=PORT).read_discrete_inputs(0, bit_nb=255)
    if boolvals != None:
        for i in range(0,255): 
            boolval = boolvals[i]
            boolinputs[clkbools[i]] = boolval
    else:
        #print(f"Last error:{IO.client.last_error_as_txt}\n")
        #print(f"Last exception:{IO.client.last_except_as_full_txt}\n")
        print(f"Last error:{ModbusClient(port=1502).last_error_as_txt}\n")
        print(f"Last exception:{ModbusClient(port=1502).last_except_as_full_txt}\n")        
        #IO.client.close()
        #IO.client.open()
        
    MainInterp.SetBoolData(boolinputs)
    
    # Test Compare Modbus to Clk
    if boolvals != None:        
        for i in range(0,255):
            i2 = i + 1
            val = "%s%s" % ('X',str(i2))
            BData = MainInterp.GetBoolData([val])
            #print(f"Inputs>> Modbus:{boolvals[i]} Clk:{BData[val]}")
    
    # Update the data table with new inputs. In a real application the values
    # would be variables passed in from the main application. A similar function
    # is available for the word data table. 
    #MainInterp.SetBoolData({'X1': True,'X2': False,'X17' : True, 'X277' : False})
    
    # This causes the PLC program to be executed once.
    # Solve Program
    MainInterp.MainLoop()
    
    # WriteOutputs
    clkbools = []
    booloutputs = []
    for i in range(1,256):
        val = "Y" + str(i)
        clkbools.append(val)
    
    boolvals_dict = MainInterp.GetBoolData(clkbools)
    
    for key in boolvals_dict:
        #print(key, '->', boolvals_dict[key])
        booloutputs.append( boolvals_dict[key])
        
    
    #success = IO.client.write_multiple_coils(0, booloutputs)
    success = ModbusClient(host=HOST,port=PORT).write_multiple_coils(0, booloutputs)
    #for i in range(0,255): 
        #boolval = boolvals[i]
        #boolinputs[clkbools[i]] = boolval
        
    #MainInterp.SetBoolData(boolinputs)
    
    # Test Compare Modbus to Clk
    if boolvals != None:
        for i in range(0,255):
            i2 = i + 1
            val = "%s%s" % ('X',str(i2))
            BData = MainInterp.GetBoolData([val])
            print(f"Inputs>> Modbus:{boolvals[i]} Clk:{BData[val]}")
            
    # This is gets the updated data table elements to be passed to the rest of
    # the application. 
    #BData = MainInterp.GetBoolData(['C100', 'Y1', 'Y367', 'C50', 'CT100'])
    #print(f"After: C100:{BData['C100']} Y1:{BData['Y1']} Y367:{BData['Y367']} C50:{BData['C50']} CT100:{BData['CT100']}")
    
    # Get the program exit code to see if the PLC program exited normally, or
    # if there was an error.

    # Sleep. ie Scan Time
    time.sleep(0.5)    
ExitCode, ExitSubr, ExitRung = MainInterp.GetExitCode()
print(f"ExitCode:{ExitCode} ExitSubr:{ExitSubr} ExitRung:{ExitRung}")
