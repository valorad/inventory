
import { connectDB } from './access';
import { ConfigLoader } from "../util/config-loader";

export class DataBase {

  config = new ConfigLoader("inventory.json").config();
  
  main = async () => {
    await connectDB(this.config.mongo);
  };

  constructor() {
    this.main();
  }
}