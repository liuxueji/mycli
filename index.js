#!/usr/bin/env node
 // 引入
const download = require('download-git-repo')
const inquirer = require('inquirer')
const handlebars = require('handlebars')
const fs = require("fs");
const {
  Command
} = require('commander');
const program = new Command();


// 存储模板地址
const templates = {
  "vue2-cli": {
    // 仓库地址
    url: "https://github.com/liuxueji/vue2-cli.git",
    // 仓库下载地址，格式为：仓库地址:用户名/仓库名#分支名
    downloadUrl: "http://github.com:liuxueji/vue2-cli#master",
    description: "Webpack5 + Vue2模板",
  },
};

// init 命令
program
  // 定义命令：.command(命令名，[参数])
  // []：表示可选参数
  // <>：表示必填参数
  .command("init <templateName> <projectName>")
  // 命令执行回调
  .action((templateName, projectName) => {
    // 使用 download-git-repo 下载模板
    // download 第一个参数：仓库地址；第二个参数：下载路径
    const {
      downloadUrl
    } = templates[templateName];
    download(downloadUrl, projectName, {
      clone: true
    }, err => {
      if (err) return console.log("模板创建失败");
      inquirer
        .prompt([{
            // 输入类型
            type: "input",
            // 字段名称
            name: "name",
            // 提示信息
            message: "请输入项目名称"
          },
          {
            // 输入类型
            type: "input",
            name: "description",
            message: "请输入项目简介"
          },
          {
            type: "input",
            name: "author",
            message: "请输入作者名称"
          }
        ])
        // 获取输入结果
        .then(answers => {
          // 把采集到的用户数据解析替换到 package.json 文件中
          // 保存下载下来的模板 package.json 配置文件路径
          const packagePath = `${projectName}/package.json`;
          // 使用 fs 获取下载到的模板中额 package.json 配置文件
          const packageContent = fs.readFileSync(packagePath, "utf8");
          // 使用 handlebars 编译这个文件为渲染函数
          const packageResult = handlebars.compile(packageContent)(answers);
          // 将修改后配置写入下载下来的模板中
          fs.writeFileSync(packagePath, packageResult);
          console.log("初始化模板成功！");
        });
    });
  });

// list 命令
program
  .command("list")
  .description("查看所有可用模板")
  .action(() => {
    // 遍历模板数组
    for (let i in templates) {
      console.log(`模板名称：${i}`);
      console.log(`模板URL：${templates[i].url}`);
      console.log(`模板介绍：${templates[i].description}`);
    }
  });


program.parse(process.argv);