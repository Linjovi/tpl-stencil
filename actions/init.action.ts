import { NewCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import * as fs from "fs";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { requestUrl } from "../utils/download";
import * as inquirer from "inquirer";
import { isRewrite, readConfig, formatDate } from "../utils/utils";
import { getGitInfo } from "../utils/info";
import { optionView } from "../ui/optionInput";

var filePath = path.dirname(__dirname); //yoso根目录

export class InitAction extends AbstractAction {
  public async handle(inputs: NewCmd) {
    isRewrite(inputs.path, function() {
      initTpl(inputs);
    });
  }
}

function initTpl(inputs: NewCmd) {
  var config = readConfig();

  var data = {
    username: inputs.options.username || config.username,
    repos: inputs.options.repos || config.repos,
    branch: inputs.options.branch || config.branch || "master",
    download: inputs.tpl,
    path: inputs.path || inputs.tpl
  };

  var name = path.basename(inputs.path);
  const gitInfo = getGitInfo();

  var options: { [k: string]: any } = { name, date: formatDate(new Date()) };

  if (gitInfo.name) {
    options.author = gitInfo.name;
  }
  if (gitInfo.email) {
    options.email = gitInfo.email;
  }

  if (inputs.options.others) {
    optionView(options, (list: any) => {
      list.forEach((element: any) => {
        options[element.key] = element.value;
      });
      console.log(options);
      requestUrl(data.username, data.repos, data.branch, data.download, data.path,options);
    });
    return;
  }

  requestUrl(data.username, data.repos, data.branch, data.download, data.path,options);
}
