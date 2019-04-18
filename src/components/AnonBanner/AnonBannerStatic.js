import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { Button, Icon } from '@santiment-network/ui'
import styles from './AnonBannerStatic.module.scss'

const AnonBannerStatic = ({ className, bannerRef }) => {
  return (
    <div className={cx(styles.banner, className)} ref={bannerRef}>
      <div className={styles.banner__top}>
        <div className={styles.banner__title}>
          Noise control for the crypto market
        </div>
        <div className={styles.banner__description}>
          Santiment provides advanced 360° overview of the crypto market and its
          biggest driving forces
        </div>
        <Button variant='fill' accent='positive' as={Link} to='/login'>
          Get started
        </Button>
      </div>
      <div className={styles.banner__info}>
        <div className={styles.advantages}>
          <div className={styles.advantage}>
            <div className={styles.advantage__img}>
              <Icon type='data-big' />
            </div>
            <div className={styles.advantage__text}>
              On-chain, social and development data for 1200+ crypto projects
            </div>
          </div>
          <div className={styles.advantage}>
            <div className={styles.advantage__img}>
              <Icon type='crown-big' />
            </div>
            <div className={styles.advantage__text}>
              Exclusive crypto metrics and curated, data-driven daily insights
            </div>
          </div>
          <div className={styles.advantage}>
            <div className={styles.advantage__img}>
              <Icon type='community-big' />
            </div>

            <div className={styles.advantage__text}>
              Growing community of crypto traders and market analysts
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AnonBannerStatic)
