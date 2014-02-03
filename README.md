## Sensors base server

A [node.js](http://nodejs.org) app for collecting and displaying LLAP messages from sensors (a-la [Ciseco sensors](http://http://shop.ciseco.co.uk/sensor/)).

Hopefully it should not be too hard for you to poke around the sources, figuring out what code does what and how to modify it to one's needs.

## Notice

While doing this project was fun, I have moved on to a different solution for the same "problem". The approach taken in this project is "one app to rule them all": the node app monitors the incoming transmissions, processes them, logs the data, takes care of displaying the data over http. I was having hard time making the logging work the way I wanted, and figuring out how to display graphs was a bit daunting. So, all in all, I probably won't work on this anymore.

### Setup

The basic hardware setup is:
 - a server which runs this app (e.g. a [Raspberry Pi](http://raspberrypi.org) with a [Slice of Pi](http://shop.ciseco.co.uk/slice-of-pi-add-on-for-raspberry-pi/)+[XRF](http://shop.ciseco.co.uk/xrf-wireless-rf-radio-uart-rs232-serial-data-module-xbee-shape-arduino-pic-etc/), or a [Slice of Radio](http://shop.ciseco.co.uk/slice-of-radio-wireless-rf-transciever-for-the-raspberry-pi/) (appropriately [set up](http://openmicros.org/index.php/articles/94-ciseco-product-documentation/raspberry-pi/283-setting-up-my-raspberry-pi)); or just a PC/mac with an [URF](http://shop.ciseco.co.uk/urf-radio-module-and-serial-inteface-via-usb/))
 - some sensors whose messages are in Ciseco's [LLAP format](http://openmicros.org/index.php/articles/85-llap-lightweight-local-automation-protocol), and are being received on a serial port on the server (e.g. the ones from [Ciseco](http://shop.ciseco.co.uk/sensor/) with their default firmware).

The software setup / server side:
 - have [node](http://nodejs.org) installed
 - get the app's sources, e.g. clone this git repo: `git clone https://github.com/flabbergast/node-llap`
 - run `npm install` from the app's source directory
 - run the app by `npm app.js`
 - open [the website](http://localhost:8080) and enjoy

Note that currently the app expects one Ciseco's [sensor with a thermistor](http://shop.ciseco.co.uk/temperature-xrf-development-sensor-thermistor/), in the cyclic sleep/transmit mode. The device name should be `TM`. All the other LLAP will be only displayed in the log.

### More explanations

Since it's veery unlikely that you'll have the same setup as me, some editing of the sources might be necessary. For this reason, I'm including some explanations for the sources; and list some current limitations:

 - _Problems_:
    - only one serial port on the server: so one can't have wireless sensors together with, say, an Arduino over a USB
    - the displayed logs are not being continuously updated, one has to click the 'refresh' button

 - _Structure_:
    - On the server side there is a _socket_ to each client (the main chunk of code for this is in `modules/socket_server.js`); and code to deal with the serial port (`modules/serial_node.js`).
    - The client side is connected to a _socket_ (code is in `public/js/socket_client.js`).
    - Sockets are implemented via [socket.io](http://socket.io/); for 'transmitting' a message via a socket one uses `socket.emit(...)`; for 'listening' for a message and act upon its receipt one uses `socket.on(...)`.
    - The sources for the web page are `views/{index.jade,layout.jade}`, `public/css/style.styl` and `public/js/index.js`. Clicking on buttons (code in `index.js`) `socket.emit`'s, received messages are `socket.on`-listened to in `socket_client.js`, which then updates the page using [jquery](http://jquery.org).
    - All received messages are logged to [winston](https://github.com/flatiron/winston)'s file backend on receipt (function `onDataOverSerial` in `socket_server.js`).

### Changelog

#### [0.1.0](https://github.com/flabbergast/node-llap/releases/tag/v0.1.0)

Working code (on my machines). Running elsewhere will likely need some source modifications.

### Credits

Originally inspired by [Node-LEDS](http://www.quietless.com/kitchen/controlling-24-leds-with-node-js-and-a-raspberry-pi/).
