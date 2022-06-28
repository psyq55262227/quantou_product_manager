import { Card, Link, Pagination } from '@arco-design/web-react'
import Meta from '@arco-design/web-react/es/Card/meta'
import styles from './style/index.module.less'
import React, { useState } from 'react'
const ProductList = () => {
  const [page, setPage] = useState(1);
  const data = [
    1, 2, 3, 4, 5, 6, 7
  ]
  return (
    <section className={styles.box}>
      <section className={styles.container}>
        {
          data.slice((page - 1) * 6, page * 6).map((item, i) => (
            <Link key={i} href="/detail?id=1">
              <Card
                hoverable
                cover={
                  <div style={{ height: 204, overflow: 'hidden' }}>
                    <img
                      style={{ width: '100%', transform: 'translateY(-20px)' }}
                      alt='dessert'
                      src='//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
                    />
                  </div>
                }
              >
                <Meta
                  title='Card Title'
                  description={
                    <>
                      Card content <br /> Card content
                    </>
                  }
                />
              </Card>
            </Link>
          ))
        }
      </section>
      <Pagination defaultPageSize={6} total={data.length} showJumper hideOnSinglePage onChange={page => setPage(page)} />
    </section>
  )
}
export default ProductList