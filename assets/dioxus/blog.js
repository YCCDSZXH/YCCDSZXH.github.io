import { RawInterpreter } from './snippets/dioxus-interpreter-js-7e2aed97ebee2c55/inline0.js';
import { setAttributeInner } from './snippets/dioxus-interpreter-js-7e2aed97ebee2c55/src/js/common.js';
import { WebDioxusChannel } from './snippets/dioxus-interpreter-js-7e2aed97ebee2c55/src/js/eval.js';
import { get_select_data } from './snippets/dioxus-web-10186f9fcc0b4418/inline1.js';
import * as __wbg_star0 from './snippets/dioxus-web-10186f9fcc0b4418/inline0.js';

let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_52(arg0, arg1, arg2) {
    wasm.closure353_externref_shim(arg0, arg1, arg2);
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_55(arg0, arg1, arg2) {
    wasm.closure336_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_58(arg0, arg1, arg2) {
    wasm.closure563_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_61(arg0, arg1) {
    wasm.__wbindgen_export_7(arg0, arg1);
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(wasm.__wbindgen_export_2.get(slice[i]));
    }
    wasm.__wbindgen_export_9(ptr, len);
    return result;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__wbindgen_export_10();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addToExternrefTable0(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_export_11(idx);
    }
}
function __wbg_adapter_184(arg0, arg1, arg2, arg3) {
    wasm.closure602_externref_shim(arg0, arg1, arg2, arg3);
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0));
/**
*/
export class IntoUnderlyingByteSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingByteSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingbytesource_free(ptr);
    }
    /**
    * @returns {string}
    */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.intounderlyingbytesource_type(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_8(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {number}
    */
    get autoAllocateChunkSize() {
        const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {ReadableByteStreamController} controller
    */
    start(controller) {
        wasm.intounderlyingbytesource_start(this.__wbg_ptr, controller);
    }
    /**
    * @param {ReadableByteStreamController} controller
    * @returns {Promise<any>}
    */
    pull(controller) {
        const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    /**
    */
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingbytesource_cancel(ptr);
    }
}

const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsink_free(ptr >>> 0));
/**
*/
export class IntoUnderlyingSink {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsink_free(ptr);
    }
    /**
    * @param {any} chunk
    * @returns {Promise<any>}
    */
    write(chunk) {
        const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, chunk);
        return ret;
    }
    /**
    * @returns {Promise<any>}
    */
    close() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_close(ptr);
        return ret;
    }
    /**
    * @param {any} reason
    * @returns {Promise<any>}
    */
    abort(reason) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_abort(ptr, reason);
        return ret;
    }
}

const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsource_free(ptr >>> 0));
/**
*/
export class IntoUnderlyingSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsource_free(ptr);
    }
    /**
    * @param {ReadableStreamDefaultController} controller
    * @returns {Promise<any>}
    */
    pull(controller) {
        const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    /**
    */
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingsource_cancel(ptr);
    }
}

const JSOwnerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsowner_free(ptr >>> 0));
/**
*/
export class JSOwner {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(JSOwner.prototype);
        obj.__wbg_ptr = ptr;
        JSOwnerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JSOwnerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsowner_free(ptr);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_abort_2aa7521d5690750e = function(arg0) {
        arg0.abort();
    };
    imports.wbg.__wbg_new_72fb9a18b5ae2624 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_63b92bc8671ed464 = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_new_0d76b0581eca6298 = function() { return handleError(function () {
        const ret = new AbortController();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_signal_a61f78a3478fd9bc = function(arg0) {
        const ret = arg0.signal;
        return ret;
    };
    imports.wbg.__wbg_fetch_921fad6ef9e883dd = function(arg0, arg1) {
        const ret = arg0.fetch(arg1);
        return ret;
    };
    imports.wbg.__wbg_fetch_1e4e8ed1f64c7e28 = typeof fetch == 'function' ? fetch : notDefined('fetch');
    imports.wbg.__wbg_instanceof_Response_849eb93e75734b6e = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_status_61a01141acd3cf74 = function(arg0) {
        const ret = arg0.status;
        return ret;
    };
    imports.wbg.__wbg_url_5f6dc4009ac5f99d = function(arg0, arg1) {
        const ret = arg1.url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_headers_9620bfada380764a = function(arg0) {
        const ret = arg0.headers;
        return ret;
    };
    imports.wbg.__wbg_arrayBuffer_29931d52c7206b02 = function() { return handleError(function (arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_c20a40f15020d68a = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_setscrollRestoration_a49bd3c3355dd0cf = function() { return handleError(function (arg0, arg1) {
        arg0.scrollRestoration = arg1;
    }, arguments) };
    imports.wbg.__wbg_back_eed6c9ffd402e26e = function() { return handleError(function (arg0) {
        arg0.back();
    }, arguments) };
    imports.wbg.__wbg_forward_124e6df53a7e8a2c = function() { return handleError(function (arg0) {
        arg0.forward();
    }, arguments) };
    imports.wbg.__wbg_new_16b304a2cfa7ff4a = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbg_push_a5b05aedc7234f9f = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_pushState_b8e8d346f8bb33fd = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.pushState(arg1, getStringFromWasm0(arg2, arg3), arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5));
    }, arguments) };
    imports.wbg.__wbg_sethref_b94692d1a9f05b53 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.href = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_4283b15b4f039eb5 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_5d31483804421bfa = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4 !== 0);
    }, arguments) };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_state_9cc3f933b7d50acb = function() { return handleError(function (arg0) {
        const ret = arg0.state;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_bd8e338fbd5f5cc8 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_requestAnimationFrame_549258cfa66011f0 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.requestAnimationFrame(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_cancelAnimationFrame_111532f326e480af = function() { return handleError(function (arg0, arg1) {
        arg0.cancelAnimationFrame(arg1);
    }, arguments) };
    imports.wbg.__wbg_pathname_5449afe3829f96a1 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.pathname;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_search_489f12953342ec1f = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_hash_553098e838e06c1d = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.hash;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_instanceof_IdbFactory_c70f8c7294f93655 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof IDBFactory;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setonupgradeneeded_ad7645373c7d5e1b = function(arg0, arg1) {
        arg0.onupgradeneeded = arg1;
    };
    imports.wbg.__wbg_location_2951b5ee34f19221 = function(arg0) {
        const ret = arg0.location;
        return ret;
    };
    imports.wbg.__wbg_origin_ee93e29ace71f568 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.origin;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_new0_7d84e5b2cd9fdc73 = function() {
        const ret = new Date();
        return ret;
    };
    imports.wbg.__wbg_getTime_2bc4375165f02d15 = function(arg0) {
        const ret = arg0.getTime();
        return ret;
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_export_8(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_instanceof_HtmlElement_3bcc4ff70cfdcba5 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_getBoundingClientRect_91e6d57c4e65f745 = function(arg0) {
        const ret = arg0.getBoundingClientRect();
        return ret;
    };
    imports.wbg.__wbg_left_fe0a839abdd508f4 = function(arg0) {
        const ret = arg0.left;
        return ret;
    };
    imports.wbg.__wbg_top_c4e2234a035a3d25 = function(arg0) {
        const ret = arg0.top;
        return ret;
    };
    imports.wbg.__wbg_width_b455dec2a8f76e45 = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_height_424ebb12c15f2691 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_blur_51f7b635f18a0eec = function() { return handleError(function (arg0) {
        arg0.blur();
    }, arguments) };
    imports.wbg.__wbg_focus_39d4b8ba8ff9df14 = function() { return handleError(function (arg0) {
        arg0.focus();
    }, arguments) };
    imports.wbg.__wbg_clientX_32cdd4a59d3eff3f = function(arg0) {
        const ret = arg0.clientX;
        return ret;
    };
    imports.wbg.__wbg_clientY_155c09997817066a = function(arg0) {
        const ret = arg0.clientY;
        return ret;
    };
    imports.wbg.__wbg_screenX_2cfd631f114f20a6 = function(arg0) {
        const ret = arg0.screenX;
        return ret;
    };
    imports.wbg.__wbg_screenY_b1152d8a9e6d9730 = function(arg0) {
        const ret = arg0.screenY;
        return ret;
    };
    imports.wbg.__wbg_pageX_fa02f6046f16d09a = function(arg0) {
        const ret = arg0.pageX;
        return ret;
    };
    imports.wbg.__wbg_pageY_d1a7e78ba5b4cc5c = function(arg0) {
        const ret = arg0.pageY;
        return ret;
    };
    imports.wbg.__wbg_identifier_02d52b63cc6ddc4d = function(arg0) {
        const ret = arg0.identifier;
        return ret;
    };
    imports.wbg.__wbg_force_139077aa422a42a5 = function(arg0) {
        const ret = arg0.force;
        return ret;
    };
    imports.wbg.__wbg_radiusX_dc01e55acd40fd6a = function(arg0) {
        const ret = arg0.radiusX;
        return ret;
    };
    imports.wbg.__wbg_radiusY_c60f80073028f80e = function(arg0) {
        const ret = arg0.radiusY;
        return ret;
    };
    imports.wbg.__wbg_rotationAngle_99c4da350e2fbc0b = function(arg0) {
        const ret = arg0.rotationAngle;
        return ret;
    };
    imports.wbg.__wbg_data_1d8005e6d66d881b = function(arg0, arg1) {
        const ret = arg1.data;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_key_dccf9e8aa1315a8e = function(arg0, arg1) {
        const ret = arg1.key;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_code_3b0c3912a2351163 = function(arg0, arg1) {
        const ret = arg1.code;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_location_f7b033ddfc516739 = function(arg0) {
        const ret = arg0.location;
        return ret;
    };
    imports.wbg.__wbg_repeat_f64b916c6eed0685 = function(arg0) {
        const ret = arg0.repeat;
        return ret;
    };
    imports.wbg.__wbg_isComposing_a0b97b7ba6491ed6 = function(arg0) {
        const ret = arg0.isComposing;
        return ret;
    };
    imports.wbg.__wbg_altKey_2e6c34c37088d8b1 = function(arg0) {
        const ret = arg0.altKey;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_bb5b6fef87339703 = function(arg0) {
        const ret = arg0.ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_6bf4ae4e83a11278 = function(arg0) {
        const ret = arg0.metaKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_5911baf439ab232b = function(arg0) {
        const ret = arg0.shiftKey;
        return ret;
    };
    imports.wbg.__wbg_altKey_c5d3bae8fdb559b7 = function(arg0) {
        const ret = arg0.altKey;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_02edd6fb9dbc84cd = function(arg0) {
        const ret = arg0.ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_1b09e179e3cbc983 = function(arg0) {
        const ret = arg0.metaKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_e7faa1993dbdf8f7 = function(arg0) {
        const ret = arg0.shiftKey;
        return ret;
    };
    imports.wbg.__wbg_touches_c0f077e3c2429577 = function(arg0) {
        const ret = arg0.touches;
        return ret;
    };
    imports.wbg.__wbg_length_679e0f1f9f0744bd = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_changedTouches_d044c818dbcb83b1 = function(arg0) {
        const ret = arg0.changedTouches;
        return ret;
    };
    imports.wbg.__wbg_targetTouches_384f47fad6286ff3 = function(arg0) {
        const ret = arg0.targetTouches;
        return ret;
    };
    imports.wbg.__wbg_pointerId_e030fa156647fedd = function(arg0) {
        const ret = arg0.pointerId;
        return ret;
    };
    imports.wbg.__wbg_width_d958d6a2a78fb698 = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_height_56cbcc76af0c788c = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_pressure_99cd07399f942a7c = function(arg0) {
        const ret = arg0.pressure;
        return ret;
    };
    imports.wbg.__wbg_tangentialPressure_b6312f1836d65d5d = function(arg0) {
        const ret = arg0.tangentialPressure;
        return ret;
    };
    imports.wbg.__wbg_tiltX_baf43517babb41bc = function(arg0) {
        const ret = arg0.tiltX;
        return ret;
    };
    imports.wbg.__wbg_tiltY_2f272b32098157d0 = function(arg0) {
        const ret = arg0.tiltY;
        return ret;
    };
    imports.wbg.__wbg_twist_64860f49ddf37a43 = function(arg0) {
        const ret = arg0.twist;
        return ret;
    };
    imports.wbg.__wbg_pointerType_0f2f0383406aa7fa = function(arg0, arg1) {
        const ret = arg1.pointerType;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_isPrimary_6e8e807f17a489ea = function(arg0) {
        const ret = arg0.isPrimary;
        return ret;
    };
    imports.wbg.__wbg_deltaMode_294b2eaf54047265 = function(arg0) {
        const ret = arg0.deltaMode;
        return ret;
    };
    imports.wbg.__wbg_deltaX_206576827ededbe5 = function(arg0) {
        const ret = arg0.deltaX;
        return ret;
    };
    imports.wbg.__wbg_deltaY_032e327e216f2b2b = function(arg0) {
        const ret = arg0.deltaY;
        return ret;
    };
    imports.wbg.__wbg_deltaZ_b97571bdbd5b1f94 = function(arg0) {
        const ret = arg0.deltaZ;
        return ret;
    };
    imports.wbg.__wbg_animationName_373ee5279a38d6c4 = function(arg0, arg1) {
        const ret = arg1.animationName;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_pseudoElement_a43e92ba10798dbb = function(arg0, arg1) {
        const ret = arg1.pseudoElement;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_elapsedTime_ce9cbdedf8c8d25c = function(arg0) {
        const ret = arg0.elapsedTime;
        return ret;
    };
    imports.wbg.__wbg_elapsedTime_01d0d0725a5f7dc5 = function(arg0) {
        const ret = arg0.elapsedTime;
        return ret;
    };
    imports.wbg.__wbg_propertyName_bb3e139b76cd9e44 = function(arg0, arg1) {
        const ret = arg1.propertyName;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_pseudoElement_d84b88790938481a = function(arg0, arg1) {
        const ret = arg1.pseudoElement;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbg_replaceState_ec9431bea5108a50 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.replaceState(arg1, getStringFromWasm0(arg2, arg3), arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5));
    }, arguments) };
    imports.wbg.__wbg_scrollX_911016e1eeb293ae = function() { return handleError(function (arg0) {
        const ret = arg0.scrollX;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollY_fb49613f84149dbb = function() { return handleError(function (arg0) {
        const ret = arg0.scrollY;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_saveTemplate_e7948f8b7f54cfc9 = function(arg0, arg1, arg2, arg3) {
        var v0 = getArrayJsValueFromWasm0(arg1, arg2).slice();
        wasm.__wbindgen_export_8(arg1, arg2 * 4, 4);
        arg0.saveTemplate(v0, arg3);
    };
    imports.wbg.__wbg_toggleAttribute_a88edae8f3db7837 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.toggleAttribute(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createElementNS_556a62fb298be5a2 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.createElementNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_appendChild_580ccb11a660db68 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.appendChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setAttributeInner_2820d9f570125088 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        setAttributeInner(arg0, getStringFromWasm0(arg1, arg2), arg3, arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5));
    };
    imports.wbg.__wbg_new_c44bca3b6f94b9dc = function(arg0) {
        const ret = new WebDioxusChannel(JSOwner.__wrap(arg0));
        return ret;
    };
    imports.wbg.__wbg_weak_cd28ee08d42a73ad = function(arg0) {
        const ret = arg0.weak();
        return ret;
    };
    imports.wbg.__wbg_newwithargs_33d0ffcb48344669 = function(arg0, arg1, arg2, arg3) {
        const ret = new Function(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbg_length_dee433d4c85c9387 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_rustSend_3b93da3cdc175722 = function(arg0, arg1) {
        arg0.rustSend(arg1);
    };
    imports.wbg.__wbg_rustRecv_1b6f5c2d10fa7141 = function(arg0) {
        const ret = arg0.rustRecv();
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_f7b04ef02296c4d2 = function(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_length_cd7af8117672b8b8 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_iterator_2cee6dadfd956dfa = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbg_entries_95cc2c823b285a09 = function(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbg_String_88810dfeb4021902 = function(arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_set_d4638f722068f043 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_new_d9bc3a0147634640 = function() {
        const ret = new Map();
        return ret;
    };
    imports.wbg.__wbg_set_8417257aaedc936b = function(arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbg_set_841ac57cff3d672b = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_instanceof_DragEvent_329fd02ae838527e = function(arg0) {
        let result;
        try {
            result = arg0 instanceof DragEvent;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_dataTransfer_cef7816623bd8478 = function(arg0) {
        const ret = arg0.dataTransfer;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_files_a2848a7a7424820f = function(arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_new_c1e4a76f0b5c28b8 = function() { return handleError(function () {
        const ret = new FileReader();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_readAsText_ac9afc9ae3f40e0a = function() { return handleError(function (arg0, arg1) {
        arg0.readAsText(arg1);
    }, arguments) };
    imports.wbg.__wbg_readAsArrayBuffer_4f4ed73c7dc0ce42 = function() { return handleError(function (arg0, arg1) {
        arg0.readAsArrayBuffer(arg1);
    }, arguments) };
    imports.wbg.__wbg_files_8b6e6eff43af0f6d = function(arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_type_4a48b5df975de6b2 = function(arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_value_47fe6384562f52ab = function(arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_checked_749a34774f2df2e3 = function(arg0) {
        const ret = arg0.checked;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlTextAreaElement_7963188e191245be = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLTextAreaElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_value_d7f5bfbd9302c14b = function(arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_value_47c64189244491be = function(arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_textContent_8e392d624539e731 = function(arg0, arg1) {
        const ret = arg1.textContent;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_instanceof_HtmlFormElement_ec8cd1ecba7bc422 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLFormElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_entries_ce844941d0c51880 = function(arg0) {
        const ret = arg0.entries();
        return ret;
    };
    imports.wbg.__wbg_getselectdata_d0a959dad128957f = function(arg0, arg1) {
        const ret = get_select_data(arg1);
        const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_instanceof_HtmlSelectElement_f0e1b0ac7b371ac0 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLSelectElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlInputElement_307512fe1252c849 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLInputElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Element_6945fc210db80ea9 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Element;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_document_5100775d18896c16 = function(arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_parentElement_347524db59fc2976 = function(arg0) {
        const ret = arg0.parentElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_bubbles_abce839854481bc6 = function(arg0) {
        const ret = arg0.bubbles;
        return ret;
    };
    imports.wbg.__wbg_preventDefault_b1a4aafc79409429 = function(arg0) {
        arg0.preventDefault();
    };
    imports.wbg.__wbg_getElementById_c369ff43f0db99cf = function(arg0, arg1, arg2) {
        const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_error_8e3928cfb8a43e2b = typeof console.error == 'function' ? console.error : notDefined('console.error');
    imports.wbg.__wbg_ownerDocument_a93c92720a050068 = function(arg0) {
        const ret = arg0.ownerDocument;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_new_0924b9f1bd6dd838 = function(arg0) {
        const ret = new RawInterpreter(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_initialize_ed565fb65dd7bcd0 = function(arg0, arg1, arg2) {
        arg0.initialize(arg1, arg2);
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbg_updatememory_0fc68f206c0463de = function(arg0, arg1) {
        arg0.update_memory(arg1);
    };
    imports.wbg.__wbg_run_47308773c14de567 = function(arg0) {
        arg0.run();
    };
    imports.wbg.__wbg_getNode_d4db5a1d3bc15eae = function(arg0, arg1) {
        const ret = arg0.getNode(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_subarray_a1f73cd4b5b42fe1 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_process_4a72847cc503995b = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_versions_f686565e586dd935 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_e9b4878cebadb3d3 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_error_71d6845bf00a930f = function(arg0, arg1) {
        var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
        wasm.__wbindgen_export_8(arg0, arg1 * 4, 4);
        console.error(...v0);
    };
    imports.wbg.__wbg_objectStoreNames_588b5924274239fd = function(arg0) {
        const ret = arg0.objectStoreNames;
        return ret;
    };
    imports.wbg.__wbg_length_9ae5daf9a690cba9 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_get_910bbb94abdcf488 = function(arg0, arg1, arg2) {
        const ret = arg1[arg2 >>> 0];
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_deleteObjectStore_1732efdd0f8a351d = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.deleteObjectStore(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_get_5361b64cac0d0826 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.get(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_delete_f60bba7d0ae59a4f = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.delete(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_transaction_b39e2665b40b6324 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.transaction(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_parse_66d1801634e099ac = function() { return handleError(function (arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setonabort_523135fd9168ae8b = function(arg0, arg1) {
        arg0.onabort = arg1;
    };
    imports.wbg.__wbg_setoncomplete_d8e4236665cbf1e2 = function(arg0, arg1) {
        arg0.oncomplete = arg1;
    };
    imports.wbg.__wbg_setonerror_da071ec94e148397 = function(arg0, arg1) {
        arg0.onerror = arg1;
    };
    imports.wbg.__wbg_setonerror_8479b33e7568a904 = function(arg0, arg1) {
        arg0.onerror = arg1;
    };
    imports.wbg.__wbg_setonsuccess_632ce0a1460455c2 = function(arg0, arg1) {
        arg0.onsuccess = arg1;
    };
    imports.wbg.__wbg_getAll_2782e438df699384 = function() { return handleError(function (arg0) {
        const ret = arg0.getAll();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_openCursor_2df5d7cb6c41ac04 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.openCursor(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        const ret = arg0 === null;
        return ret;
    };
    imports.wbg.__wbg_advance_e211280146391e9c = function() { return handleError(function (arg0, arg1) {
        arg0.advance(arg1 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_request_b703577b62f4f600 = function(arg0) {
        const ret = arg0.request;
        return ret;
    };
    imports.wbg.__wbg_version_7406e3f97ae69966 = function(arg0) {
        const ret = arg0.version;
        return ret;
    };
    imports.wbg.__wbg_close_6bfe4ca2fe67cb67 = function(arg0) {
        arg0.close();
    };
    imports.wbg.__wbg_instanceof_IdbRequest_93249da04f5370b6 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof IDBRequest;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_IdbOpenDbRequest_3f4a166bc0340578 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof IDBOpenDBRequest;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_IdbDatabase_db671cf2454a9542 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof IDBDatabase;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_IdbTransaction_e769fa98770b7597 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof IDBTransaction;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_error_968d41e74d6ecb20 = function(arg0) {
        const ret = arg0.error;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_instanceof_IdbCursorWithValue_abeb44d13d947bc2 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof IDBCursorWithValue;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_createObjectStore_f494613cd1a00d43 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.createObjectStore(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_objectStore_da468793bd9df17b = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.objectStore(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_key_7a534de95a1f5fbf = function() { return handleError(function (arg0) {
        const ret = arg0.key;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_value_86d3334f5075b232 = function() { return handleError(function (arg0) {
        const ret = arg0.value;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_open_a05198d687357536 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_open_f0d7259fd7e689ce = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2), arg3 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_put_0a0d7ca0f7fa8f83 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.put(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_put_22792e17580ca18b = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.put(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_add_a3b44bfbb3d40345 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.add(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_add_1dac52a28ed73a3a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.add(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_commit_386dbf9bf88312d5 = function() { return handleError(function (arg0) {
        arg0.commit();
    }, arguments) };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbg_call_27c0f87801dedf93 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_charCodeAt_f25c9f5afada5ccc = function(arg0, arg1) {
        const ret = arg0.charCodeAt(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_next_196c84450b364254 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_done_298b57d23c0fc80c = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_value_d93c65011f51a456 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_next_40fc327bfc8770e6 = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_get_e3c254076557e348 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_self_ce0dbfc45cf2f5be = function() { return handleError(function () {
        const ret = self.self;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_window_c6fb939a7f436783 = function() { return handleError(function () {
        const ret = window.window;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_globalThis_d1e6af4856ba331b = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_global_207b558942527489 = function() { return handleError(function () {
        const ret = global.global;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newnoargs_e258087cd0daa0ea = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_isArray_2ab64d95e09ea0ae = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_call_b3ca7c6051f9bec1 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_toString_c816a20ab859d0c1 = function(arg0) {
        const ret = arg0.toString();
        return ret;
    };
    imports.wbg.__wbg_has_0af94d20077affa2 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.has(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_1f9b04f170055d33 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stringify_8887fe74e1c50d81 = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_836825be07d4c9d2 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_read_e7d0f8a49be01d86 = function(arg0) {
        const ret = arg0.read();
        return ret;
    };
    imports.wbg.__wbg_done_2ffa852272310e47 = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_value_9f6eeb1e2aab8d96 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_fetch_38acb46318f7afdb = typeof fetch == 'function' ? fetch : notDefined('fetch');
    imports.wbg.__wbg_fetch_bc400efeda8ac0c8 = function(arg0, arg1, arg2) {
        const ret = arg0.fetch(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_body_9545a94f397829db = function(arg0) {
        const ret = arg0.body;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getReader_ab94afcb5cb7689a = function() { return handleError(function (arg0) {
        const ret = arg0.getReader();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_cancel_6ee33d4006737aef = function(arg0) {
        const ret = arg0.cancel();
        return ret;
    };
    imports.wbg.__wbg_catch_0260e338d10f79ae = function(arg0, arg1) {
        const ret = arg0.catch(arg1);
        return ret;
    };
    imports.wbg.__wbg_measure_aa7a73f17813f708 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        let deferred0_0;
        let deferred0_1;
        let deferred1_0;
        let deferred1_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            deferred1_0 = arg2;
            deferred1_1 = arg3;
            performance.measure(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        } finally {
            wasm.__wbindgen_export_8(deferred0_0, deferred0_1, 1);
            wasm.__wbindgen_export_8(deferred1_0, deferred1_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_mark_40e050a77cc39fea = function(arg0, arg1) {
        performance.mark(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_log_c9486ca5d8e2cbe8 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_export_8(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_log_aba5996d9bde071f = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
        } finally {
            wasm.__wbindgen_export_8(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_then_0c86a60e8fcfe9f6 = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_481971b0d87f3dd4 = typeof queueMicrotask == 'function' ? queueMicrotask : notDefined('queueMicrotask');
    imports.wbg.__wbg_then_a73caa9a87991566 = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_3cbae2ec6b6cd3d6 = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_resolve_b0083a7967828ec8 = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_close_a994f9425dab445c = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_enqueue_ea194723156c0cc2 = function() { return handleError(function (arg0, arg1) {
        arg0.enqueue(arg1);
    }, arguments) };
    imports.wbg.__wbg_byobRequest_72fca99f9c32c193 = function(arg0) {
        const ret = arg0.byobRequest;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_view_7f0ce470793a340f = function(arg0) {
        const ret = arg0.view;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_byteLength_58f7b4fab1919d44 = function(arg0) {
        const ret = arg0.byteLength;
        return ret;
    };
    imports.wbg.__wbg_close_184931724d961ccc = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_new_28c511d9baebfa89 = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_buffer_dd7f74bc60f1faab = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_byteOffset_81d60f7392524f62 = function(arg0) {
        const ret = arg0.byteOffset;
        return ret;
    };
    imports.wbg.__wbg_new_81740750da40724f = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_184(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_instanceof_Window_f401953a2cf86220 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_createElement_8bae7856a4bb7411 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createTextNode_0c38fd80a5b2284d = function(arg0, arg1, arg2) {
        const ret = arg0.createTextNode(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_getAttribute_99bddb29274b29b9 = function(arg0, arg1, arg2, arg3) {
        const ret = arg1.getAttribute(getStringFromWasm0(arg2, arg3));
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_scrollIntoView_eec424449e6c23da = function(arg0, arg1) {
        arg0.scrollIntoView(arg1);
    };
    imports.wbg.__wbg_type_c7f33162571befe7 = function(arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_target_2fc177e386c8b7b0 = function(arg0) {
        const ret = arg0.target;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_name_f35eb93a73d94973 = function(arg0, arg1) {
        const ret = arg1.name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_length_4db38705d5c8ba2f = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_item_4fa6fda18a501ce4 = function(arg0, arg1) {
        const ret = arg0.item(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_result_77ceeec1e3a16df7 = function() { return handleError(function (arg0) {
        const ret = arg0.result;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setonload_0af77109dbfaa065 = function(arg0, arg1) {
        arg0.onload = arg1;
    };
    imports.wbg.__wbg_new_ab6fd82b10560829 = function() { return handleError(function () {
        const ret = new Headers();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_append_7bfcb4937d1d5e29 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_result_6cedf5f78600a79c = function() { return handleError(function (arg0) {
        const ret = arg0.result;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_error_685b20024dc2d6ca = function() { return handleError(function (arg0) {
        const ret = arg0.error;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_screenX_71c325c2921184b8 = function(arg0) {
        const ret = arg0.screenX;
        return ret;
    };
    imports.wbg.__wbg_screenY_567b18347c9e21b9 = function(arg0) {
        const ret = arg0.screenY;
        return ret;
    };
    imports.wbg.__wbg_clientX_fef6bf7a6bcf41b8 = function(arg0) {
        const ret = arg0.clientX;
        return ret;
    };
    imports.wbg.__wbg_clientY_df42f8fceab3cef2 = function(arg0) {
        const ret = arg0.clientY;
        return ret;
    };
    imports.wbg.__wbg_offsetX_1a40c03298c0d8b6 = function(arg0) {
        const ret = arg0.offsetX;
        return ret;
    };
    imports.wbg.__wbg_offsetY_f75e8c25b9d9b679 = function(arg0) {
        const ret = arg0.offsetY;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_008695ce60a588f5 = function(arg0) {
        const ret = arg0.ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_1e76dbfcdd36a4b4 = function(arg0) {
        const ret = arg0.shiftKey;
        return ret;
    };
    imports.wbg.__wbg_altKey_07da841b54bd3ed6 = function(arg0) {
        const ret = arg0.altKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_86bfd3b0d3a8083f = function(arg0) {
        const ret = arg0.metaKey;
        return ret;
    };
    imports.wbg.__wbg_button_367cdc7303e3cf9b = function(arg0) {
        const ret = arg0.button;
        return ret;
    };
    imports.wbg.__wbg_buttons_d004fa75ac704227 = function(arg0) {
        const ret = arg0.buttons;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Node_daad148a35d38074 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Node;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_respond_b1a43b2e3a06d525 = function() { return handleError(function (arg0, arg1) {
        arg0.respond(arg1 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_releaseLock_5c49db976c08b864 = function(arg0) {
        arg0.releaseLock();
    };
    imports.wbg.__wbg_newwithstrandinit_3fd6fba4083ff2d0 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_cbca0027ab731230 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_pageX_41a880bc9f19ba9b = function(arg0) {
        const ret = arg0.pageX;
        return ret;
    };
    imports.wbg.__wbg_pageY_06396190627b7cd0 = function(arg0) {
        const ret = arg0.pageY;
        return ret;
    };
    imports.wbg.__wbg_history_bc4057de66a2015f = function() { return handleError(function (arg0) {
        const ret = arg0.history;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollTo_4d970c5e1c4b340b = function(arg0, arg1, arg2) {
        arg0.scrollTo(arg1, arg2);
    };
    imports.wbg.__wbindgen_closure_wrapper2809 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 351, __wbg_adapter_52);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper2817 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 337, __wbg_adapter_55);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper2858 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 351, __wbg_adapter_58);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper4039 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 351, __wbg_adapter_61);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper5141 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 595, __wbg_adapter_58);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper8742 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 1268, __wbg_adapter_58);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports['./snippets/dioxus-web-10186f9fcc0b4418/inline0.js'] = __wbg_star0;

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedBigInt64Memory0 = null;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;


    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
