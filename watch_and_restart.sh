#!/bin/bash

cd ~/iot_project || exit 1

# Shut down old instance
pkill -f app.py

# Start program in the background
python3 app.py &

# Script that restarts program when changes are discovered
inotifywait -m -e modify app.py |
while read -r filename event; do
    echo "Changes discovered. Restarting program..."
    pkill -f app.py
    python3 app.py &
    echo "Program restarted"
done

