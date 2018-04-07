import { DataBase } from "../database";
import { connection, Mongoose } from 'mongoose';

//tests
import { actorSpec } from "./actor.spec";

process.env.isTesting = 'yes';

let mongoInstance: Mongoose | null;

beforeAll(async () => {
  let db = new DataBase();
  mongoInstance = await db.connect();
});

// activating tests
actorSpec; 

afterAll(async () => {
  if (mongoInstance) {
    await mongoInstance.connection.dropDatabase();
  }
});