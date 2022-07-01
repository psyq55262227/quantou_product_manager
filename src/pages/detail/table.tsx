import React, { useRef } from 'react';
import { Input, Table, TableColumnProps } from '@arco-design/web-react';

const DetailTable = ({ data }) => {
  console.log(data)
  const columns: TableColumnProps[] = [
    {
      title: '年份',
      dataIndex: 'year',
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
      onFilter: (value, row) => {
        return row.rate > value
      },
    },
    {
      title: '是否获奖',
      dataIndex: 'price',
      render: (col, { price }) => <span>{price ? '是' : '否'}</span>,
      filters: [
        {
          text: '只看获奖',
          value: true,
        },
      ],
      onFilter: (value, row) => row.price === true,
      filterMultiple: false,
    }
  ];
  return (
    <Table columns={columns} data={data} stripe />
  )
}
export default DetailTable;