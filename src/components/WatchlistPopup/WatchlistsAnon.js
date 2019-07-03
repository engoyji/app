import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import Button from '@santiment-network/ui/Button'
import Panel from '@santiment-network/ui/Panel/Panel'
import Image from '../../assets/watchlists.png'
import styles from './WatchlistsAnon.module.scss'

const WrapperType = ({ isFullScreen, children }) => {
  return isFullScreen ? (
    <Panel className={cx(styles.fullScreen, styles.wrapper)}>{children}</Panel>
  ) : (
    <div className={styles.wrapper}>{children}</div>
  )
}

const WatchlistsAnon = ({ isFullScreen }) => (
  <WrapperType isFullScreen={isFullScreen}>
    <img
      alt='watchlists'
      src={Image}
      className={cx(styles.hide, isFullScreen && styles.img)}
    />
    <p className={styles.title}>Easy asset tracking</p>
    <p className={styles.desc}>Use watchlists to organize and track</p>
    <p className={styles.desc}>assets you are interested in</p>
    <div className={styles.bottom}>
      <p className={styles.desc}>Please, log in to use this feature</p>
      <Button
        variant='fill'
        accent='positive'
        className={styles.btn}
        as={Link}
        to={'/login'}
      >
        Login
      </Button>
    </div>
  </WrapperType>
)

export default WatchlistsAnon
