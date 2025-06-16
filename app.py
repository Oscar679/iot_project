from flask import Flask, request, jsonify
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

# Route to check if the server is running
@app.route("/")
def home():
    return "IoT Project API is running!"

# Endpoint to insert sensor data
@app.route("/api/data", methods=["POST"])
def insert_data():
    data = request.get_json()
    temperature = data.get("temperature")
    humidity = data.get("humidity")

    if temperature is None or humidity is None:
        return jsonify({"error": "Missing temperature or humidity"}), 400

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
    