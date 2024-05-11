import subprocess

script_files = ["Scripts/userGeneratingScript.py", "Scripts/indexAndDataParsingScript.py"]

for script_file in script_files:
    try:
        subprocess.run(["python", script_file], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running {script_file}: {e}")

print("All scripts have been executed.")
