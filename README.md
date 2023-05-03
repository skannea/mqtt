# MQTT wrapper
The MQTT JavaScript support based on [Eclipse Paho JavaScript client](https://github.com/eclipse/paho.mqtt.javascript).
Configuration data and functions are provided as properties of the `mqtt` object.

## Include files
In examples, this include is used to access Eclipse Paho library: 

`<script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.js" type="text/javascript"></script>`

## Wrapper configuration object
The `mqtt.config` object have the following properties:

|property|description|example|conditions
|--------|-----------|-------|---------
|userName | MQTT credential   |       |required when access to broker is restricted 
|password | MQTT credential   |       |required when access to broker is restricted
|host | URL or ip-address of broker   | 'mqtt.myveryown.duckdns.org', '192.168.47.11'      |required when MQTT broker access is restricted 
|port | Port to access broker.   | see  |required
|useSSL | When true, a secure connection will be used. | true      |required
|client | Unique client id. (String)  |  `'myapp'+Math.floor(Date.now()/1000)` | required
|timeout |retry time? ms          |       |2000 
|birthTopic | When connection is established, a message with this topic and with client id as payload will be published. | report/up  |optional
|lastwillTopic | When connection is ended, broker will publish a message with this topic and without payload.   | report/down  | optional
|onSuccess |When connection is established this `function( )` is called. MQTT subscribe must not be done prior to this. | see below | optional
|onMessage |For every received message, the payload is assumed to be a JSON string. The payload is converted to an object and passed to this `function( topic, object )` | see below | required
|onFailure |When no connection can be established or a sudden disconnection happens, this `function( error )` is called, where `error` is a string describing the cause. | see below | optional
|debug |For internal debug purposes this `function( string )` is called. | console.log | 
|log |For internal error reporting this `function( string )` is called. | console.log |

Examples of call back functions:

~~~
    mqtt.config.onSuccess = 
      function( ) {
        mqtt.subscribe( 'toweb/status' ); 
      };
     
    mqtt.config.onMessage = 
      function ( topic, data ) { 
        if ( topic == 'toweb/status' ) setStatus( data.status, data.entity ); 
      } 
      
    mqtt.config.onFailure = 
      function ( err ){
        document.getElementById('errorline').innerHTML = 'Error: ' + err ;
      } 
~~~

## Wrapper functions
The `mqtt` object have the following functions:

|function|description|
|--------|-----------|
|`begin( )` | called at start but also for retrials   |       
|`subscribe( topic )` | Start subscription for `topic`. Topic may include wildcards `#` and `+`.   |       
|`unsubscribe( topic )`  | Stop subscription for `topic`.  |       
|`send( topic, payload )`  | Publish a (non-retained) message with `topic` and `payload`.  |       
|`sendRetained( topic, payload )`  | Publish a retained message with `topic` and `payload`.  |       
|`getCreds( user, pass )`|Get MQTT credentials object. See below. |   

### mqtt.getCreds
The function `getCreds( user, pass )` returns an object `{ user: USERNAME, pass:PASSWORD, source:SOURCE }` where SOURCE is a string that describes how the credentials were retrieved: 

|source|description|
|--------|-----------|
|`'CODE'` | if USERNAME and PASSWORD were provided as arguments (and not just empty strings)|
|`'URL'` | if the url contains the credentials, like  `...&mqttuser:USERNAME&mqttpass:PASSWORD`|
|`'STORE'` | if sessionStorage contains items `mqttuser` and `mqttpass`|
|`'PROMPT'` | if USERNAME and PASSWORD are prompted for and entered|
