import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { PanelWithHeader as Panel } from '@santiment-network/ui'
import AccountEmailForm from './AccountEmailForm'
import AccountUsernameForm from './AccountUsernameForm'
import AccountEthKeyForm from './AccountEthKeyForm'
import AccountWallets from './AccountWallets'
import AccountApiKeyForm from './AccountApiKeyForm'
import AccountAppearance from './AccountAppearance'
import AccountNotificationChannels from './AccountNotificationChannels'
import AccountSessions from './AccountSessions'
import * as actions from '../../actions/types'
import './Account.css'
const validate = require('validate.js')

export const TAKEN_MSG = 'Email has already been taken'

const validateFields = (email, username) => {
  var constraints = {
    email: {
      email: true
    },
    username: {
      length: { minimum: 3 }
    }
  }
  return validate({ email, username }, constraints)
}

const errorValidator = ({ email, username }) => {
  const validation = validateFields(email, username)
  return {
    email: validation && validation.email,
    username: validation && validation.username
  }
}

const successValidator = ({ email, username }) => {
  const validation = validateFields(email, username)
  return {
    email: typeof validation === 'undefined' || !validation.email,
    username: typeof validation === 'undefined' || !validation.username
  }
}

class Account extends Component {
  constructor (props) {
    super(props)
    this.state = {
      emailForm: {
        PENDING: false,
        ERROR: false,
        SUCCESS: false,
        TAKEN: false
      },
      usernameForm: {
        PENDING: false,
        ERROR: false,
        SUCCESS: false,
        TAKEN: false
      }
    }
    this.emailFormKey = 'emailForm'
    this.usernameFormKey = 'usernameForm'
  }

  setFormStatus (form) {
    return (status, value) => {
      this.setState(prevState => {
        const newFormState = { ...prevState[form] }
        newFormState[status] = value
        return {
          ...prevState,
          [form]: newFormState
        }
      })
    }
  }

  render () {
    const {
      user,
      logoutUser,
      changeEmail,
      changeUsername,
      generateAPIKey,
      revokeAPIKey,
      toggleNightMode,
      isLoggedIn,
      isNightModeEnabled
    } = this.props
    const { emailForm, usernameForm } = this.state

    if (user && !isLoggedIn) {
      return (
        <Redirect
          to={{
            pathname: '/'
          }}
        />
      )
    }

    return (
      <div className='page account'>
        <Panel header={'Account settings'}>
          <Helmet>
            <title>Settings</title>
          </Helmet>
          {!user.email && (
            <Message
              className='account-message account-message__dashboard'
              warning
              header='Email is not added yet!'
              list={[
                'To access your dashboard from mobile device, you should add an email address.'
              ]}
            />
          )}
          {emailForm.SUCCESS && (
            <Message
              className='account-message account-message__email_success'
              positive
              content={`Verification email was sent to "${user.email || ''}"!`}
            />
          )}
          {emailForm.ERROR && (
            <Message
              className='account-message account-message__email_error'
              negative
              header='Failed to change email!'
              list={[
                emailForm.TAKEN
                  ? 'This email is already taken! Please, choose another email...'
                  : 'Try again later...'
              ]}
            />
          )}
          {usernameForm.SUCCESS && (
            <Message
              className='account-message account-message__username_success'
              positive
              content={`Username was changed to "${user.username || ''}"!`}
            />
          )}
          {usernameForm.ERROR && (
            <Message
              className='account-message account-message__username_error'
              negative
              header='Failed to change username!'
              list={[
                usernameForm.TAKEN
                  ? 'This username is already taken! Please, choose another username...'
                  : 'Try again later...'
              ]}
            />
          )}
          <AccountEmailForm
            user={user}
            changeEmail={changeEmail}
            successValidator={successValidator}
            errorValidator={errorValidator}
            setFormStatus={this.setFormStatus(this.emailFormKey)}
            isEmailPending={emailForm.PENDING}
          />
          <AccountUsernameForm
            user={user}
            changeUsername={changeUsername}
            successValidator={successValidator}
            errorValidator={errorValidator}
            setFormStatus={this.setFormStatus(this.usernameFormKey)}
            isUsernamePending={usernameForm.PENDING}
          />
          <AccountEthKeyForm />
          <AccountWallets user={user} />
          <AccountNotificationChannels />
          <AccountApiKeyForm
            apikeys={user.apikeys}
            generateAPIKey={generateAPIKey}
            revokeAPIKey={revokeAPIKey}
          />
          <AccountAppearance
            isNightModeEnabled={isNightModeEnabled}
            onNightModeToggleChange={toggleNightMode}
          />
          <AccountSessions onLogoutBtnClick={logoutUser} />
        </Panel>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  isLoggedIn: !!state.user.token,
  isNightModeEnabled: state.rootUi.isNightModeEnabled
})

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch({ type: actions.USER_LOGOUT_SUCCESS }),
  changeEmail: email =>
    dispatch({
      type: actions.USER_EMAIL_CHANGE,
      email
    }),
  changeUsername: username =>
    dispatch({
      type: actions.USER_USERNAME_CHANGE,
      username
    }),
  generateAPIKey: () =>
    dispatch({
      type: actions.USER_APIKEY_GENERATE
    }),
  revokeAPIKey: apikey =>
    dispatch({
      type: actions.USER_APIKEY_REVOKE,
      apikey
    }),
  toggleNightMode: checked =>
    dispatch({
      type: actions.USER_TOGGLE_NIGHT_MODE,
      payload: checked
    })
})

export const UnwrappedAccount = Account // For tests
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account)
