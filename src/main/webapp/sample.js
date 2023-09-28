/*
 * Copyright (C) 2015, 2023 Green Screens Ltd.
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

//import { QuarkEngine, Generator, Security } from '/demo/quark.mjs';
import { QuarkEngine, Generator, Security, Streams } from '/demo/modules/index.esm.mjs';

globalThis.QUARK_DEBUG = true;
globalThis.Generator = Generator;
globalThis.QuarkEngine = QuarkEngine;
globalThis.Security = Security;
globalThis.Streams = Streams;

const isSecured = location.protocol === "https:";
const wsProtocol = isSecured === true ? 'wss' : 'ws';
const ws = `${wsProtocol}://${location.host}/demo/socket`;
const api = `${location.origin}/demo/api`;

const msg = 'This is a test for encrypting đšžćčĐŠŽČ';

/**
 * Empty call without network channels
 */
async function test1() {

	const id = Date.now();
	const res = await fetch(api, {
		method: 'get',
		headers: {
			'x-time': id
		}
	});
	const def = await res.json();
	def.challenge = id;

	console.log('Building API');

	const generator = await Generator.build(def.api);

	console.log('Verifying encryption data');
	await Security.create(def);

	generator.on('call', (o) => {
		const result = {
			success: true,
			data: {}
		};
		o.detail.finish(result);
	});

	console.log('Calling API');
	const data = await io.greenscreens.Demo.hello('John Doe');
	console.log(data);

	generator.stop();

}

/**
 * Sample to initialize engine with Promises call
 * Connector is http servlet
 */
function test2() {

	const engine = new QuarkEngine({
		api: api,
		service: api
	});

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

	const engine = await QuarkEngine.init({
		api: api,
		service: api
	});

	try {
		data = await io.greenscreens.Demo.hello('John Doe');
		console.log(data);
	
	} finally {
		engine.stop();
	}

}

/**
 * Test JSON ecryption
 */
async function test4() {

	const challenge = Date.now();
	const res = await fetch(api, {
		method: 'get',
		headers: {
			'x-time': challenge
		}
	});
	const def = await res.json();
	def.challenge = challenge;

	const security = await Security.create(def);

	const enc = await security.encrypt(msg);
	console.log(enc);
}

/**
 * Test Getting user data
 * Connector is WebSocket service
 */
async function test5() {

	const engine = await QuarkEngine.init({
		api: api,
		service: ws
	});

	try {
		// no encryption on request as no data (parameter on functon)
		// response is encrypted
		const data = await io.greenscreens.Demo.saveUser('John Doe', 'john.doe@acme.com');
		console.log(data);		
	} finally {
		engine.stop();		
	}

}

/**
 * Test Getting list of users
 * Connector is WebSocket service
 */
async function test6() {

	const engine = await QuarkEngine.init({
		api: api,
		service: ws
	});

	try {
		const data = await io.greenscreens.Demo.listUsers();
		console.log(data);
	} finally {
		engine.stop();
	}
}

/**
 * Test multiple calls
 * Connector is WebSocket service
 */
async function test7() {

	const engine = await QuarkEngine.init({
		api: api,
		service: ws
	});

	try {
		let i = 10;
		while (i--) {
			let data = await io.greenscreens.Demo.hello('John Doe call: ' + i);
			console.log(data);
		}
	} finally {
		engine.stop();
	}

}

/**
 * Test multiple calls
 * Connector and API is WebSocket service
 */
async function test8() {

	const engine = await QuarkEngine.init({
		api: ws,
		service: ws
	});

	try {
		let i = 10;
		while (i--) {
			const data = await io.greenscreens.Demo.saveUser('John Doe', 'john.doe@acme.com');
			console.log(data);
		}
	} finally {
		engine.stop();
	}

}

/**
 * Test io.greenscreens.demo2 package (JT400)
 */
async function test9() {

	const engine = await QuarkEngine.init({
		api: ws,
		service: ws
	});

	try {
		const data = await io.greenscreens.AS400.login('YOUR_SYSTEM', 'QSECOFR', 'QSECOFR');
		console.log(data);
		await io.greenscreens.AS400.logout();
	} finally {
		engine.stop();
	}
}

/**
 * Test io.greenscreens.demo3 package (JT400 + IFS)
 */
async function test10() {

	const engine = await QuarkEngine.init({
		api: ws,
		service: ws
	});

	try {
		const data = await io.greenscreens.AS400.login('YOUR_SYSTEM', 'QSECOFR', 'QSECOFR');
		console.log(data);
	
		const ifs = await io.greenscreens.IFS.list('/');
		console.log(ifs);
	
		await io.greenscreens.AS400.logout();		
	} finally {
		engine.stop();
	}
}

/**
 * Test all
 * NOTE: it is enough to init engine only once.
 * Here, for the sake of tests, we are initializing engien everry time
 */
async function testAll() {
	await test1();
	await test3();
	await test4();
	await test5();
	await test6();
	await test7();
	await test8();
	test2();
}

globalThis.testAll = testAll;
globalThis.test = {test1, test2, test3, test4, test5, test6, test7, test8};