
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

#### Material
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


**Computer setup**

**Chosen Integrated Development Environment (IDE):**
- Visual Studio Code (VSC)
- Thonny
      
[Visual Studio Code](https://code.visualstudio.com/download) has been my editor of choice since i began coding. VSC is where i feel comfortable coding and managing my projects.
Thonny was presented as an IDE for this course through a recorded lecture. Hence I chose to explore Thonny as an IDE. The microcontroller is fully managed through Thonny and all of the belonging code is written and tested in Thonny IDE.
    
I would recommend this setup for anyone who is comfortable and used to an IDE prior to taking this course. However I would strongly recommend to use [Thonny](https://thonny.org/) when connecting to the microcontroller and managing its files. Thonny is extremely simple to use and offers an environment suitable for coding in MicroPython, not only because of its shell offering an excellent debug-environment, but in addition there is basically no special installments needed for getting started.

**MicroPython firmware**

In order to access the Raspberry Pi Pico WH compatible firmware must be installed on to the device, which can be found [here](https://micropython.org/download/RPI_PICO_W/) along with detailed instructions.
MicroPython is a light version of Python made for microcontrollers.

**Putting everything together**

![Circuit diagram](https://github.com/user-attachments/assets/8e23de3f-3519-4df6-b8be-79e4ef620ff7)


The DHT11 is connected in the following manner:
  - GND (pin 38) is connected to the GND (ground) pin of the sensor, which connects the sensor to the ground of the circuit.
  - GP14 is connected to the data pin, which outputs temperature and humidity to the microcontroller.
  - 3V3(OUT) (pin 36) is connected to the VCC pin, which is the power supply.

Furthermore I have connected a red lamp (GP0) along with a resistor for debugging and testing.

![image](https://github.com/user-attachments/assets/101cf131-c818-48eb-a603-93af967c1db6)

_[Credit](https://www.researchgate.net/figure/The-pin-diagram-of-DHT11-temperature-sensors_fig2_359068957)_
  - This picture illustrates the function of each pin for the DHT11.
  - However, DHT11s with fours pins are common as well, hence the picture illustrating both versions in case of confusion.

**Platform**

This project is running on a cloud server (EC2) provided by Amazon Web Services (AWS). The EC2 instance is connected to an AWS Relational Database (RDS) where the data is stored and retrieved from.
Furthermore Nginx is installed on to the EC2 instance, which is a software that is known for its reliability, scalability and speed when it comes to serving content through the Hyper Text Transfer Protocol (HTTP).

I chose to go with Amazon Web Services as a cloud service provider (CSP) because I personally wanted to strengthen my knowledge for this particular CSP.
