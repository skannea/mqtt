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
|userName |          |       |required when broker access is restricted 
|password |          |       |required when broker access is restricted 
|source |          |       | 
|host | ip-address of broker         | '192.168.0.111'       |required when MQTT broker access is restricted 
|port |          |       |
|useSSL |          | true      |
|client |          |       |
|timeout |retry time? ms          |       |2000 
|debug |          |       |
|birthTopic |          |       |
|lastwillTopic |          |       |
|onSuccess |function() called when connection is established  |       |
|onMessage |function(          |       |
|onFailure |          |       |
|log |          |       |
|log |          |       |

~~~
   mqtt.config = 
       {
       userName :         userpass.user, 
       password :         userpass.pass,
       source :           userpass.source, 
       host :             '192.168.0.111',
       port :             1884,
       useSSL :           false, 
       client :           'qdashlocal_'+ unique,
       timeout :          2000,  // ms
       debug: log,
       log: timelog
       };      

    mqtt.config.birthTopic =    'fromweb/clientup';     
    mqtt.config.lastwillTopic = 'fromweb/clientdown';     


    mqtt.config.onSuccess = 
      // ----------------------------------
      function( ) {
        statusline('MQTT connection');
        qd.onSuccess();
        mqtt.subscribe( 'toweb/storysave/logname' ); //§§
        mqtt.subscribe( 'toweb/storysave/power' ); //§§
        mqtt.subscribe( 'toweb/storysave/periodic' ); //§§
      };
     
    mqtt.config.onMessage = 
      // ----------------------------------
      function ( topic, data ){ 
        qd.onMessage( topic, data );
        myLogging( topic, data ); //§§ 
      } 
      
    mqtt.config.onFailure = 
      // ----------------------------------
      function ( err ){
        statusline('MQTT connection failed: ' + err );
      } 
      

~~~
