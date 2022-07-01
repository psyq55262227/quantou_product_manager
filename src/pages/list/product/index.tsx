import { Card, Pagination, Descriptions, Empty, Radio } from '@arco-design/web-react'
import styles from './style/index.module.less'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGET } from '@/api'
import { getAverageInterestRate } from '@/utils/count'
import { Status } from '@/utils/status'
const ProductList = () => {
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isAll, setIsAll] = useState(true);

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
      setSelected(isAll ? list : list.filter(({ info }) => getAverageInterestRate(info) < 0.5))
    }
  }, [isAll, list])
  return (
    <>
      <RadioGroup
        type='button'
        defaultValue='all'
        style={{ marginRight: 20, marginBottom: 20 }}
      >
        <Radio value='all' onClick={() => setIsAll(true)}>全部</Radio>
        <Radio value='danger' onClick={() => setIsAll(false)}>风险产品</Radio>
      </RadioGroup>
      <section className={styles.box}>
        {
          selected.length === 0 ?
            <Card>
              <Empty />
            </Card>
            :
            <section className={styles.container}>
              {
                selected.slice((page - 1) * 6, page * 6).map(({ pid, pname, status, pull_data, put_data, intro, info }) => (
                  <Link key={pid} to={`/detail?pid=${pid}`} style={{ width: '100%', textDecoration: 'none' }}>
                    <Card
                      className={styles.card}
                      hoverable
                      bordered
                      title={pname}
                      extra={
                        <span style={{ color: Status[status].color }}>
                          {Status[status].text}
                        </span>
                      }
                    >
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
        <Pagination defaultPageSize={6} total={list.length} showJumper hideOnSinglePage onChange={page => setPage(page)} />
      </section >
    </>

  )
}
export default ProductList