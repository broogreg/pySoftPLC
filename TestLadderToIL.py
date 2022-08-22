from mbsoftlogicck import DLCkInstructions,  PLClad2il

import json
import ast

with open('LadderDictionaryDump_fmt.txt', 'r') as f:

            # Read the first line:
            subrdata = f.read()
## make dictionary json           
#subrdatadict = json.loads(subrdata)

subrdatadict = ast.literal_eval(subrdata)

# Convert the editor data to IL source for a complete subroutine.
analyser = PLClad2il.SubrAnalyser(DLCkInstructions.InstrDefList)
subrname, subrcomments, decodedilsource = analyser.DecodeSubroutine(subrdatadict['main'])

# Assemble the subroutine code.
subril = PLClad2il.AssembleSubr(subrname, subrcomments, decodedilsource)

# Strips out any line endings then add the line endings back in. 
# We do it this way to control platform dependent line ending differences.
formattedtext = ['%s\n' % textline for textline in subril]

input()