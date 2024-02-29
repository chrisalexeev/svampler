#!/bin/bash

# Get all filenames in ./public/samples that end in ".wav"
filenames=$(ls ./public/samples | grep "\.wav$")

# Create the environment.json file
echo "{ \"samples\": [" > ./public/environment.json

# Loop through each filename and append it to the environment.json file
IFS=$'\n' # Set the delimiter to newline
for filename in $filenames; do
    
    echo "\"$filename\"," >> ./public/environment.json
done

# Remove the trailing comma
sed -i '$ s/,$//' ./public/environment.json

# Close the JSON array
echo "]}" >> ./public/environment.json
