const request = require("supertest");
const app = require("../../../app");
const jwt = require("jsonwebtoken");
const User = require("../../../models/Users");
const { Timestamp } = require("firebase-admin/firestore");

const mockUser = new User({
  userId: "1",
  email: "john@email.com",
  firstName: "firstName",
  lastName: "lastName",
  updatedAt: Timestamp.now().toDate(),
  createdAt: Timestamp.now().toDate(),
});

describe("generate-key controller", () =>{
  describe("Playload", () =>{

    beforeAll(() => {
      process.env.JWT_SECRET = "my_secret";
    });

    it ("Should return 422 response keyDescription format is invalid", async() =>{

      const mockToken = mockUser.generateJWT();
      const response = await request(app)
        .post("/api/keys/generate")
        .set("cookie", `jwt=${mockToken}`)
        .send({
          "payload": {
            "keyDescription": "containingNumbers12345"
          },
        });
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        message: "keyDescription must contain only alphabets",
        statusCode: 422,
        error: "Unprocessable payload",
      });
    });
  });

  it("Should return 422 response if keyId format is invalid", async () => {
    const mockToken = mockUser.generateJWT();
    const response = await request(app)
      .delete("/api/keys/destroy")
      .query({ keyId: "90" }) 
      .set("cookie", `jwt=${mockToken}`);
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: "\"keyId\" must be a valid UUID",
      statusCode: 422,
      error: "Unprocessable payload",
    });
  });

  it("Should return 422 response if keyId format is invalid", async () => {
    const mockToken = mockUser.generateJWT();
    console.log(mockToken);
    const response = await request(app)
      .delete("/api/keys/destroy")
      .query({ keyId: 90 }) 
      .set("cookie", `jwt=${mockToken}`);
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: "\"keyId\" must be a valid UUID",
      statusCode: 422,
      error: "Unprocessable payload",
    });
  });
  
});