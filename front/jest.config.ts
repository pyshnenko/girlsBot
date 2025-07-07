import type { Config } from "jest";
import { createJsWithTsPreset, type JestConfigWithTsJest } from "ts-jest";
import { TextEncoder, TextDecoder } from 'util';

const presetConfig = createJsWithTsPreset({});

/*module.exports = {
  testEnvironment: 'jest-fixed-jsdom',
}*/

module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
} as JestConfigWithTsJest;

//export default config;