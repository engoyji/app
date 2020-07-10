import { useMemo } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { buildRefetcher } from './utils'
import { client } from '../../index'

export const USER_QUERY = gql`
  {
    currentUser {
      id
      username
      email
      avatarUrl
      consentId
      sanBalance
      firstLogin
      stripeCustomerId
      marketingAccepted
      privacyPolicyAccepted
    }
  }
`

export const refetchUser = buildRefetcher(USER_QUERY)

export function updateUser (newUser) {
  const { currentUser } = client.readQuery({
    query: USER_QUERY
  })

  client.writeQuery({
    query: USER_QUERY,
    data: {
      currentUser: newUser && Object.assign({}, currentUser, newUser)
    }
  })
}

export function useUser () {
  const query = useQuery(USER_QUERY)

  return useMemo(
    () => {
      const { loading, data } = query
      console.log(data && data.currentUser)
      return {
        loading,
        user: data && data.currentUser
      }
    },
    [query]
  )
}
