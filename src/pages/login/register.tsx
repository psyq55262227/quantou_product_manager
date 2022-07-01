import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Modal, Form, Input, Select, Message } from '@arco-design/web-react';
import { apiPOST } from '@/api';
import { setToken } from '@/utils/token';
const FormItem = Form.Item;

export default ({ visible, setVisible }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();

  const onOk = async () => {
    form.validate().then(async (res) => {
      setConfirmLoading(true);
      try {
        const { data: { token } } = await apiPOST('/signup', { ...res, sign: false });
        if (!token) {
          return Message.error({
            content: '注册失败~请稍后重试'
          })
        }
        setToken(token)
        Message.success({
          content: '注册成功！'
        })
        history.push('/')
      } catch (e) {
        console.log(e)
      }
      setConfirmLoading(false);
    });
  }

  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
  return (
    <Modal
      title='注册'
      visible={visible}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={() => setVisible(false)}
    >
      <Form
        {...formItemLayout}
        form={form}
        labelCol={{
          style: { flexBasis: 90 },
        }}
        wrapperCol={{
          style: { flexBasis: 'calc(100% - 90px)' },
        }}
      >
        <FormItem label='昵称' field='username' rules={[{ required: true }]}>
          <Input placeholder='' />
        </FormItem>
        <FormItem label='密码' required field='password' rules={[{ required: true }]}>
          <Input.Password placeholder='' onPressEnter={() => onOk()} />
        </FormItem>
      </Form>
    </Modal >
  )
}