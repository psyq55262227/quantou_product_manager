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
      sorter: (a, b) => Number(a.year) - Number(b.year),
    },
    {
      title: '年成本',
      dataIndex: 'cost',
      sorter: (a, b) => Number(a.cost) - Number(b.cost),
    },
    {
      title: '年利润',
      dataIndex: 'profit',
      sorter: (a, b) => Number(a.profit) - Number(b.profit),
    },
    {
      title: '年利率',
      dataIndex: 'rate',
      sorter: (a, b) => Number(a.rate) - Number(b.rate),
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
  ];
  return (
    <Table columns={columns} data={data} stripe />
  )
}
export default DetailTable;