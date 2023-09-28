/*
 * Copyright (C) 2015, 2023 Green Screens Ltd.
 */
if (!globalThis.crypto.subtle) {
	const loc = globalThis.Terminal ? '/**' : '/';
	globalThis.CRYPTO_WASM = loc  + 'assets/3rdparty/cryptojs';
	globalThis.CRYPTO_GO = globalThis.CRYPTO_WASM;
    const { CryptoKeyJS, CryptoJS, WasmLoader } = await import(`${CRYPTO_GO}/io.greenscreens.cryptojs.min.js`);
    await WasmLoader.init();
    globalThis.CryptoKey = CryptoKeyJS;
    globalThis.crypto.subtle = new CryptoJS();
    Object.seal(globalThis.crypto.subtle);
    Object.seal(globalThis.crypto);
}
