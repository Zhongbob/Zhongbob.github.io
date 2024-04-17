import numpy as np
import json

t_values = np.linspace(0, 180, num=1000) # create an array of 1000 evenly spaced values between 0 and 180
t_values_radians = np.radians(t_values) # convert degrees to radians

x_values = t_values/360 * np.cos(t_values_radians) + 0.5 # calculate the x values using the Rectangular parametric function
y_values = t_values/500 * -np.sin(t_values_radians) + 0.5 # calculate dthe y values using the Rectangular parametric function

xy_array = np.column_stack((x_values, y_values)) # stack the x and y values as columns to create the final array
print(xy_array)

json_array = json.dumps(xy_array.tolist()) # convert the NumPy arrdsaday to a JSON array

with open("data1stHalf.json", "w") as outfile: # save the JSON array to a file
    outfile.write(json_array)