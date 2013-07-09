## Sensors base server

A [node.js](http://nodejs.org) app for collecting and displaying LLAP messages from sensors (a-la [Ciseco sensors](http://http://shop.ciseco.co.uk/sensor/)).

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

Since it's veery unlikely that you'll have the same setup as me, some editing of the sources might be necessary. For this reason, I'm including some explanations for the sources:


### Credits

Originally inspired by [Node-LEDS](http://www.quietless.com/kitchen/controlling-24-leds-with-node-js-and-a-raspberry-pi/).