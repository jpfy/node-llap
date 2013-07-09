## Sensors base server

A [node.js](http://nodejs.org) app for collecting and displaying LLAP messages from sensors (a-la [Ciseco sensors](http://http://shop.ciseco.co.uk/sensor/)).

### Setup

The basic setup is:
 - a server which runs this app (e.g. a Raspberry Pi)
 - some sensors whose messages are being received on a serial port on the server.
The app then logs the messages into a file and runs a web server, which displays the current data in a nice way.

### Credits

Originally inspired by [Node-LEDS](http://www.quietless.com/kitchen/controlling-24-leds-with-node-js-and-a-raspberry-pi/).