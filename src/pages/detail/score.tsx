import { Button, Modal, Rate, Space } from "@arco-design/web-react";
import React, { useState } from "react"

export default ({ desc, score, setScore, onConfirm }) => {
  // 控制模态框显示与隐藏的切换
  const [visible, setVisible] = useState(false);

  // 监听评委分数的改变，并且传递到父组件的score中进行保存
  const handleScoreChange = (i, e) => {
    setScore(state => {
      const temp = state;
      temp[i] = e;
      return temp;
    })
  }
  return (
    <div>
      <Button onClick={() => setVisible(true)} type='primary'>
        评分
      </Button>
      <Modal
        title='为产品打分'
        visible={visible}
        // 调用父组件提供的onConfirm方法后，将模态框设置为不可见
        onOk={() => { onConfirm(); setVisible(false) }}
        onCancel={() => setVisible(false)}
      >
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {
            desc.map((item, i) => (
              <Space key={i} size="medium">
                <span>{item}</span>
                <Rate grading key={i} defaultValue={score && score.length > 0 ? score[i] : 0} onChange={(e) => handleScoreChange(i, e)} />
              </Space>
            ))
          }
        </section>
      </Modal>
    </div>
  )
}