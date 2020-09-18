/*
 * Copyright (C) 2015, 2020  Green Screens Ltd.
 */

/**
 * Demo showing remote API calls through WebSocket or http/s fetch  
 *
 * NOTE: Engine.init should be used only once to initialize 
 *       Here it is used in every function only for testing purposes  
 * 
 * api - used to retrieve API definitions 
 * ws - used for API service call
 * 
 *  NOTE: if *api* used as a service call, 
 *  http/s protocol will be used instead of WebSocket protocol.
 *  
 *   This engine supports both channels
 */

const isSecured  = location.protocol === "https:";
const wsProtocol = isSecured === true ? 'wss':'ws';
const ws    = `${wsProtocol}://${location.host}/io.greenscreens.quark/socket`;
const api   = `${location.origin}/io.greenscreens.quark/api`;

const msg   = 'This is a test for encrypting đšžćčĐŠŽČ';

/**
 * Empty call without network channels
 */
async function test1() {

	let id = Date.now();
	let res = await fetch(api, { method: 'get', headers: { 'x-time': id } });
	let def = await res.json();
	def.challenge = id;
	
	console.log('Building API');
	
	let generator = await Generator.build(def.api);
	
	console.log('Verifying encryption data');
	await Security.init(def);
	
    generator.on('call', function(o, cb){o.result={success:true, data: {}};cb(null, o)});

	console.log('Calling API');
    let data = await io.greenscreens.Demo.hello('John Doe');
    console.log(data);

	generator.stop();

}

/**
 * Sample to initialize engine with Promises call
 * Connector is http servlet 
 */
function test2() {

    let engine = new Engine({api: api, service:api});
	
	engine.init()
    .then(() => {
        console.log('Engine ready');
        return io.greenscreens.Demo.hello('John Doe');
    })
    .then(o => {
        console.log('API call result');
        console.log(o);
    })
    .catch(e => {
        console.log(e.message || e.msg || e);
    })
	.finally(() => engine.stop());    

}

/**
 * Sample to initialize engine with async function
 * Connector is http servlet
 */
async function test3() {

	let data = null;
	
    let engine = await Engine.init({api: api, service:api});

	// encryption enabled by default (see DemoController.java)
    data = await io.greenscreens.Demo.hello('John Doe');
    console.log(data);

	// encryption disabled (see DemoController.java)
    data = await io.greenscreens.Demo.helloUnsafe('John Doe');
    console.log(data);

	engine.stop();
}

/**
 * Test JSON ecryption
 */
async function test4() {

	let challenge = Date.now();
	let res = await fetch(api, { method: 'get', headers: { 'x-time': challenge } });
	let def = await res.json();
	def.challenge = challenge;
	
	let security = await Security.init(def);	
					
    let enc = await security.encrypt(msg);
    console.log(enc);
}

/**
 * Test Getting user data
 * Connector is WebSocket service
 */
async function test5() {

    let engine = await Engine.init({api: api, service:ws});

	// no encryption on request as no data (parameter on functon)
	// response is encrypted
    let data = await io.greenscreens.Demo.saveUser('John Doe', 'john.doe@acme.com');
    console.log(data);
	
	engine.stop();
}

/**
 * Test Getting list of users
 * Connector is WebSocket service
 */
async function test6() {

    let engine = await Engine.init({api: api, service:ws});

    let data = await io.greenscreens.Demo.listUsers();
    console.log(data);

	engine.stop();
}

/**
 * Test multiple calls
 * Connector is WebSocket service
 */
async function test7() {

    let engine = await Engine.init({api: api, service:ws});

	let i = 10;
	while(i--) {
      let data = await io.greenscreens.Demo.hello('John Doe call: ' + i);
      console.log(data);		
	}
	
	engine.stop();

}

/**
 * Test multiple calls 
 * Connector and API is WebSocket service
 */
async function test8() {

    let engine = await Engine.init({api: ws, service:ws});

	let i = 10;
	while(i--) {
      let data = await io.greenscreens.Demo.hello('John Doe call: ' + i);
      console.log(data);		
	}

	engine.stop();

}

/**
 * Test io.greenscreens.demo2 package (JT400) 
 */
async function test9() {

    let engine = await Engine.init({api: ws, service:ws});
	
	let data = await io.greenscreens.AS400.login('YOUR_SYSTEM', 'QSECOFR', 'QSECOFR');	
	console.log(data);
	await io.greenscreens.AS400.logout();
	engine.stop();
}

/**
 * Test io.greenscreens.demo3 package (JT400 + IFS) 
 */
async function test10() {

    let engine = await Engine.init({api: ws, service:ws});
	
	let data = await io.greenscreens.AS400.login('YOUR_SYSTEM', 'QSECOFR', 'QSECOFR');	
	console.log(data);
	
	let ifs = await io.greenscreens.IFS.list('/');
	console.log(ifs);
	
	await io.greenscreens.AS400.logout();
	engine.stop();
}

async function test() {
	await test1();
	await test3();
	await test4();
	await test5();
	await test6();
	await test7();
	await test8();
	test2();
}