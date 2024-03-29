import { Card, Pagination, Descriptions, Empty, Radio, Input } from '@arco-design/web-react'
import styles from './style/index.module.less'
import React, { useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGET } from '@/api'
import { getAverageInterestRate } from '@/utils/count'
import { Status } from '@/utils/status'
const ProductList = () => {
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [keyWord, setKeyWord] = useState('');
  const [radioValue, setRadioValue] = useState(0);
  const radioOption = [
    '全部', '拳头产品', '风险产品', '待审产品', '下架产品'
  ]
  const [selected, dispatch] = useReducer((state, { type }) => {
    setRadioValue(type)
    switch (type) {
      // 0 1 2 3 等，对应radioOption数组下标
      case 0:
        // 返回全部产品
        return list;
      case 1:
        // 返回拳头产品
        return list.filter(({ status }) => status === 2)
      case 2:
        // 返回风险产品
        return list.filter(({ info }) => getAverageInterestRate(info) < 0.5)
      case 3:
        // 返回待审核的产品
        return list.filter(({ status }) => status === 0)
      case 4:
        // 返回下架的产品
        return list.filter(({ status }) => status === 1)
      default:
        // 保持原样
        return state;
    }
    // 初始值是list
  }, list ?? [])

  const RadioGroup = Radio.Group;

  const getProductList = async () => {
    try {
      const { data } = await apiGET('/product');
      setList(data);
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getProductList()
  }, [])
  useEffect(() => {
    if (list) {
      dispatch({ type: radioValue })
    }
  }, [list])
  return (
    <>
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <RadioGroup
          type='button'
          defaultValue={0}
          style={{ marginRight: 20, marginBottom: 20 }}
        >
          {
            radioOption.map((item, i) => (<Radio key={i} value={i} onClick={() => dispatch({ type: i })}>{item}</Radio>))
          }
        </RadioGroup>
        <Input size="small" onChange={(e) => setKeyWord(e)} style={{ width: 350 }} allowClear placeholder='请输入产品名称' />
      </section>

      <section className={styles.box}>
        {
          // 若搜索后的结果长度为0
          selected.filter(({ pname }) => pname.indexOf(keyWord) !== -1).length === 0 ?
            <Card>
              <Empty />
            </Card>
            :
            <section className={styles.container}>
              {
                // filter(({ pname }) => pname.indexOf(keyWord) !== -1)，根据关键词keyWord对产品进行查找
                selected.filter(({ pname }) => pname.indexOf(keyWord) !== -1).slice((page - 1) * 6, page * 6).map(({ pid, pname, status, pull_data, put_data, intro, info }) => (
                  <Link key={pid} to={`/detail?pid=${pid}`} style={{ width: '100%', textDecoration: 'none' }}>
                    <Card
                      className={styles.card}
                      hoverable
                      bordered
                      title={<h3>{pname}</h3>}
                      extra={
                        <span style={{ color: Status[status].color }}>
                          {Status[status].text}
                        </span>
                      }
                    >
                      {/* 上方的数值概况描述部分 */}
                      <Descriptions
                        column={1}
                        labelStyle={{ paddingRight: 36 }}
                        data={
                          [
                            {
                              label: '描述',
                              value: intro
                            },
                            {
                              label: '平均年利率',
                              value: info.length === 0 ? '暂无数据' : getAverageInterestRate(info).toFixed(2) + '%'
                            },
                            {
                              label: '过审日期',
                              value: pull_data === -1 ? '暂未通过' : new Date(pull_data).toLocaleDateString()
                            },
                            {
                              label: '下架日期',
                              value: put_data === -1 ? '暂未下架' : new Date(put_data).toLocaleDateString()
                            }
                          ]}
                      />
                    </Card>
                  </Link>
                ))
              }
            </section >
        }
        {/* 分页组件，属性含义参见arco文档中的Pagination组件 */}
        <Pagination defaultPageSize={6} total={list.length} showJumper hideOnSinglePage onChange={page => setPage(page)} />
      </section >
    </>

  )
}
export default ProductList