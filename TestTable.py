#import tkinter as tk

## Define window
#root = tk.Tk()
#root.title('pySoftPLC')
#root.geometry('800x600')

##Define fonts and colors
#root_color = "#224870"
#input_color = "#2a4494"
#output_color = "#4ea5d9"
#root.config(bg=root_color)


#table = tk.Frame(root)
#for row in range(3):
    #for col in range(3):
        #label = tk.Label(table, text="aaaaaaaaaaaaaaaaaaaaaaaaaa")
        #label.grid(row=row, column=col, sticky="nsew", padx=1, pady=1)
        ##table[(row, col)] = label
        
import tkinter as tk
root = tk.Tk()
root.geometry("1024x768")

noc_img = tk.PhotoImage(file="./images/noc50x50.png")
nc_img = tk.PhotoImage(file="./images/nc60x60.png")

outframe = tk.Frame(root)
outframe.grid(row=0,column=0)

table = []
for i in range(9):
    for j in range(9):
        
        label = tk.Button(root, image=noc_img, bg='white', bd=1, relief='sunken',text='X1',compound='bottom')
        label.grid(row=i, column=j)
        table.append(label)
    #Label(root, text="Upper", bg='blue', bd=5, relief='groove').grid(column=1, row=i, sticky=N)
    #Label(root, text="Lower", bg='green', bd=5, relief='groove').grid(column=1, row=i, sticky=S)
    
for w in table:
    w.configure(text='X2')
    
table[0].configure(image=nc_img)

root.mainloop()