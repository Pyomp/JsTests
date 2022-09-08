# Simple DataChannel RTC setup

## Dependencies

 - ws for node js, https://www.npmjs.com/package/ws

## Use ()

 - $> npm i
 - $> node server.js
 - open http://localhost on 2 browsers
 - click createOffer on one
 - spam pingBtn as you want (look console)

## Commentary

In production, we need a STUN server, it expose public ip adresse of clients.
However, this ip is the ip of the client router not the computer.
So, we needs a TURN server, a proxy server between the two clients.

In my mind, Web RTC is not a real P2P, however, this server can be more performant than a websocket server.