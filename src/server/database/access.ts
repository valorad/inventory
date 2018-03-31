import * as mongoose from "mongoose";

(<any>mongoose).Promise = global.Promise;

class Access {
  static connectDB = async (config: any) => {
    const uri = `mongodb://${ config.user }:${ config.password }@${ config.host }:${ config.port }/${ config.db }?authSource=${ config.authDB }`;
    
    try {
      let mongooseInstance = mongoose.connect(uri);
      mongoose.connection
        .on('close', () => {
          console.log(`Connection to ${ config.db } has been closed.`);
        })
        .once('open', () => {
          console.log(`Connection to ${ config.db } established successfully.`);
          return mongooseInstance;
        });

    } catch (error) {
      console.warn(`Warning! Failed to connect to database '${config.db}'!`);
    }
    
  };
}

export const connectDB = Access.connectDB;