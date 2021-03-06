import qs from 'query-string'
import { store } from '../../index'

export function getWatchlistLink ({ name, id }) {
  return `/assets/list?name=${encodeURIComponent(name)}@${id}`
}

export function isStaticWatchlist (watchlist) {
  const { name } = watchlist.function || {}
  return name === 'empty'
}

export function isDynamicWatchlist (watchlist = {}) {
  if (watchlist === null) {
    return
  }

  const { name } = watchlist.function || {}
  return (
    name !== 'empty' && (name === 'selector' || name === 'top_all_projects')
  )
}

export function isUserDynamicWatchlist (watchlist) {
  const storeState = store.getState()
  let userId
  let watchlistUserId
  if (storeState) {
    userId = storeState.user.data.id
  }

  if (!watchlist) {
    return
  }

  if (watchlist && watchlist.user) {
    watchlistUserId = watchlist.user.id
  }
  const { name } = watchlist && watchlist.function ? watchlist.function : {}
  return name !== 'empty' && userId === watchlistUserId
}

export function getWatchlistId (search) {
  const { name: str } = qs.parse(search) || {}

  if (str) {
    const [, id] = str.split('@')
    return id
  }
}

export function isDefaultScreenerPath (pathname) {
  return pathname === DEFAULT_SCREENER.to
}

export function hasAssetById ({ id, listItems }) {
  if (!id) return
  return listItems.some(({ id: projectId }) => projectId === id)
}

export const getWatchlistName = ({ type, location: { search } }) => {
  switch (type) {
    case 'all':
      return 'All Assets'
    case 'screener':
      return 'My Screener'
    case 'erc20':
      return 'ERC20 Assets'
    case 'list':
      const name = (qs.parse(search).name || '').split('@')[0]
      return name
    default:
      return 'Assets'
  }
}

export const normalizeCSV = items => {
  return items.map(item => {
    const { __typename, id, signals, ethAddresses, ...rest } = item
    const _ethAddresses = ethAddresses
      ? ethAddresses.map(
        address =>
          `https://app.santiment.net/balance?address=${
            address.address
          }&assets[]=ethereum`
      )
      : undefined
    if (_ethAddresses && _ethAddresses.length > 0) {
      return { _ethAddresses, ...rest }
    }
    return rest
  })
}

export const getHelmetTags = (isList, listName) => {
  const isWatchlist = isList && listName
  return {
    title: isWatchlist
      ? `Crypto Watchlist: ${listName.split('@')[0]} - Sanbase`
      : 'All Crypto Assets - Sanbase',
    description: isWatchlist
      ? 'Santiment Watchlists let you keep track of different crypto projects, and compare their performance, on-chain behavior and development activity.'
      : 'Financial, on-chain and development data for 1100+ crypto projects in the Santiment database, including BTC, XRP, ETH and 700+ ERC-20 tokens'
  }
}

export const DEFAULT_SCREENER = {
  name: 'My screener',
  to: '/assets/screener',
  slug: 'TOTAL_MARKET',
  assetType: 'screener'
}

export const DEFAULT_SCREENER_FUNCTION = {
  args: { size: 10000 },
  name: 'top_all_projects'
}

// NOTE (haritonasty): remove it after migration on dynamic watchlists
// (need to integrate server-side pagination for tables before)
// July 5, 2020

export const BASIC_CATEGORIES = [
  {
    name: 'All assets',
    to: '/assets/all',
    slug: 'TOTAL_MARKET',
    assetType: 'all'
  },
  {
    name: 'ERC20',
    to: '/assets/erc20',
    slug: 'TOTAL_ERC20',
    assetType: 'erc20'
  }
]
