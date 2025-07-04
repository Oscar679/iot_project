from flask import Flask, request, jsonify, render_template
import mysql.connector
import os
from dotenv import load_dotenv
from datetime import datetime

# Load credentials from .env
load_dotenv()

# Environment variables
DB_HOST = os.getenv("DB_HOSTNAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Flask app setup
app = Flask(__name__)

# Defining routes for html files (different pages on website)
@app.route("/")
def home_page():
    return render_template("index.html")

@app.route("/aboutMe")
def about_page():
    return render_template("aboutMe.html")

@app.route("/hardware")
def hardware_page():
    return render_template("hardware.html")

# Endpoint to insert sensor data
@app.route("/api/data", methods=["POST"])
def insert_data():
    data = request.get_json()
    temperature = data.get("temperature")
    humidity = data.get("humidity")
    
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor()
        query = "INSERT INTO sensor_data (timestamp, temperature, humidity) VALUES (%s, %s, %s)"
        values = (datetime.now(), temperature, humidity)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Data inserted"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    
# Endpoint for fetching most recent measure
@app.route("/api/current", methods=["GET"])
def get_current_data():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT temperature, humidity, timestamp FROM sensor_data ORDER BY timestamp DESC LIMIT 1")
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        if row:
            return jsonify(row)
        else:
            return jsonify({"error": "No data found"}), 404
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# Endpoint for fetching the 5 most recent measures
@app.route("/api/history", methods=["GET"])
def fetch_history():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT temperature, humidity, timestamp FROM sensor_data ORDER BY timestamp DESC LIMIT 5")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        if rows:
            return jsonify(rows)
        else:
            return jsonify({"error": "No data found"}), 404
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    
# Endpoint for fetching all data from sensor_data table
@app.route("/api/allData", methods=["GET"])
def fetch_all_data():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM sensor_data ORDER BY timestamp")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        if rows:
            return jsonify(rows)
        else:
            return jsonify({"error": "No data found"}), 404
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# Start server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)