import tkinter as tk
from tkinter import ttk, END
from PIL import Image, ImageTk
from softlogic import PLCConstants
import json


# Define window
root = tk.Tk()
root.title('pySoftPLC')
root.geometry('850x850')

#Define fonts and colors
root_color = "#224870"
input_color = "#2a4494"
output_color = "#4ea5d9"
root.config(bg=root_color)

#Define Functions
def monitor_ladder():
    """ Show Ladder Logic Boolean States """
    
    pass

#Define Layout
#Define frames
input_frame = tk.LabelFrame(root, bg=input_color)
output_frame = tk.LabelFrame(root, bg=output_color)
#input_frame.pack(pady=10)
#output_frame.pack(padx=10, pady=(0,10), fill=tk.BOTH, expand=True)
input_frame.grid(row=0, column=0)
output_frame.grid(row=1, column=0)

#Define Images
# Normaly Open Contact Image
#img = Image.open('./images/noc.png')
#img = img.resize((50,50), Image.ANTIALIAS)
#noc_image = ImageTk.PhotoImage(img)

#img = Image.open('./images/noc50x50.png')
#img = img.resize((50,50), Image.ANTIALIAS)
#noc_img = ImageTk.PhotoImage(img)

#img = Image.open('./images/coil-ladder-diagram-symbol.png')
#img = img.resize((50,50), Image.ANTIALIAS)
#nc_img = ImageTk.PhotoImage(img)

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
program_name = tk.Label(input_frame, text=PLCConstants.PLCPRG, width=20)
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

table = []
for i in range(9):
    for j in range(9):
        
        label = tk.Button(output_frame, image=hbar_img, bg=output_color, bd=1, relief='sunken',text='',compound='bottom')
        label.grid(row=i, column=j)
        table.append(label)
    #Label(root, text="Upper", bg='blue', bd=5, relief='groove').grid(column=1, row=i, sticky=N)
    #Label(root, text="Lower", bg='green', bd=5, relief='groove').grid(column=1, row=i, sticky=S)
    
for w in table:
    w.configure(text=' ')
    
table[1].configure(image=nc_img, text='X1')
table[2].configure(image=noc_img, text='  ')
table[8].configure(image=coil_img, text='Y1')
table[8].configure(bg='green')
table[11].configure(image=branchttr_img, text=' ')
table[13].configure(image=branchttl_img, text=' ')
table[17].configure(image=func_img, text='Call SConv')
table[17].configure(bg='green')
table[20].configure(image=branchr_img, text=' ')
table[22].configure(image=branchl_img, text=' ')
        
#noc_button = Label(output_frame, image=noc_image, text='X1', compound=BOTTOM, bg=output_color, )
#noc_button.grid(row=0, column=0)

# Run root window's main loop
root.mainloop()