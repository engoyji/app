import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import cx from 'classnames'
import Label from '@santiment-network/ui/Label'
import Toggle from '@santiment-network/ui/Toggle'
import * as actions from '../../actions/types'
import { useUser } from '../../stores/user'
import styles from './AccountPage.module.scss'

const SettingsEmailNotifications = ({
  isEmailNotificationEnabled,
  toggleEmailNotification,
  classes = {},
  description,
  email
}) => {
  const { user } = useUser()
  return (
    <div className={cx(classes.container, styles.settingBlock)}>
      <Label className={classes.left}>Email notifications</Label>
      <div className={cx(styles.setting__right_notifications, classes.right)}>
        {description}
        {user && user.email ? (
          <Toggle
            isActive={isEmailNotificationEnabled}
            onClick={() => toggleEmailNotification(!isEmailNotificationEnabled)}
          />
        ) : (
          'Please add email to enable notifications'
        )}
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  toggleEmailNotification: signalNotifyEmail =>
    dispatch({
      type: actions.SETTINGS_TOGGLE_NOTIFICATION_CHANNEL,
      payload: { signalNotifyEmail }
    })
})

const enhance = compose(
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(SettingsEmailNotifications)
