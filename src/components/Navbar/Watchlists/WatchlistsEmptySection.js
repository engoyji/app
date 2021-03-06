import React from 'react'
import Button from '@santiment-network/ui/Button'
import { SvgNew } from '../../Watchlists/NewWatchlistCard'
import NewWatchlist from '../../../ducks/Watchlists/Actions/New'
import CreateWatchlistBtn from './CreateWatchlistBtn'
import styles from './WatchlistsEmptySection.module.scss'

const WatchlistsEmptySection = ({ watchlists }) => (
  <div className={styles.wrapper}>
    <SvgNew />

    <span className={styles.description}>
      <NewWatchlist
        trigger={
          <Button accent='positive' className={styles.btnInText}>
            Create
          </Button>
        }
        watchlists={watchlists}
      />{' '}
      your own watchlist{' '}
    </span>
    <span>to track assets you are </span>
    <span>interested in</span>

    <CreateWatchlistBtn className={styles.first} watchlists={watchlists} />
  </div>
)

export default WatchlistsEmptySection
