import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import LikeBtn from '../Like/LikeBtn'
import { getSEOLinkFromIdAndTitle } from '../../pages/Insights/utils'
import styles from './InsightCardSmall.module.scss'

const InsightCard = ({
  className = '',
  id,
  title,
  createdAt,
  votedAt,
  votes: { totalVotes }
}) => {
  return (
    <div className={className}>
      <Link
        to={`/insights/read/${getSEOLinkFromIdAndTitle(id, title)}`}
        className={styles.title}
      >
        {title}
      </Link>
      <div className={styles.meta}>
        <div className={styles.date}>
          {moment(createdAt).format('MMM D, YYYY')}
        </div>
        <LikeBtn small grey liked={!!votedAt} likesNumber={totalVotes} />
      </div>
    </div>
  )
}

InsightCard.defaultProps = {
  votes: {},
  comments: 0
}

export default InsightCard