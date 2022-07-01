import { apiPOST } from "@/api";
import { Form, Input, Checkbox, Button, Card, Space, DatePicker, InputNumber, Message } from "@arco-design/web-react"
import { IconDelete } from "@arco-design/web-react/icon";
import React, { useRef, useState } from "react"
import { useHistory } from 'react-router-dom'
const FormItem = Form.Item;
// const TextArea = Input.TextArea;

export default () => {
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const [form] = Form.useForm();
  const history = useHistory();
  const handleCreateProduct = async () => {
    try {
      console.log(formData)
      const { info } = formData;
      const yearMap = new Map();
      if (!info) return Message.error('请填写完整信息')
      for (let i = 0; i < info.length; i++) {
        const { year, cost, profit } = info[i];
        if (!year || !cost || !profit) return Message.error('请填写完整信息')
        if (yearMap.has(year)) return Message.error('年利率信息请勿重复填写年份')
        yearMap.set(year, year)
      }
      await apiPOST('/product/add', formData);
      Message.success('创建产品成功')
      form.clearFields();
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <Card>
      <Form
        layout="horizontal"
        ref={formRef}
        form={form}
        onValuesChange={(_, v) => {
          setFormData(v);
        }}
      >
        <FormItem
          label='产品名' field='pname' rules={[{ required: true }]}>
          <Input placeholder='请输入产品名' />
        </FormItem>
        <FormItem label='产品描述' field="intro" rules={[{ required: true }]}>
          <Input placeholder='请输入产品描述' />
        </FormItem>
        <FormItem label="产品年利率信息">
          <Form.List field='info'>
            {(fields, { add, remove, move }) => {
              return (
                <div>
                  {fields.map((item, index) => {
                    return (
                      <div key={item.key}>
                        <Form.Item label={'年利率信息 ' + (index + 1)} rules={[{ required: true }]}>
                          <Space>
                            <Form.Item
                              field={item.field + '.year'}
                              rules={[{ required: true }]}
                              noStyle
                            >
                              <DatePicker.YearPicker placeholder='请输入年份' />
                            </Form.Item>
                            <Form.Item
                              field={item.field + '.cost'}
                              rules={[{ required: true }]}
                              noStyle
                            >
                              <InputNumber placeholder="请输入该年成本" min={0} suffix={'￥'} />
                            </Form.Item>
                            <Form.Item
                              field={item.field + '.profit'}
                              rules={[{ required: true }]}
                              noStyle
                            >
                              <InputNumber placeholder="请输入该年利润" suffix={'￥'} />
                            </Form.Item>
                            <Button
                              icon={<IconDelete />}
                              shape='circle'
                              status='danger'
                              onClick={() => remove(index)}
                            ></Button>
                          </Space>
                        </Form.Item>
                      </div>
                    );
                  })}
                  <Form.Item>
                    <Button
                      onClick={() => {
                        add();
                      }}
                    >
                      添加信息
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </FormItem>
        <FormItem
          wrapperCol={{
            offset: 5,
          }}
        >
          <Button type='primary' htmlType='submit' onClick={() => handleCreateProduct()}>
            提交产品信息
          </Button>
        </FormItem>
      </Form>
    </Card >
  )
}