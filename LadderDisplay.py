import tkinter as tk
from tkinter import ttk, END
from PIL import Image, ImageTk
from softlogic import PLCConstants
import json


# Define window
root = tk.Tk()
root.title('pySoftPLC')
root.geometry('850x900')

#Define fonts and colors
root_color = "#224870"
input_color = "#2a4494"
output_color = "#4ea5d9"
root.config(bg=root_color)

#Define Functions
def monitor_ladder():
    """ Show Ladder Logic Boolean States """
    
    pass

def ClearLadderDiagram():
    for i in range(9):
        for j in range(9):
            
            label = tk.Button(ladder_frame, image=hbar_img, bg=output_color, bd=1, relief='sunken',text=' ',compound='bottom')
            label.grid(row=i, column=j)
            table[i][j] = label    

def ShowNetworks():
    
    # How many Networks
    network_count = len(subrdatadict[routine_comboxbox.get()]['subrdata'])
    networks = []
    
    for i in range(network_count):
        networks.append(i)
    network_combobox.configure(values=networks)       
    
    for i in range(network_count):
        print(subrdatadict[routine_comboxbox.get()]['subrdata'][i])
        
def ShowLadder():
    ClearLadderDiagram()
    routine_name = routine_comboxbox.get()
    ladder_number = int(network_combobox.get())
    ladder_list = subrdatadict[routine_name]['subrdata']
    ildata = (ladder_list[ladder_number]['ildata'])
    ld_data = ladder_list[ladder_number]['matrixdata']
    print(ld_data)
   
    # Show Instruction List
    ildata_txt = ''
    for il in ildata:
        ildata_txt = ildata_txt + il
    il_table[0].configure(text=ildata_txt)
    
    # Show Ladder diagram
    for instruction in ld_data:
        inst_type = instruction['type']
        row = instruction['row']
        col = instruction['col']
        addr = instruction['addr']
        value = instruction['value']
        monitor = instruction['monitor']
        
        if value == 'noc':
            img = noc_img
        elif value == 'nc':
            img = nc_img
        elif value == 'hbar':
            img = hbar_img
        elif value == 'branchttr':
            img = branchttr_img
            addr = ' '
        elif value == 'branchr':
            img = branchr_img
            addr = ' '
        elif value == 'branchttl':
            img = branchttl_img
            addr = ' '
        elif value == 'branchl':
            img = branchl_img
            addr = ' '
        elif value == 'out':
            img = coil_img
            col += 8
        elif value == 'end':
            img = func_img
            col += 8
            addr = 'END'
        
            
        table[row][col].configure(image=img, text=addr)
            
            
            
        
            
        
    
    
    


#Define Layout
#Define frames
input_frame = tk.LabelFrame(root, bg=input_color)
ladder_frame = tk.LabelFrame(root, bg=output_color)
il_frame = tk.LabelFrame(root, bg=output_color, bd=1)

#input_frame.pack(pady=10)
#output_frame.pack(padx=10, pady=(0,10), fill=tk.BOTH, expand=True)
input_frame.grid(row=0, column=0)
ladder_frame.grid(row=1, column=0)
il_frame.grid(row=1, column=1)

#Define Images

noc_img = tk.PhotoImage(file="./images/no60x60.png")
nc_img = tk.PhotoImage(file="./images/nc60x60.png")
hbar_img = tk.PhotoImage(file="./images/hbar60x60.png")
branchttr_img = tk.PhotoImage(file="./images/branchttr60x60.png")
branchr_img = tk.PhotoImage(file="./images/branchr60x60.png")
branchttl_img = tk.PhotoImage(file="./images/branchttl60x60.png")
branchl_img = tk.PhotoImage(file="./images/branchl60x60.png")
coil_img = tk.PhotoImage(file="./images/coil60x60.png")
func_img = tk.PhotoImage(file="./images/func60x60.png")


#Create widgets
program_name = tk.Label(input_frame, text=PLCConstants.PLCPRG, width=30)
program_name.grid(row=0, column=0, padx=10, pady=10)
monitor_button = tk.Button(input_frame, text="Monitor", command=monitor_ladder)
monitor_button.grid(row=0, column=1, padx=10, pady=10, ipadx=20)

# Read in json file
with open(PLCConstants.PLCPRG+'.json', 'r') as f:
    subrdatadict = json.load(f)

# Get the routine names
routines = list(subrdatadict)

routine_comboxbox = ttk.Combobox(input_frame,values=routines)
routine_comboxbox.grid(row=1, column=0,padx=10, pady=10)

network_combobox = ttk.Combobox(input_frame)
network_combobox.grid(row=2, column=0, padx=10, pady=10)


btnShowNetworks = ttk.Button(input_frame, text = "Show Networks", command=ShowNetworks)
btnShowNetworks.grid(row=1, column=1, padx=10, pady=10)

btnShowLadder = ttk.Button(input_frame, text = "Show Ladder", command=ShowLadder)
btnShowLadder.grid(row=2, column=1, padx=10, pady=10)


rows, cols = (9, 9)
table = [[None for i in range(cols)] for j in range(rows)]
ClearLadderDiagram()

        
    #Label(root, text="Upper", bg='blue', bd=5, relief='groove').grid(column=1, row=i, sticky=N)
    #Label(root, text="Lower", bg='green', bd=5, relief='groove').grid(column=1, row=i, sticky=S)
    
#for w in table:
    #w.configure(text=' ')
    
[[table[i][j].configure(text=' ') for i in range(cols)] for j in range(rows)]
        

# Instruction list
il_table = []
il_label = ttk.Label(il_frame, background=output_color, text='Instruction List')
il_label.grid(row=0, column=0, padx=50, pady=10)

il_memo = ttk.Label(il_frame, background=output_color, text='')
il_memo.grid(row=1, column=0, padx=50, pady=10)
il_table.append(il_memo)


# Run root window's main loop
root.mainloop()

