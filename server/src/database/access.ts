import * as mongoose from "mongoose";

interface IAccessConfig {
  user: string,
  password: string,
  host: string,
  port: number,
  db: {
    auth: string,
    apply: string
  }
}

class Access {
  static connectDB = async (config: IAccessConfig) => {
    const uri = `mongodb://${ config.user }:${ config.password }@${ config.host }:${ config.port }/${ config.db.apply }?authSource=${ config.db.auth }`;
    
    try {
      let mongooseInstance = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: false
      })

      console.log(`Connection to '${ config.db.apply }' established successfully.`);
      return mongooseInstance;

    } catch (error) {
      console.warn(`  Warning! Failed to connect to database '${config.db.apply}'!\n  -->Error: ${error.message}`);
      return null;
    }
    
  };
}

export const connectDB = Access.connectDB;