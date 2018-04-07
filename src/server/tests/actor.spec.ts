import { DataBase } from "../database";
import { connection } from 'mongoose';

process.env.isTesting = 'yes';

test("connect to test DB", async () => {
  let db = new DataBase();
  let mongoInstance = await db.connect();
  expect(mongoInstance).toBeTruthy();
});