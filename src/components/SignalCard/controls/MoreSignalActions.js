import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import ContextMenu from '@santiment-network/ui/ContextMenu'
import Button from '@santiment-network/ui/Button'
import Icon from '@santiment-network/ui/Icon'
import Panel from '@santiment-network/ui/Panel/Panel'
import { RemoveSignalButton } from './SignalControls'
import ShareModalTrigger from '../../Share/ShareModalTrigger'
import { mapStateToQS } from '../../../utils/utils'
import styles from '../SignalCard.module.scss'

const generateShareLink = (id, title) => {
  const { origin } = window.location
  return `${origin}/sonar/signal/${id}${mapStateToQS({
    title
  })}`
}

const MoreSignalActions = ({
  signalId,
  signalTitle,
  removeSignal,
  isPublic
}) => {
  const link = generateShareLink(signalId, signalTitle)

  return (
    <ContextMenu
      trigger={
        <Button className={styles.expandButton}>
          <Icon type='dots' />
        </Button>
      }
      position='bottom'
      align='start'
      classes={styles}
    >
      <Panel>
        <div className={styles.popup}>
          <div className={cx(styles.popupItem, styles.popupButton)}>
            <Link to={`/sonar/signal/${signalId}/edit`} className={styles.link}>
              Edit signal
            </Link>
          </div>

          {isPublic && (
            <div className={cx(styles.popupItem, styles.popupButton)}>
              <ShareModalTrigger
                trigger={SignalShareTrigger}
                shareTitle='Santiment'
                shareText={`Crypto Signal '${signalTitle}'`}
                shareLink={link}
              />
            </div>
          )}

          <div className={cx(styles.popupItem, styles.popupButton)}>
            <RemoveSignalButton
              id={signalId}
              signalTitle={signalTitle}
              removeSignal={removeSignal}
              trigger={<div className={styles.removeSignal}>Delete</div>}
            />
          </div>
        </div>
      </Panel>
    </ContextMenu>
  )
}

const SignalShareTrigger = ({ ...props }) => (
  <Button as='a' {...props} className={styles.share}>
    Share
  </Button>
)

export default MoreSignalActions
