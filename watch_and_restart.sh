#!/bin/bash

echo "👀 Övervakar ändringar – för att starta om app.py..."

cd ~/iot_project || exit 1

# Döda eventuell gammal instans
pkill -f app.py

# Starta appen i bakgrunden
python3 app.py &

# Övervaka ändringar i app.py
inotifywait -m -e modify app.py |
while read -r filename event; do
    echo "♻️ Ändringar upptäckta! Startar om appen..."
    pkill -f app.py
    python3 app.py &
    echo "✅ Appen är omstartad."
done

