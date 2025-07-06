import urequests
from machine import Pin
from time import sleep
from dht import DHT11
import os
import network
import gc

os.uname()

# My Wi-Fi information (help from this article: https://projects.raspberrypi.org/en/projects/get-started-pico-w/2)
ssid = 'TP-Link_Extender'
password = 'Fridaoscar48'

def connect():
    # Connecting to WLAN
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    # Keep sending connection requests to router
    while wlan.isconnected() == False:
        print('Establishing connection...')
        sleep(2)
    ip = wlan.ifconfig()[0]
    print(f'Connected on: {ip}')

connect()

sensor = DHT11(Pin(14))

led = Pin(0, Pin.OUT)
led.value(0)

while True:
    sensor.measure()
    
    temperature = sensor.temperature()
    humidity = sensor.humidity()
    
    print("Temperature (C):", temperature, "Humidity (%):", humidity)
    sleep(1)
    
    if humidity > 60:
        led.value(1)
    else:
        led.value(0)
    sleep(1)
    
    
    # Sending data to Flask API

    # My website URL
    url = "http://climatebot.net:5000/api/data"

    # Data i want to send, as JSON
    data = {"temperature": temperature, "humidity": humidity}

    # Performing the send
    response = urequests.post(url, json=data)
    
    # Garbage collection
    response.close()
    gc.collect
    
    sleep(5)