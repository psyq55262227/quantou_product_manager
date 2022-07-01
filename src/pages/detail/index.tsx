import { apiGET, apiPOST } from "@/api";
import AuthWrap from "@/components/AuthWrap";
import OverviewAreaLine from "@/components/Chart/overview-area-line";
import { getAverage, getAverageInterestRate } from "@/utils/count";
import { Status } from "@/utils/status";
import { Card, Skeleton, Descriptions, Button, Message, Rate, Space } from "@arco-design/web-react"
import React, { useEffect, useState } from "react"
import { useLocation, Link } from 'react-router-dom'
import DetailTable from "./table";
import { IconLeft } from "@arco-design/web-react/icon";
import { GlobalState } from "@/store";
import { useSelector } from "react-redux";

interface IItem {
  label: string;
  value: any;
}
export default () => {
  const location = useLocation();
  const [pid, setPid] = useState();
  const [data, setData] = useState();
  const [tableData, setTableData] = useState<IItem[]>();
  const [score, setScore] = useState(0);
  const [chartData, setChartData] = useState();
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state: GlobalState) => state.userInfo);
  const getParams = () => {
    const map = new Map();
    // location.search截取当前url参数，如?id=1&name=admin，则此处先slice(1)截去开头的问号，根据&将字符串分割成若干字符串数组，如['id=1','name=admin']，再遍历数据将数据根据'='分割成{'id',1}的形式，用map哈希表存储，如此之后map.get(key)根据key名id即可获取id对应的参数
    location.search.slice(1).split('&').map((item) => {
      const [k, v] = item.split('=');
      map.set(k, v)
    });
    const pid = map.get('pid')
    setPid(pid)
    return pid;
  }
  const getDetail = async () => {
    const pid = getParams();
    setLoading(true)
    try {
      console.log('pid', pid)
      const { data } = await apiGET('/product', { pid })
      console.log(data)
      setData(data)
      getDefaultScore(data.score)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }
  const getTableData = (data) => {
    const { intro, pull_data, put_data, status, info, price, score } = data;
    setTableData([{
      label: '介绍',
      value: intro
    }, {
      label: '过审日期',
      value: pull_data === -1 ? '暂未过审' : new Date(pull_data).toLocaleDateString()
    }, {
      label: '下架日期',
      value: put_data === -1 ? '暂未下架' : new Date(put_data).toLocaleDateString()
    },
    {
      label: '获奖情况',
      value: price ? '已获奖' : '未获奖'
    },
    {
      label: '状态',
      value: Status[status].text
    }, {
      label: '平均年利率',
      value: getAverageInterestRate(info).toFixed(2) + '%'
    }, {
      label: '平均评分',
      value: score.length === 0 ? '暂无评分' : getAverage(score.map(({ sc }) => sc)) + '/5'
    }])
  }
  const getChartData = (data) => {
    setChartData(data.info.map(({ year, rate }) => ({ year, rate })))
  }
  const getDefaultScore = (data) => {
    const { sc } = data.find(({ bid }) => bid === userInfo.uid)
    console.log
    setScore(sc)
  }
  const handleChangeStatus = async (status) => {
    try {
      await apiPOST('/product/check', { pid, isPass: status });
      getDetail()
    } catch (e) {
      console.log(e);
    }
  }
  const handleChangePrice = async (price) => {
    try {
      await apiPOST('/product/price', { pid, price })
      getDetail();
      Message.success('获奖情况更新成功！')
    } catch (e) {
      console.log(e)
    }
  }
  const handleChangeScore = async (sc) => {
    setScore(sc)
    try {
      await apiPOST('/product/score', { pid, sc });
      getDetail();
      Message.success('评分成功！')
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getDetail();
  }, [])
  // 当data发生改变时，向后端请求data
  useEffect(() => {
    if (data) {
      getTableData(data);
      getChartData(data);
    }
  }, [data])
  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Link to="/list/product" style={{ textDecoration: 'none', color: 'gray' }}>
        <Space>
          <IconLeft />
          <span>返回列表</span>
        </Space>
      </Link>
      <Card
        style={{ width: '100%', paddingTop: '16px' }}
        extra={
          <AuthWrap>
            <Space>
              {
                data && (data.price ?
                  <Button
                    status="danger"
                    onClick={() => handleChangePrice(false)}
                    type="primary"
                  >取消奖项</Button> :
                  <Button
                    type="primary"
                    onClick={() => handleChangePrice(true)}
                  >颁发奖项</Button>)
              }
              {
                data && data.status !== 2 &&
                <Button
                  type="outline"
                  onClick={() => handleChangeStatus(true)}
                >审批通过</Button>
              }
              {
                data && data.status !== 1 &&
                <Button
                  type='outline'
                  status='danger'
                  onClick={() => handleChangeStatus(false)}
                >下架产品</Button>
              }
            </Space>
          </AuthWrap>
        }
        title={
          <Skeleton
            animation
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 4,
            }}
            loading={loading}
            text={{ rows: 1, width: '40%' }}
          >
            <Space>
              <h2>{data ? data.pname : ''}</h2>
              <AuthWrap role='judge'>
                <Rate grading allowHalf onChange={(sc) => handleChangeScore(sc)} defaultValue={score} />
              </AuthWrap>
            </Space>
          </Skeleton>
        }
      >
        <Skeleton
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 4,
          }}
          loading={loading}
          text={{ rows: 10, width: '70%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Descriptions data={tableData} layout='inline-vertical' />
            {
              chartData && chartData.length > 1 && <OverviewAreaLine data={chartData} loading={loading} />
            }
            <DetailTable data={data ? data.info : []} />
          </Space>
        </Skeleton>
      </Card>
    </Space>
  )
}