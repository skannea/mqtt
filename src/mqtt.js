// skannea
// ============================================= MQTT
const mqtt = { 
client : {status:'empty'}  // for Paho client lib properties and methods 
,
config : {} // for MQTT setup
, 
// --------------------------------------------- 
debug: function ( s ) {
    if ( typeof( mqtt.config.debug ) === 'function' ) mqtt.config.debug( s );
}
, 
// --------------------------------------------- 
log: function ( s ) {
    if ( typeof( mqtt.config.log ) === 'function' ) mqtt.config.log( s );
}
, 
// --------------------------------------------- 
begin: function () {
    // called at start but also for retrials. Do not recreate mqtt.client 
	
    if (mqtt.client.status == 'empty' )
        mqtt.client = new Paho.MQTT.Client( mqtt.config.host, mqtt.config.port, mqtt.config.client );
       
    var connectOptions = { // to be used when connecting
			userName:  mqtt.config.userName,
			password:  mqtt.config.password,
            useSSL:    mqtt.config.useSSL
		};

    if (mqtt.config.lastwillTopic) {
       var lwt = new Paho.MQTT.Message(mqtt.config.client);
       lwt.retained = false;        
       lwt.qos = 0;
	   lwt.destinationName = mqtt.config.lastwillTopic;
       connectOptions.willMessage = lwt;
    }
    
   // assign handlers to client and/or to connectOptions  
   // each handler optionally calls a user defined function
    mqtt.client.onMessageArrived = 
    // --------------------------------------------- 
    function ( msg ){ 
       mqtt.debug(`onMessage: ${msg.destinationName}:${msg.payloadString}`);   
       try {
         if ( typeof( mqtt.config.onMessage ) === 'function' ) 
            mqtt.config.onMessage( msg.destinationName, JSON.parse(msg.payloadString)  ); 
       }  catch (error) {  mqtt.log(error); }
    }; 
    
    connectOptions.onFailure, mqtt.client.onConnectionLost = 
    // --------------------------------------------- 
    function (fail) {
      ////mqtt.log('MQTT failure: ' + fail.errorMessage);   
      try {
        if ( typeof( mqtt.config.onFailure ) === 'function' ) mqtt.config.onFailure(fail.errorMessage); 
        setTimeout( mqtt.begin, mqtt.config.timeout);
      } catch (error) { mqtt.log(error); }      
    };

    connectOptions.onSuccess =
    // --------------------------------------------- 
    function( ) {
      mqtt.log('MQTT connection ');   
      try {
             if ( typeof( mqtt.config.onSuccess ) === 'function' ) 
                 mqtt.config.onSuccess(); 
             if (mqtt.config.birthTopic) 
                 mqtt.send( mqtt.config.birthTopic, mqtt.config.client );
      }  catch (error) {  mqtt.log(error); }
    }; 

    // make connection trial 
    try {
        delete connectOptions.mqttVersionExplicit; // due to library bug   
        mqtt.client.connect(connectOptions); 
    } catch (error) {  mqtt.log(error); }
}    
, 
// --------------------------------------------- 
subscribe: function ( topic ) {
    mqtt.debug('MQTT subscribe: ' + topic);   
    mqtt.client.subscribe( topic );
}    
, 
// --------------------------------------------- 
unsubscribe: function ( topic ) {
    mqtt.debug('MQTT unsubscribe: ' + topic);   
    mqtt.client.unsubscribe( topic );
}    
,
// --------------------------------------------- 
send: function ( topic, payload ) { 
    mqtt.debug('MQTT send: ' + topic + ':' + payload);   
	var message = new Paho.MQTT.Message( payload );
    message.retained = false;        
	message.destinationName = topic;
	mqtt.client.send(message);
}
, 
// --------------------------------------------- 
sendRetained: function ( topic, payload ) { 
    mqtt.debug('MQTT send retained: ' + topic + ':' + payload);   
	var message = new Paho.MQTT.Message( payload );
    message.retained = true;        
	message.destinationName = topic;
	mqtt.client.send(message);
} 
,
// --------------------------------------------- 
// get MQTT credentials object.  
// returns { user: USERNAME, pass:PASSWORD, source:SOURCE } where SOURCE is 
// CODE   if USERNAME and PASSWORD are provided as arguments
// URL    if url contains ...&mqttuser:USERNAME&mqttpass:PASSWORD
// STORE  if sessionStorage contains items mqttuser and mqttpass
// PROMPT if USERNAME and PASSWORD are prompted for and entered

   
getCreds: function ( user, pass ) {  
   if (user) { // provided as argument
       return { user:user, pass:pass, source:'CODE' };
   }
   user = com.getUrlParam( 'mqttuser','');
   pass = com.getUrlParam( 'mqttpass','');
   //  credentials in URL
   if (user) { // use credentials
       return { user:user, pass:pass, source:'URL' };
   }
   
   user = window.sessionStorage.getItem( 'mqttuser' );
   pass = window.sessionStorage.getItem( 'mqttpass' );
   // no credentials in URL, but in storage
   if (user) {  // un-store credentials, return credentials
       window.sessionStorage.removeItem( 'mqttuser' );
       window.sessionStorage.removeItem( 'mqttpass' );
       return { user:user, pass:pass, source:'STORE' };
   }

     user = prompt('MQTT username:');
     pass = prompt('MQTT password:');
     return { user:user, pass:pass, source:'PROMPT' };
}   

} // end of mqtt object
