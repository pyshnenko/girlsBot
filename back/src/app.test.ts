import * as dotenv from 'dotenv';
dotenv.config();
import request from "supertest";
  
import app from "./api";

it("test basic function", function(done: any){
      
    request(app)
        .get("/girls/api/startCheck")
        .expect(200)
        .end(done);
});

describe("database test", ()=>{

    it("test connection to sql", function(done: any){

        request(app)
            .get("/girls/api/sqlCheck")
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${String(process.env.ADMIN)}`)
            .expect(200)
            .end(done)
    });
    
    it("test non-auth connection to sql", function(done: any){

        request(app)
            .get("/girls/api/sqlCheck")
            .expect(401)
            .end(done)
    });

})
  
