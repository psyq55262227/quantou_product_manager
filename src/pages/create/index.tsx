import { Form, Input, Checkbox, Button, Card, Space, DatePicker, InputNumber } from "@arco-design/web-react"
import { IconDelete } from "@arco-design/web-react/icon";
import React, { useRef } from "react"
const FormItem = Form.Item;
const TextArea = Input.TextArea;

export default () => {
  const formRef = useRef();
  return (
    <Card>
      <Form
        layout="horizontal"
        ref={formRef}
        onValuesChange={(_, v) => {
          console.log(_, v);
        }}
      >
        <FormItem
          label='产品名' field='productname' rules={[{ required: true }]}>
          <Input placeholder='请输入产品名' />
        </FormItem>
        <FormItem label='产品图片地址' rules={[{ required: true }]}>
          <Input placeholder='请输入产品图片地址' defaultValue="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp" />
        </FormItem>
        <FormItem label='产品描述' rules={[{ required: true }]}>
          <Input placeholder='请输入产品描述' />
          {/* <TextArea allowClear placeholder='请输入产品描述' style={{ minHeight: 64, width: 350 }} autoSize /> */}
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
                              field={item.field + '.date'}
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
                            <Form.Item
                              field={item.field + '.price'}
                              rules={[{ required: true }]}
                              noStyle
                            >
                              <Checkbox>该年获奖</Checkbox>
                              {/* <InputNumber placeholder="请输入该年利润" suffix={'￥'} /> */}
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
          <Button type='primary' htmlType='submit'>
            提交产品信息
          </Button>
        </FormItem>
      </Form>
    </Card >
  )
}