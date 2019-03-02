import React, { Fragment } from 'react'
import moment from 'moment'
import styles from './Feed.module.scss'
import BigList from '../BigList'

// NOTE(vanguard): implement infinite-scroll, not lazy load
const Feed = ({ component: El, data, dateKey }) => {
  return (
    <BigList
      list={data}
      render={list => {
        let lastDateKey
        return list.map((item, index) => {
          const id = item.id || index
          const date = moment(item[dateKey]).format('MMM D')
          const isNotSameAsLastDate = date !== lastDateKey

          if (isNotSameAsLastDate) {
            lastDateKey = date
          }

          return (
            <Fragment key={id}>
              {isNotSameAsLastDate && <h4 className={styles.date}>{date}</h4>}
              <El className={styles.signal} {...item} />
            </Fragment>
          )
        })
      }}
    />
  )
}

export default Feed