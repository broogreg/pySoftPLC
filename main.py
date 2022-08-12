############################################################

from mbsoftlogicck import PLCInterp
from mbsoftlogicck import PLCCompile
from mbsoftlogicck import DLCkInstructions
from mbsoftlogicck import DLCkDataTable
from mbsoftlogicck import DLCkLibs

############################################################

# Compiler for PLC program.
PLCCompiler = PLCCompile.PLCCompiler(DLCkInstructions.InstrDefList, 
                                         DLCkDataTable.InstrDataTable,"D:\Python\SoftPLC\demoplcprog_orig.txt")

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

# Update the data table with new inputs. In a real application the values
# would be variables passed in from the main application. A similar function
# is available for the word data table. 
MainInterp.SetBoolData({'X1': True,'X2': False,'X17' : True, 'X277' : False})

# This causes the PLC program to be executed once.
MainInterp.MainLoop()

# This is gets the updated data table elements to be passed to the rest of
# the application. 
BData = MainInterp.GetBoolData(['C100', 'Y1', 'Y367', 'C50', 'CT100'])

# Get the program exit code to see if the PLC program exited normally, or
# if there was an error.
ExitCode, ExitSubr, ExitRung = MainInterp.GetExitCode()
print(f"ExitCode:{ExitCode} ExitSubr:{ExitSubr} ExitRung:{ExitRung}")
