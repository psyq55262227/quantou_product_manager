import { Card, Link } from '@arco-design/web-react'
import Meta from '@arco-design/web-react/es/Card/meta'
import styles from './style/index.module.less'
import React from 'react'
const productList = () => {
  const data = [
    1, 2, 3, 4, 5,
  ]
  return (
    <section className={styles.container}>
      {
        data.map((item, i) => (
          <Link key={i} href="/detail">
            <Card
              hoverable
              style={{ width: 360 }}

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
  )
}
export default productList