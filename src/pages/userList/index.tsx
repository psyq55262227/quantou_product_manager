import { apiGET, apiPOST } from '@/api';
import { Table, TableColumnProps, Card, Button, Message } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react'

export default () => {
  const [tableData, setTableData] = useState();
  const getUserList = async () => {
    try {
      const { data } = await apiGET('/user/userList');
      console.log(data)
      setTableData(data.map(({ uid, username, sign, isJudge }) => ({ uid, username, identity: sign ? 2 : isJudge ? 1 : 0 })))
    } catch (e) {
      console.log(e)
    }
  }
  const handleChangeJudgeStatus = async (uid, isJudge) => {
    try {
      const { data } = await apiPOST('/user/status', { isJudge, uid });
      Message.success('设置评委成功')

      console.log(data)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getUserList();
  }, [])
  const columns: TableColumnProps[] = [
    {
      title: '用户id',
      dataIndex: 'uid'
    },
    {
      title: '昵称',
      dataIndex: 'username'
    }, {
      title: '身份',
      dataIndex: 'identity',
      render: (col, { identity }) => (
        <span>{identity === 2 ? '管理' : identity === 1 ? '评委' : '用户'}</span>
      )
    }, {
      title: '操作',
      render: (col, { identity, uid }) => (
        identity === 2 ? null :
          identity === 1 ?
            <Button type='primary' status="danger"
              onClick={() => handleChangeJudgeStatus(uid, false)}
            >取消评委资格
            </Button> :
            <Button type='primary'
              onClick={() => handleChangeJudgeStatus(uid, true)}
            >设为评委</Button>
      )
    }
  ]
  return (
    <Card>
      <Table columns={columns} data={tableData} />
    </Card>
  )
}