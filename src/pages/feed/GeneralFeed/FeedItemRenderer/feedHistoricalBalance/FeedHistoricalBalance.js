import React from 'react'
import Button from '@santiment-network/ui/Button'
import styles from './FeedHistoricalBalance.module.scss'
import { capitalizeStr } from '../../../../../utils/utils'
import { formatNumber } from '../../../../../utils/formatting'

const spliceLink = address => address.slice(0, 20) + '...'

const FeedHistoricalBalance = ({ data }) => {
  const {
    historical_balance_link,
    asset,
    address,
    balance_change,
    since
  } = data

  return (
    <div className={styles.container}>
      <div className={styles.description}>
        The {capitalizeStr(asset)} balance of the address{' '}
        <span className={styles.address}>{spliceLink(address)}</span> has
        <span className={styles.balanceChange}>
          {balance_change < 0 ? 'decreased' : 'increased'} by{' '}
          {formatNumber(balance_change)}
        </span>
        since {since}
      </div>

      <div className={styles.actions}>
        <Button
          as='a'
          href={historical_balance_link}
          target='_blank'
          className={styles.balanceBtn}
        >
          Historical balance change
        </Button>
      </div>
    </div>
  )
}

export default FeedHistoricalBalance
