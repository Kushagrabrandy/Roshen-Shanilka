import os
import re

def slugify(name):
    name = name.lower()
    name = re.sub(r'[^a-z0-9.]+', '-', name)
    name = re.sub(r'-+', '-', name).strip('-')
    return name

directories = [
    r'd:\Roshen\public\EcoBrand',
    r'd:\Roshen\public\portraits',
    r'd:\Roshen\public\drone-videos'
]

for directory in directories:
    if not os.path.exists(directory):
        print(f"Skipping {directory} - not found")
        continue
    for filename in os.listdir(directory):
        old_path = os.path.join(directory, filename)
        if os.path.isfile(old_path):
            new_filename = slugify(filename)
            new_path = os.path.join(directory, new_filename)
            if old_path != new_path:
                print(f"Renaming: {filename} -> {new_filename}")
                os.rename(old_path, new_path)
