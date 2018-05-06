import { readFileSync } from 'fs';

import { resolve } from 'path';

export class ConfigLoader {

  baseDirectory = __dirname;

  configFileName = "";

  config(): any {
    let configFile = "";
    try {
      configFile = readFileSync(resolve(this.baseDirectory, `./config/${this.configFileName}`), { encoding: "utf-8" });
    } catch (error) {
      console.error(`Error loading config file. Make sure you have created the '${this.configFileName}' under server/config`);
      return null;
    }

    if (configFile.length <= 0) {
      console.error("You may have provided an empty config.");
      return null;
    } else {

      let config: any;

      try {
        config = JSON.parse(configFile);
      } catch (error) {
        console.error(error);
        return null;
      }

      if (config instanceof Array) {
        return config[0];
      } else {
        // sometimes could be a single object
        return config;
      }
    }
  };

  setBasePath = () => {
    if (process.env.isTesting === 'yes') {
      this.baseDirectory = resolve(__dirname, "..");
    }
  };

  constructor(filename: string) {
    this.configFileName = filename;
    this.setBasePath();
  }

}
