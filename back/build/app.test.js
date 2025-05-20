"use strict";
const request = require("supertest");
const { app } = require("./app.js");
it("should return Hello Test", function (done) {
    request(app)
        .get("/")
        .expect("Hello Test")
        .end(done);
});
