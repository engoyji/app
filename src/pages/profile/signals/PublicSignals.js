import React from 'react'
import SignalCardsGrid from '../../../components/SignalCard/SignalCardsGrid'
import Counter from '../counter/Counter'
import styles from './../ProfilePage.module.scss'

const PublicSignals = ({ data: signals, userId }) => {
  if (!signals || signals.length === 0) {
    return null
  }

  const signalsWithUser = signals.map(signal => ({
    ...signal,
    userId: userId
  }))

  return (
    <div className={styles.block}>
      <div className={styles.title}>
        Public signals <Counter value={signals.length} />
      </div>
      <SignalCardsGrid signals={signalsWithUser} deleteEnabled={false} />
    </div>
  )
}

export default PublicSignals
