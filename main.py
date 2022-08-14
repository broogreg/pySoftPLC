############################################################

from mbsoftlogicck import PLCInterp
from mbsoftlogicck import PLCCompile
from mbsoftlogicck import DLCkInstructions
from mbsoftlogicck import DLCkDataTable
from mbsoftlogicck import DLCkLibs

import time
import sys

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
        
        boolvals = ModbusClient(host=HOST,port=PORT).read_discrete_inputs(0, bit_nb=255)
        if boolvals != None:
            for i in range(0,255): 
                boolval = boolvals[i]
                boolinputs[clkbools[i]] = boolval
                
            # Map modbus discrete inputs to X1..X255 variables    
            MainInterp.SetBoolData(boolinputs)
        else:
            print("Modbus errored out on read_discrete_inputs")
         
        # This causes the PLC program to be executed once.
        # Solve Program
        MainInterp.MainLoop()
        ExitCode, ExitSubr, ExitRung = MainInterp.GetExitCode()
        if ExitCode != 'normal_end_requested':
            print(ExitCode, ExitSubr, ExitRung)
            sys.exit("Problem with the interpreter:", ExitCode, ExitSubr, ExitRung)
        
        # WriteOutputs
        clkbools = []
        booloutputs = []
        for i in range(1,256):
            val = "Y" + str(i)
            clkbools.append(val)
        
        # Get Y1..Y255 status in dictionary
        boolvals_dict = MainInterp.GetBoolData(clkbools)
        
        # Format for Modbus Call
        for key in boolvals_dict:
            #print(key, '->', boolvals_dict[key])
            booloutputs.append( boolvals_dict[key])
            
        
        success = ModbusClient(host=HOST,port=PORT).write_multiple_coils(0, booloutputs)
        if not success:
            print("Modbus errored out on write_multiple_coils")
        
        # This is the PLC Scan Time
        time.sleep(0.5)    

print(f"ExitCode:{ExitCode} ExitSubr:{ExitSubr} ExitRung:{ExitRung}")
