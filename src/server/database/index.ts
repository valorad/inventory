
import { connectDB } from './access';
import { ConfigLoader } from "../util";

export class DataBase {

  config = new ConfigLoader("inventory.json").config();
  
  main = async () => {
    await connectDB(this.config.mongo);
  };

  constructor() {
    this.main();
  }
}