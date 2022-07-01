import React from 'react';
import { Table, TableColumnProps } from '@arco-design/web-react';

const DetailTable = ({ data }) => {
  // api 参见 https://arco.design/react/components/table
  const columns: TableColumnProps[] = [
    {
      // 表头
      title: '年份',
      // data中对应的键名
      dataIndex: 'year',
      // 排序条件
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: '年成本',
      dataIndex: 'cost',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: '年利润',
      dataIndex: 'profit',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: '年利率',
      dataIndex: 'rate',
      sorter: (a, b) => a.year - b.year,
      // 根据条件筛选
      filters: [
        {
          text: '> 1%',
          value: 1,
        },
        {
          text: '> 0.5%',
          value: 0.5,
        },
      ],
      // 筛选方法。value是filters中选中的value，row是当前被遍历到的数据
      onFilter: (value, row) => {
        return row.rate > value
      },
    },
    // {
    //   title: '是否获奖',
    //   dataIndex: 'price',
    //   // 重写该属性对应的html渲染方式
    //   render: (col, { price }) => <span>{price ? '是' : '否'}</span>,
    //   filters: [
    //     {
    //       text: '只看获奖',
    //       value: true,
    //     },
    //   ],
    //   onFilter: (value, row) => row.price === true,
    //   filterMultiple: false,
    // }
  ];
  return (
    <Table columns={columns} data={data} stripe />
  )
}
export default DetailTable;