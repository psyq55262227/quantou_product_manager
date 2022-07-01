import { apiGET } from "@/api";
import OverviewAreaLine from "@/components/Chart/overview-area-line";
import { getAverageInterestRate } from "@/utils/count";
import { Status } from "@/utils/status";
import { Card, Skeleton, Descriptions } from "@arco-design/web-react"
import React, { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom'
import DetailTable from "./table";

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
  const getParams = () => {
    const map = new Map();
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
      console.log(data)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }
  const getTableData = (data) => {
    const { intro, pull_data, put_data, status, info } = data;
    setTableData([{
      label: '介绍',
      value: intro
    }, {
      label: '过审日期',
      value: pull_data === -1 ? '暂未过审' : pull_data
    }, {
      label: '下架日期',
      value: put_data === -1 ? '暂未下架' : put_data
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
  useEffect(() => {
    getDetail();
  }, [])
  useEffect(() => {
    if (data) {
      getTableData(data);
      getChartData(data);
    }
  }, [data])
  return (
    <Card
      style={{ width: '100%', paddingTop: '12px' }}
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