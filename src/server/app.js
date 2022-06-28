import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { User, Product, Score, After } from './model.js';
import { db } from './redis.js';
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 解决web跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// 鉴权
const auth = async (req, res, next) => {
  const token = String(req.headers.authorization).split(' ')[1];
  // 无token或token invalid都返回无效
  if (!token)
    return res.status(422).send({
      message: '无权限',
    });
  const { uid } = jwt.verify(token, jwtKey);
  if (!uid) {
    return res.status(422).send({
      message: 'token无效',
    });
  }
  const user = await User.findOne({ uid });
  // 如果不存在对应用户，也不予通过
  if (!user)
    return res.status(422).send({
      message: '用户不存在',
    });
  req.user = user;
  next();
};
// 注册
app.post('/signup', async (req, res) => {
  const { username, password, sign, uid } = req.body;
  const user = await User.findOne({
    username,
  });
  if (user) {
    return res.status(422).send({
      message: '用户已存在',
    });
  }
  // 创建用户
  User.create({
    uid,
    username,
    password,
    sign,
  });
  // 发放token
  const token = `Bearer ${jwt.sign(
    {
      uid: String(uid),
    },
    jwtKey
  )}`;
  return res.status(200).send({
    token,
  });
});
// 登录
app.post('/login', async (req, res) => {
  // 检查用户是否存在
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user) {
    return res.status(422).send({
      message: '用户不存在',
    });
  }
  // 翻译密码，检查密码是否正确
  const isPwdVaild = bcrypt.compareSync(req.body.pwd, user.pwd);
  if (!isPwdVaild) {
    return res.status(422).send({
      message: '密码错误',
    });
  }
  // 发放token
  const token = `Bearer ${jwt.sign(
    {
      uid: String(req.body.uid),
    },
    jwtKey
  )}`;
  res.send({
    token,
  });
});
// 获取产品
app.get('/product', auth, async (req, res) => {
  const { pid } = req.params;
  try {
    if (pid) {
      const product = await Product.findOne({ pid });
      if (product) return res.send(product);
      return res.status(422).send({
        message: '未找到该产品',
      });
    }
    return await Product.find();
  } catch (e) {
    return res.status(500).send({
      message: '服务出错',
    });
  }
});
// 添加产品
app.post('/product/add', auth, async (req, res) => {
  const { uid } = req.user;
  const { pid, pname, intro, info } = req.body;
  try {
    const product = await Product.create({
      pid,
      uid,
      pname,
      intro,
      put_data: -1,
      pull_data: -1,
      info,
      status: 0,
    });
    if (product) return res.send({ message: 'ok' });
    return res.status(500).send({
      message: '服务出错',
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: '服务出错',
    });
  }
});
// 上下架
app.post('/product/check', auth, async (req, res) => {
  const { sign } = req.user;
  if (!sign)
    return res.send(403).send({
      message: '您暂时没有访问该接口的权限',
    });
  const { pid, isPass } = req.body;
  try {
    const exist = await Product.findOne({ pid });
    const product = await Product.findOneAndUpdate(
      { pid },
      {
        status: isPass ? 2 : 1,
        put_data:
          isPass && exist.status !== 2 ? new Date().getTime() : exist.put_data,
        pull_data:
          !isPass && exist.status !== 1
            ? new Date().getTime()
            : exist.pull_data,
      }
    );
    console.log(product);
    if (product) {
      return res.send({ message: 'ok' });
    }
    return res.status(422).send({
      message: '不存在该产品或操作失败',
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: '服务出错',
    });
  }
});
// // 下架
// app.post('/product/off', auth, async (req, res) => {
//   const { sign } = req.user;
//   if (!sign)
//     return res.send(403).send({
//       message: '您暂时没有访问该接口的权限',
//     });
//   const { pid } = req.body;
//   try {
//     const product = await Product.findByIdAndUpdate({pid},{status:1,});
//     console.log(product);
//     if (product) {
//       return res.send({ message: 'ok' });
//     }
//     return res.status(422).send({
//       message: '不存在该产品或下架失败',
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).send({
//       message: '服务出错',
//     });
//   }
// });

server.listen(3001);
console.log('网站服务器启动成功');