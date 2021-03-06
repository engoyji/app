import React from 'react'
import Card from './WatchlistCard'
import { useFeaturedWatchlists } from '../gql/hooks'
import { getWatchlistLink } from '../utils'
import { sortById } from '../../../utils/sortMethods'

const Featured = () => {
  const [watchlists = [], loading] = useFeaturedWatchlists()
  return !loading ? (
    <>
      {watchlists.sort(sortById).map(watchlist => {
        return (
          <Card
            key={watchlist.id}
            name={watchlist.name}
            skipIndicator
            watchlist={watchlist}
            to={getWatchlistLink(watchlist)}
            {...watchlist}
          />
        )
      })}
    </>
  ) : null
}

export default Featured
