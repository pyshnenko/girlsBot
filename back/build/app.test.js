"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const supertest_1 = __importDefault(require("supertest"));
const api_1 = __importDefault(require("./api"));
it("test basic function", function (done) {
    (0, supertest_1.default)(api_1.default)
        .get("/girls/api/startCheck")
        .expect(200)
        .end(done);
});
describe("database test", () => {
    it("test connection to sql", function (done) {
        (0, supertest_1.default)(api_1.default)
            .get("/girls/api/sqlCheck")
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${String(process.env.ADMIN)}`)
            .expect(200)
            .end(done);
    });
    it("test non-auth connection to sql", function (done) {
        (0, supertest_1.default)(api_1.default)
            .get("/girls/api/sqlCheck")
            .expect(401)
            .end(done);
    });
});
