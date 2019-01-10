import gql from 'graphql-tag'
import Raven from 'raven-js'
import moment from 'moment'
import { Observable } from 'rxjs'
import * as actions from './../actions/types'
import { getTimeFromFromString } from './../utils/utils'

const HistoryPriceGQL = gql`
  query queryHistoryPrice(
    $slug: String
    $from: DateTime
    $to: DateTime
    $interval: String
  ) {
    historyPrice(slug: $slug, from: $from, to: $to, interval: $interval) {
      priceBtc
      priceUsd
      volume
      datetime
      marketcap
    }
  }
`

export const DevActivityGQL = gql`
  query queryDevActivity(
    $slug: String
    $from: DateTime!
    $to: DateTime!
    $interval: String!
    $transform: String
    $movingAverageIntervalBase: Int
  ) {
    devActivity(
      slug: $slug
      from: $from
      to: $to
      interval: $interval
      transform: $transform
      movingAverageIntervalBase: $movingAverageIntervalBase
    ) {
      datetime
      activity
    }
  }
`

const handleError = error => {
  Raven.captureException(error)
  return Observable.of({
    type: actions.TIMESERIES_FETCH_FAILED,
    payload: error
  })
}

const fetchTimeseries$ = ({ settings, client }) => {
  return Observable.from(
    client.query({
      query: HistoryPriceGQL,
      variables: {
        slug: settings.slug || 'bitcoin',
        interval: settings.interval || '1d',
        to: moment().toISOString(),
        from: getTimeFromFromString(settings.timeRange)
      },
      context: { isRetriable: true }
    })
  )
}

const mapDataToAssets = ({ data: { data, loading, error } }) => {
  const items = !data.error ? data['historyPrice'] : []
  const isEmpty = items && items.length === 0
  return {
    price: {
      items,
      error,
      isEmpty,
      isLoading: loading
    }
  }
}

const fetchTimeseriesEpic = (action$, store, { client }) =>
  action$.ofType(actions.TIMESERIES_FETCH).mergeMap(action => {
    const settings = action.payload.price
    console.log(action.payload)
    return fetchTimeseries$({ settings, client })
      .exhaustMap(data => {
        return Observable.of({
          type: actions.TIMESERIES_FETCH_SUCCESS,
          payload: mapDataToAssets({ data })
        })
      })
      .catch(handleError)
  })

export default fetchTimeseriesEpic
