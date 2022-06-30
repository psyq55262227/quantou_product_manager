## 后端启动

**前置准备**

- 安装 node.js 环境
- 安装 mongodb compass
- 安装 mongo 环境
- 安装 nodemon

进入 server 文件夹，命令行输入`nodemon app.js`
若输出`数据库连接成功`，证明服务已正常运行

## 前端启动

在项目根目录下运行如下命令行

```
// 初始化项目依赖
yarn

// 开发环境下启动项目
yarn dev

```

见控制台输出` vite v2.6.14 dev server running at:Local: http://localhost:3000`，即服务已正常运行于本地 3000 端口，此时访问 3000 端口即可预览前端页面
