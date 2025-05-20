const request = require("supertest");
  
const {app} = require("./app.js");
  
it("should return Hello Test", function(done: any){
      
    request(app)
        .get("/")
        .expect("Hello Test")
        .end(done);
});