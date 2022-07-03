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
import Score from "./score";

interface IItem {
  label: string;
  value: any;
}
export default () => {
  const location = useLocation();
  const scoreDesc = ['利润评分', '营收评分', '稳定性评分']
  // 存放后端获取数据
  const [data, setData] = useState();
  // 存放表格所需格式的数据
  const [tableData, setTableData] = useState<IItem[]>();
  // 存放评委评分数据
  const [score, setScore] = useState([]);
  // 存放图表所需格式的数据
  const [chartData, setChartData] = useState();
  // 存放是否正在请求后端的状态,即页面的loading状态
  const [loading, setLoading] = useState(true);
  // 从react-redux中获取存储在全局store中的userInfo
  const userInfo = useSelector((state: GlobalState) => state.userInfo);
  // 获取当前在url中的pid参数
  const getParams = () => {
    const map = new Map();
    // location.search截取当前url参数，如?id=1&name=admin，则此处先slice(1)截去开头的问号，根据&将字符串分割成若干字符串数组，如['id=1','name=admin']，再遍历数据将数据根据'='分割成{'id',1}的形式，用map哈希表存储，如此之后map.get(key)根据key名id即可获取id对应的参数
    location.search.slice(1).split('&').map((item) => {
      const [k, v] = item.split('=');
      map.set(k, v)
    });
    const pid = map.get('pid')
    return pid;
  }
  // 从后端获取数据的方法
  const getDetail = async () => {
    // 先设置加载状态
    setLoading(true)
    try {
      // 获取数据并存放到data
      const { data } = await apiGET('/product', { pid: getParams() })
      setData(data)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }
  // 格式化评分的方法
  const getFormatRateAverage = (data) => getAverage(data).toFixed(1) + '/5'
  // 将后端获取数据的格式处理为表格数据格式的方法
  const getTableData = (data) => {
    const { intro, pull_data, put_data, status, info, price, score } = data;
    setTableData([{
      label: '介绍',
      value: intro,
      // 占3格,相当于占了一行
      span: 3,
    }, {
      label: '过审日期',
      // 后端预置-1为未处理的情况
      value: pull_data === -1 ? '暂未过审' : new Date(pull_data).toLocaleDateString()
    }, {
      label: '下架日期',
      value: put_data === -1 ? '暂未下架' : new Date(put_data).toLocaleDateString()
    },
    {
      label: '平均年利率',
      // 该方法参见`@/utils/count`
      value: getAverageInterestRate(info).toFixed(1) + '%'
    },
    {
      label: '状态',
      // Status参见`@/utils/status`,预设三种状态对应的文字说明和颜色
      value: Status[status].text
    },
    {
      label: '获奖情况',
      value: price ? '已获奖' : '未获奖'
    },
    {
      label: '平均评分',
      // 这段纯纯是按数据格式写的, 其实就是把所有分数进行累加并求和
      value: score.length === 0 ? '暂无评分' : getFormatRateAverage(score.map(({ sc }) => getAverage(sc)))
    },
    ...scoreDesc.map((item, i) => ({
      label: item,
      // 这段纯纯是按数据格式写的, 其实就是把对应分数从当前数据格式中取出来, 累加并求和
      value: score.length !== 0 && score[0].sc[i] ? getFormatRateAverage(score.map(({ sc }) => sc[i])) : '暂无评分'
    }))
    ])
  }
  // 处理为chart需要的数据格式
  const getChartData = (data) => {
    setChartData(data.info.map(({ year, rate }) => ({ year, rate })))
  }
  // 获取当前用户的评分记录, 若已评过分, 则默认显示最新的一次评分结果
  const getDefaultScore = (data) => {
    const res = data.find(({ bid }) => bid === userInfo.uid)
    if (res) {
      setScore(res.sc)
    }
  }
  // 管理员处理产品上下架的状态切换
  const handleChangeStatus = async (status) => {
    try {
      await apiPOST('/product/check', { pid: getParams(), isPass: status });
      getDetail()
    } catch (e) {
      console.log(e);
    }
  }
  // 管理员处理获奖的状态切换
  const handleChangePrice = async (price) => {
    try {
      await apiPOST('/product/price', { pid: getParams(), price })
      getDetail();
      Message.success('获奖情况更新成功！')
    } catch (e) {
      console.log(e)
    }
  }
  // 评委处理评分的更新
  const handleChangeScore = async () => {
    try {
      await apiPOST('/product/score', { pid: getParams(), sc: score });
      getDetail();
      Message.success('评分成功！')
    } catch (e) {
      console.log(e)
    }
  }
  // 页面挂载时,即从后端获取当前产品的细节
  useEffect(() => {
    getDetail();
  }, [])
  // 当从后端获取的data发生改变时,若data存在,则更新表格/图表/评分的信息
  useEffect(() => {
    if (data) {
      getTableData(data);
      getChartData(data);
      getDefaultScore(data.score)
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
          // 权限控制，仅管理员可显示
          <Space>
            {/* 判断是否有奖项 */}
            <AuthWrap role="judge">
              <Score desc={scoreDesc} score={score} setScore={setScore} onConfirm={handleChangeScore} />
            </AuthWrap>
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
                    >颁发奖项</Button>
                  )
                }
                {
                  // status，0待审核，1不通过，2通过
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
          </Space>
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