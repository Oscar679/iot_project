
## Tutorial on how to build a temperature and humidity sensor

  - **Project name:** Climatebot.net
    
  - **My name and LNU credentials:** Oscar Ekberg, oe222ia
    
  - Climatebot.net is a fullstack web service which offers data upon the current temperature (Celsius) and humidity (%) in my home office. The data is visualized by three line graphs. Temperature and humidity has        its own separate chart where the 5 latest measures are displayed. The third chart shows an overview of all historically collected data, where temperature and humidity levels are displayed by a separate graph.        All data is transmitted, stored and rendered through a self-hosted backend running on Amazon Web Services.
  
  - **Estimation of time spent:** ~50 hours

### Objective

  - **Why i chose to do this particular project:** While brainstorming different ideas for this project I was determined to solve an existing problem, e.g. by giving valuable insights upon an existing problem.             Recently I have been experiencing a great increase in discomfort related to indoor climate in my apartment. Hence I came up with the idea of measuring the live temperature and humidity in my home office. The         idea was to provide visualization of potential trends of the indoor climate. Furthermore the visualized data could be used to determine potential causal relationships, e.g. having the fan or PC running.
 
  - **What purpose does Climatebot.net serve:** The web service offers valuable data which can be analyzed and utilized in order to increase the level of comfort in my home office.
  
  - **What insights will this project give:** As discussed the web service will be utilized as a tool in order to increase the indoor level of comfort. Furthermore several personal insights will be achieved, e.g. I       will plan and build an entire web service from scratch to deployment. Hence I will be practicing and refining my fullstack development skills. This includes:
    - **Frontend (HTML, CSS, JS)**
    - **Backend (Pyhon Flask, MySQL)**
    - **Server configuration and management (AWS)**
    - **Code management (Git, Bash-scripts for automation)**
    - **And of course the star of the show, building an IOT device.**

### Material
  | Component                                | Purpose  | Link           | Price (SEK) |
  |------------------------------------------|--------- |----------------|-------------|
  | Raspberry Pi Pico WH 2022                | Microcontroller for running Python code  | [electro:kit](https://www.electrokit.com/raspberry-pi-pico-wh) | 99 SEK |
  | DHT11                                    | Sensor for measuring temperature and humidity | [electro:kit](https://www.electrokit.com/digital-temperatur-och-fuktsensor-dht11) | 49 SEK |
  | Cables | Used to connect the sensor to the breadboard & microcontroller| [electro:kit](https://www.electrokit.com/labbsladd-40-pin-30cm-hane/hane) | 55 SEK |


**Raspberry Pi Pico WH 2022**
The raspberry Pi Pico WH is a tiny development board based on the RP2040 chip suitable for programming in MicroPython.

![image](https://github.com/user-attachments/assets/1f13ef3f-9136-4f1c-b95f-9390d989b496)

**DHT11**
The DHT11 is a digital temperature- and humidity-sensor transmitting a stream of data in to the microcontroller.

![image](https://github.com/user-attachments/assets/7b23b91b-d10d-4950-b6c1-3c3777bdb47e)

**Cables**
40-pin flat cable with dupont connectors in different colors for divisibility. Suitable for use with connector decks and sensors.

![image](https://github.com/user-attachments/assets/781946aa-01ae-4589-b0be-b00c1c7d1817)

## Computer setup

**Chosen Integrated Development Environment (IDE):**
- Visual Studio Code (VSC)
- Thonny
      
[Visual Studio Code](https://code.visualstudio.com/download) has been my editor of choice since i began coding. VSC is where i feel comfortable coding and managing my projects.
Thonny was presented as an IDE for this course through a recorded lecture. Hence I chose to explore Thonny as an IDE. The microcontroller is fully managed through Thonny and all of the belonging code is written and tested in Thonny IDE.
    
I would recommend this setup for anyone who is comfortable and used to an IDE prior to taking this course. However I would strongly recommend to use [Thonny](https://thonny.org/) when connecting to the microcontroller and managing its files. Thonny is extremely simple to use and offers an environment suitable for coding in MicroPython, not only because of its shell offering an excellent debug-environment, but in addition there is basically no special installments needed for getting started.

**MicroPython firmware**

In order to access the Raspberry Pi Pico WH compatible firmware must be installed on to the device, which can be found [here](https://micropython.org/download/RPI_PICO_W/) along with detailed instructions.
MicroPython is a light version of Python made for microcontrollers.

## Putting everything together

![Circuit diagram](https://github.com/user-attachments/assets/5dbd6287-5aa1-4cbe-8ea4-98ae0b0b1737)

Above is a circuit diagram explaining wiring of the device.

Furthermore I have connected a red lamp (GP0) along with a resistor for debugging and testing.

![The DHT11 I used](https://github.com/user-attachments/assets/08d003fb-916e-44dd-bbed-a7e2c2303577)

_[Credit](https://www.electrothinks.com/2023/08/dht11-sensor-module.html)_

![image](https://github.com/user-attachments/assets/6688a018-bdfa-400b-9474-27f705e5b7b5)

_[Credit](https://www.electronicwings.com/esp32/dht11-sensor-interfacing-with-esp32)_

  - This first picture illustrates the function of each pin for the DHT11 I used.
  - However, DHT11s with fours pins are common as well, hence the picture illustrating both versions in case of confusion.

## Platform

This project is running on a cloud server (EC2) provided by Amazon Web Services (AWS). The EC2 instance is connected to an AWS Relational Database (RDS) where the data is stored and retrieved from.
Furthermore Nginx is installed on to the EC2 instance, which is a software that is known for its reliability, scalability and speed when it comes to serving content through the Hyper Text Transfer Protocol (HTTP). Which was ideal for this particular project since data will be transferred through the HTTP every five seconds in order to update each chart.

I chose to go with Amazon Web Services as a cloud service provider (CSP) because I personally wanted to strengthen my knowledge for this particular platform. Furthermore I consider having knowledge about AWS increases my value for future potential employers.

My initial idea was to implement a deep learning model that would predict a comfort level according to the current temperature and humidity. The deep learning model would be initialized with a set of manually inserted comfort levels according to temperature and humidity in order to make assumptions.

Cloud computing is suitable for when large amounts of data are being stored and/or processed and is mainly why I chose to go with the cloud. Unfortunately I had initially overlooked the fact that AWS charges the user upon used bandwidth. Implementing such a model would rapidly increase the monthly cost, which is why this function was disregarded.

_[Introduction to AWS](https://aws.amazon.com/getting-started/)_

_[Introduction to Nginx](https://nginx.org/en/docs/)_

## The Flask application code

```python
from flask import Flask, request, jsonify, render_template
import mysql.connector
import os
from dotenv import load_dotenv
from datetime import datetime

```

**Imports of Python libraries**
  - Flask - used for initializing server
  - request - used for fetching json data
  - jsonify - converts parameter in to json
  - render_template - serves files inside "template" directory
  - mysql.connector - used for connecting to server
  - os - for environment variables and file paths
  - load_dotenv - loads variables from a .env file
  - datetime - generates the current timestamp

```python
# Load credentials from .env
load_dotenv()

# Environment variables
DB_HOST = os.getenv("DB_HOSTNAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Flask app setup
app = Flask(__name__)

```

**Environment variables and Flask setup**
  - load.dotenv() - loads environment variables (hostname, username, password and name for database) in a way that keeps them secret for anyone viewing the code
  - os.getenv() retrieves the specified environment variable from the systems .env file
  - Flask(_name_) - instantiates an object of the Flask class.

```python
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

```

**Defining routes for HTML files**
  - @app.route() - depending on what IP-adress user enters
  - def home_page() - defines a function
  - return render_template() - returns a specified file inside the "templates" directory

```python
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

```

**Creating an endpoint**
  - @app.route("/api/data", methods=["POST"]) - Defines a new route that listens for HTTP requests using the POST method at specified endpoint
  - request.get_json() - parses JSON data
  - data.get() - fetches the specified value from the parsed JSON data
  - mysql.connector.connect() - Establishes a connection to the MySQL database
  - cursor.execute() - Runs the specified query along with specified values
  - conn.commit() - Commits the changes
  - cursor.close() - Garbage collection
  - conn.close() - Closes database connection
  - return jsonify() - Returns a response message and response code whether the insert was successful or not

```python
# Start server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

```

**Starting the server**
  - Starts a public server accessed through port 5000

## The microcontroller code

```python
import urequests
from machine import Pin
from time import sleep
from dht import DHT11
import os
import network
import gc

```

**Imports of Python libraries**
  - urequests - Enables HTTP requests to send retrieved data from the microcontroller to the server
  - Pin - Used to connect/control GPIO pins on the microcontroller
  - sleep - Function used to implement delays after readings
  - DHT11 - Drivers for the DHT11 sensor
  - os - Used for interacting with the filesystem
  - network - Used for connecting to the WiFi
  - gc - Garbage collection, if no garbage collection is used, the microcontroller will crash due to its small amount of memory

```python
def connect():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)

```

**Connecting to the WiFi**
  - network.WLAN(network.STA_IF) - Puts the WiFi in station mode
  - wlan.active(True) - Initializes the process of making the WiFi findable for the Pico
  - wlan.connect(ssid, password) - Connects to the specified WiFi

```python
sensor = DHT11(Pin(14))

led = Pin(0, Pin.OUT)
led.value(0)

```

**Establishing variables for the sensor and led**
  - 
