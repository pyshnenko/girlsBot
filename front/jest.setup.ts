import { TextEncoder, TextDecoder } from 'util';
/*
// Polyfill for TextEncoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof window.TextEncoder === 'undefined') {
  window.TextEncoder = global.TextEncoder;
}

// Polyfill for TextDecoder
if (typeof global.TextDecoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.TextDecoder = TextDecoder;
}
if (typeof window.TextDecoder === 'undefined') {
  window.TextDecoder = global.TextDecoder;
}
*/
global.TextDecoder = require('util').TextDecoder;
console.log('Polyfill for TextEncoder/TextDecoder loaded.');