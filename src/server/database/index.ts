
import { connectDB } from './access';
import { ConfigLoader } from "../util";

export class DataBase {

  siteConfig = new ConfigLoader("inventory.json").config();

  dbConfig = {
    ...this.siteConfig.mongo,
    db: {
      auth: this.siteConfig.mongo.db.auth,
      apply: this.siteConfig.mongo.db.main
    }
  }

  connect = async () => {
    if (process.env.isTesting === 'yes') {
      this.dbConfig.db.apply = this.siteConfig.mongo.db.test;
    }
    return await connectDB(this.dbConfig);
  };

}