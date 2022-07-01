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

见控制台输出` vite v2.6.14 dev server running at:Local: http://localhost:3000`，即服务已正常运行于本地 3000 端口，此时访问 3000 端口即可预览前端

### 组织架构

- api
  封装请求
- assets
  静态资源文件
- components
  组件
- locale
  国际化语言包。在本项目里无用，但因为 arco 模板糅合该语言包较严重所以没做删除处理（
- pages
  页面文件
- store
  状态管理的全局 store
- style
  样式文件
- utils
  工具包

### store 管理相关

store 相关配置见 `store`文件夹

目前利用 store 存放个人信息，如`uid`（用户 id）/ `sign`（是否为管理） / `isJudge`（是否为评委）/ `permission`（路由访问权限）

```react
// 设置store内容。type指定操作，payload指定函数负载
store.dispatch({
  type: 'update-userInfo',
  payload: { userInfo: { ...data, permissions: generatePermission(data.sign ? 'admin' : 'user'), } },
});
// 调用
const userInfo = useSelector((state: GlobalState) => state.userInfo);
```

其中，`permissions`会设置各不同角色对路由的访问权限。`generatePermission`会根据传入参数，为当前用户设置不同路由访问权限。当传入参数为`admin`时，具有所有路由的访问权限。

> 注意：`utils/useStorage.ts`下暴露的`useStorage`只和`localstorage`的存取有关，而与此处利用 `react-redux` 管理的 `store`无关

### 路由相关

路由设置见：`routes.ts`

首页布局见：`layout.tsx`

页面之间的跳转借助于`react-router-dom`提供的`useHistory`方法

若想为某路由设置权限，可在`routes.ts`中为该路由单独设置 `requiredPermissions`

```react
export const routes: Route[] = [
  {
    name: '用户列表',
    key: 'list/user',
    // 在此处加权限
    requiredPermissions: [{ resource: '用户列表', actions: ['*'] }],
  },
]

```

### token 相关

token 是一种鉴定身份的令牌，本项目中由后端 jwt 生成。若后端鉴定前端发送的请求通过了身份验证，则会根据用户某个特殊的属性（比如 uid）生成 token，再将 token 发放给前端，由前端存储在浏览器的`localstorage`，并将 token 放置在前端请求头中，每次向后端发送请求时都会带上 token，由后端对 token 进行解码，并从 token 中获取生成 token 时所用的特殊属性，由该特殊属性锁定发送的用户是谁，达到鉴权的效果

在项目中，使用`utils/token.ts`封装存取 token 的方法

### 请求相关

request 请求封装于`utils/request`，在`api`文件中进行了 get 方法和 post 方法的再封装

调用形如：`await apiPOST('/product/check', { pid: getParams(), isPass: status });`，搭配 try catch 实现错误捕获

### React 语法相关

`useState`，可以类比 vue 中的 data。是一种维护本组件中会动态变化的值的方法。该方法返回的两个值中，第一个值是变量本身，第二个值是设置该变量的方法

`useEffect`，是一种监听变化的方法。当最后一个参数[]中有变量时，变量变化时执行`useEffect`中的方法；无变量时则仅页面挂载时被调用
