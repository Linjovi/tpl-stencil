import axios from "axios";
import { readConfig } from "./info";
import chalk from "chalk";

const instance = axios.create({
  timeout: 10000
});

instance.interceptors.request.use(
  (config:any) => {
    // do something before request is sent
    let yosoConfig = readConfig();
    if (yosoConfig.token) {
      config.headers.common["Authorization"] = `Token ${yosoConfig.token}`;
    }
    return config;
  },
  (error:any) => {
    // do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response:any) => {
    return response;
  },
  (error:any) => {
    if(!error.response || !error.response.status){
      console.log(
        chalk.red(`Network Error!`)
      );
      return Promise.reject(error);
    }
    switch (error.response.status) {
      case 401:
        console.log(
          chalk.red(`Unauthorized! Update your personal access token!`)
        );
        break;
      case 403:
        console.log(
          chalk.red(
            `Forbidden! Create a personal access token on github and config it!`
          )
        );
        break;
      case 404:
        console.log(
          chalk.red(
            `Not found! Check that your username, repo and branch are correct!`
          )
        );
        break;
      default:
        console.log(chalk.red(`network is error!`));
        break;
    }
    return Promise.reject(error);
  }
);

export default instance;
