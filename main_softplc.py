from softlogic import PLCComp, PLCConstants
import PLCRun
import time


_Msgs = {'badsoftlogicio':'Bad or missing soft IO configuration. Soft logic system will not be started.',
         'startsoftlogic':'Soft logic system started.',
         'softlogicerror':'Soft logic program errors found. Soft logic system not started.'
         }


PLCRun.PLCSystem.SetScanRate(scanrate=500)
PLCCompileOK = PLCComp.PLCLogic.LoadCompileAndRun(PLCConstants.PLCPRG)
if PLCCompileOK:
    print(_Msgs['startsoftlogic'])
else:
    print(_Msgs['softlogicerror'])
    
# Loop in typical PLC Fashion: ReadInputs, Solve Program, WriteOutputs....Repeat
#################################################################################
while True:
        
    PLCRun.PLCSystem.RunPLCScan()
    time.sleep(0.5)
   
    
