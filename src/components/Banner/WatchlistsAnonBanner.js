import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { Button } from '@santiment-network/ui'
import styles from './WatchlistsAnonBanner.module.scss'

const WatchlistsAnonBanner = ({ className }) => {
  return (
    <div className={cx(styles.wrapper, className)}>
      <div className={styles.left}>
        <div className={styles.title}>
          Get ability to create your own watchlist when you login
        </div>
        <div className={styles.description}>
          Track selected assets in one place and check it's status
        </div>
      </div>
      <Button
        variant='fill'
        accent='positive'
        as={Link}
        to='/login'
        className={styles.btn}
      >
        Log in
      </Button>
    </div>
  )
}

export default WatchlistsAnonBanner
