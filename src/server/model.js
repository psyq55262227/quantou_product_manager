const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 连接数据库
mongoose
  .connect('mongodb://localhost/product', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => console.log('数据库连接成功'))
  .catch((err) => console.log(err));

// 创建产品模型
const Product = mongoose.model(
  'Product',
  new mongoose.Schema(
    {
      pid: {
        type: Number,
        required: true,
      },
      pname: {
        type: String,
        required: true,
      },
      intro: {
        type: String,
        required: true,
      },
      uid: {
        type: Number,
        required: true,
      },
      // 过审时间戳
      put_data: {
        type: Number,
        required: true,
      },
      pull_data: {
        type: Number,
      },
      // info: {
      //   type: Array,
      //   required: true,
      // },
      status: {
        type: Number, // 0 待审核 1 不通过 2 通过
        required: true,
      },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
  )
);
// 用户模型
const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      uid: {
        type: Number,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
        // select: false,
        // 每次设置pwd都要加密
        set(val) {
          const salt = bcrypt.genSaltSync(10);
          return bcrypt.hashSync(val, salt);
        },
      },
      // 是否为管理
      sign: {
        type: Boolean,
        // required: true,
      },
    },
    // todo的创建时间和修改时间
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
  )
);
const After = mongoose.model(
  'After',
  new mongoose.Schema(
    {
      aid: {
        type: Number,
        required: true,
        unique: true,
      },
      year: {
        type: String,
        required: true,
      },
      cost: {
        type: Number,
        required: true,
      },
      profit: {
        type: Number,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
      // 本年是否拿奖
      price: {
        type: Boolean,
        required: true,
      },
    },
    // todo的创建时间和修改时间
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
  )
);
const Score = mongoose.model(
  'Score',
  new mongoose.Schema(
    {
      sid: {
        type: Number,
        required: true,
        unique: true,
      },
      sc: {
        type: Number,
        required: true,
      },
      bid: {
        type: Number,
        required: true,
      },
      pid: {
        type: Number,
        required: true,
      },
    },
    // todo的创建时间和修改时间
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
  )
);

module.exports = { User, Product, Score, After };
