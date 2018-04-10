import { DataBase } from "../database";
import { connection, Mongoose } from 'mongoose';

//tests
import { actorSpec } from "./actor.spec";
import { refItemSpec } from "./ref-item.spec"
import { inventorySpec } from "./inventory.spec"

process.env.isTesting = 'yes';

let mongoInstance: Mongoose | null;

beforeAll(async () => {
  let db = new DataBase();
  mongoInstance = await db.connect();
});

// activated tests
// actorSpec;
// refItemSpec;
inventorySpec;

afterAll(async () => {
  if (mongoInstance) {
    await mongoInstance.connection.dropDatabase();
  }
});