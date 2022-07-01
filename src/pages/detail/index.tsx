import { apiGET, apiPOST } from "@/api";
import AuthWrap from "@/components/AuthWrap";
import OverviewAreaLine from "@/components/Chart/overview-area-line";
import { getAverageInterestRate } from "@/utils/count";
import { Status } from "@/utils/status";
import { Card, Skeleton, Descriptions, Button } from "@arco-design/web-react"
import React, { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom'
import DetailTable from "./table";
import { IconDown } from "@arco-design/web-react/icon";

interface IItem {
  label: string;
  value: any;
}
export default () => {
  const location = useLocation();
  const [data, setData] = useState();
  const [tableData, setTableData] = useState<IItem[]>();
  const [chartData, setChartData] = useState();
  const [loading, setLoading] = useState(true);
  const ButtonGroup = Button.Group;
  const getParams = () => {
    const map = new Map();
    // location.search截取当前url参数，如?id=1&name=admin，则此处先slice(1)截取开头的问号，根据&将字符串分割成若干字符串数组，如['id=1','name=admin']，再遍历数据将数据根据'='分割成{'id',1}的形式，用map哈希表存储，如此之后map.get(key)根据key名id即可获取id对应的参数
    location.search.slice(1).split('&').map((item) => {
      const [k, v] = item.split('=');
      map.set(k, v)
    });
    return map.get('pid');
  }
  const getDetail = async () => {
    const pid = getParams();
    setLoading(true)
    try {
      const { data } = await apiGET('/product', { pid })
      setData(data)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }
  const getTableData = (data) => {
    const { intro, pull_data, put_data, status, info } = data;
    console.log(pull_data)
    setTableData([{
      label: '介绍',
      value: intro
    }, {
      label: '过审日期',
      value: pull_data === -1 ? '暂未过审' : new Date(pull_data).toLocaleDateString()
    }, {
      label: '下架日期',
      value: put_data === -1 ? '暂未下架' : new Date(put_data).toLocaleDateString()
    }, {
      label: '状态',
      value: Status[status].text
    }, {
      label: '平均年利率',
      value: getAverageInterestRate(info).toFixed(2) + '%'
    }])
  }
  const getChartData = (data) => {
    setChartData(data.info.map(({ year, rate }) => ({ year, rate })))
  }
  const handleChangeStatus = async (status) => {
    try {
      const { data } = await apiPOST('/product/check', { pid: getParams(), isPass: status });
      getDetail()
      console.log(data)
    } catch (e) {
      console.log(e);
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
    <Card
      style={{ width: '100%', paddingTop: '12px' }}
      extra={
        <AuthWrap>
          <ButtonGroup>
            {
              data && data.status !== 2 && <Button type="outline" onClick={() => handleChangeStatus(true)}>审批通过</Button>
            }
            {
              data && data.status !== 1 && <Button type='outline' status='danger' onClick={() => handleChangeStatus(false)}>下架产品</Button>
            }
          </ButtonGroup>
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
          <h2>
            {data ? data!.pname : ''}
          </h2>
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
        <Descriptions data={tableData} layout='inline-vertical' />
        {
          chartData && chartData.length > 1 && <OverviewAreaLine data={chartData} loading={loading} />
        }
        <DetailTable data={data ? data.info : []} />
      </Skeleton>
    </Card>
  )
}