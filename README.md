# MQTT wrapper
JavaScript support based on [Eclipse Paho JavaScript client](https://github.com/eclipse/paho.mqtt.javascript).
Configuration data and functions are provided as properties of the `mqtt` object.

## Include files
In examples, this include is used to access Eclipse Paho library: 

`<script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.js" type="text/javascript"></script>`

## Wrapper configuration object
The `mqtt.config` object have the following properties:

|property|description|example|conditions
|--------|-----------|-------|---------
|userName | MQTT credential   |       |required when broker access is restricted 
|password | MQTT credential   |       |required when broker access is restricted 
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
