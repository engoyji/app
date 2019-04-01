/* eslint-env jest */
import moment from 'moment'
import {
  findIndexByDatetime,
  calculateBTCVolume,
  sanitizeMediumDraftHtml,
  filterProjectsByMarketSegment,
  mergeTimeseriesByKey,
  getEscapedGQLFieldAlias,
  getTimeRangeByDuration,
  isEthStrictAddress
} from './utils'

const labels = [
  moment('2018-01-15T06:00:00Z'),
  moment('2018-01-12T06:00:00Z'),
  moment('2018-01-11T18:00:00Z')
]

describe('findIndexByDatetime', () => {
  it('should return right index by datetime', () => {
    expect(findIndexByDatetime(labels, '2018-01-11T18:00:00Z')).toEqual(2)
  })

  it('should return -1, if labels array doesnt have datetime', () => {
    expect(findIndexByDatetime(labels, '2017-01-11T18:00:00Z')).toEqual(-1)
  })

  it('should return -1, if labels array is empty', () => {
    expect(findIndexByDatetime([], '2017-01-11T18:00:00Z')).toEqual(-1)
  })
})

const historyPrice = [
  {
    volume: '3313025',
    priceUsd: '2.2360575000000003',
    priceBtc: '0.00020811349999999999',
    marketcap: '72724491.75',
    datetime: '2017-11-29T09:00:00Z',
    __typename: 'PricePoint'
  },
  {
    volume: '9865673',
    priceUsd: '2.2590075',
    priceBtc: '0.00020983916666666665',
    marketcap: '73470907',
    datetime: '2017-11-29T10:00:00Z',
    __typename: 'PricePoint'
  },
  {
    volume: '9940505',
    priceUsd: '2.2839858333333334',
    priceBtc: '0.00021024283333333333',
    marketcap: '74283290.66666667',
    datetime: '2017-11-29T11:00:00Z',
    __typename: 'PricePoint'
  }
]

describe('calculateBTCVolume', () => {
  it('should return volume in BTC', () => {
    expect(calculateBTCVolume(historyPrice[0])).toEqual(308.34861283195977)
  })
})

describe('sanitizeMediumDraftHtml', () => {
  it('should sanitize script tags', () => {
    const dirty =
      '<html><body><p id="demo" /><script>document.getElementById("demo").innerHTML = "Hello JavaScript!";</script></body></html>'
    const clean = '<p id="demo"></p>'

    expect(sanitizeMediumDraftHtml(dirty)).toEqual(clean)
  })

  it('should sanitize scripts in event handlers', () => {
    const dirty =
      '<button onclick="myFunction()">Click me</button><p id="demo"></p><script>function myFunction() {document.getElementById("demo").innerHTML = "Hello World";}</script>'
    const clean = 'Click me<p id="demo"></p>'

    expect(sanitizeMediumDraftHtml(dirty)).toEqual(clean)
  })
})

describe('filterProjectsByMarketSegment', () => {
  it('should return expected values', () => {
    const dataProvider = [
      // projects is undefined, there is a category
      {
        projects: undefined,
        categories: { Financial: true },
        expectation: undefined
      },
      // projects is an empty array, there is a category
      {
        projects: [],
        categories: { Financial: true },
        expectation: []
      },
      // projects is an empty array, categories is an empty object
      {
        projects: [],
        categories: {},
        expectation: []
      },
      // projects is not empty, categories is an empty object
      {
        projects: [{ marketSegment: 'Financial' }],
        categories: {},
        expectation: [{ marketSegment: 'Financial' }]
      },
      // projects is not empty, there is a category
      {
        projects: [{ marketSegment: 'Financial' }, { marketSegment: 'media' }],
        categories: { Financial: true },
        expectation: [{ marketSegment: 'Financial' }]
      },
      // projects is not empty, there are multiple categories
      {
        projects: [
          { marketSegment: 'Financial' },
          { marketSegment: 'Blockchain Network' },
          { marketSegment: 'Advertising' }
        ],
        categories: {
          Financial: true,
          'Blockchain Network': true
        },
        expectation: [
          { marketSegment: 'Financial' },
          { marketSegment: 'Blockchain Network' }
        ]
      }
    ]
    dataProvider.map(data =>
      expect(
        filterProjectsByMarketSegment(data.projects, data.categories)
      ).toEqual(data.expectation)
    )
  })
})

describe('mergeTimeseriesByKey', () => {
  const ts1 = [
    {
      value1: 11,
      datetime: '2018-06-20T00:00:00Z'
    },
    {
      value1: 12,
      datetime: '2018-07-20T00:00:00Z'
    }
  ]

  const ts2 = [
    {
      value2: 21,
      datetime: '2018-06-20T00:00:00Z'
    },
    {
      value2: 22,
      datetime: '2018-07-20T00:00:00Z'
    },
    {
      value2: 23,
      datetime: '2018-08-20T00:00:00Z'
    }
  ]

  const ts3 = [
    {
      value3: 31,
      datetime: '2018-06-20T00:00:00Z'
    },
    {
      value3: 32,
      datetime: '2018-07-20T00:00:00Z'
    }
  ]

  const ts4 = [
    {
      value4: 41,
      datetime: '2018-05-20T00:00:00Z'
    },
    {
      value4: 42,
      datetime: '2018-06-20T00:00:00Z'
    }
  ]

  const ts5 = [
    {
      value5: 51,
      datetime: '2018-08-20T00:00:00Z'
    },
    {
      value5: 52,
      datetime: '2018-09-20T00:00:00Z'
    },
    {
      value5: 53,
      datetime: '2018-10-20T00:00:00Z'
    }
  ]

  const ts6 = [
    {
      value6: 61,
      datetime: '2018-08-20T00:00:00Z'
    },
    {
      value6: 62,
      datetime: '2018-09-20T00:00:00Z'
    },
    {
      value6: 63,
      datetime: '2018-11-20T00:00:00Z'
    },
    {
      value6: 64,
      datetime: '2018-12-20T00:00:00Z'
    }
  ]

  it('should merge correctly and skip empty TS', () => {
    const goodMerged = [
      {
        value1: 11,
        value2: 21,
        datetime: '2018-06-20T00:00:00Z'
      },
      {
        value1: 12,
        value2: 22,
        datetime: '2018-07-20T00:00:00Z'
      },
      {
        value2: 23,
        datetime: '2018-08-20T00:00:00Z'
      }
    ]

    const expected = mergeTimeseriesByKey({
      timeseries: [ts1, ts2, []],
      key: 'datetime'
    })
    expect(expected).toEqual(goodMerged)
  })

  it('should append longest array with missing new TS and merge existing', () => {
    const goodMerged = [
      {
        value2: 21,
        datetime: '2018-06-20T00:00:00Z'
      },
      {
        value2: 22,
        datetime: '2018-07-20T00:00:00Z'
      },
      {
        value2: 23,
        value5: 51,
        datetime: '2018-08-20T00:00:00Z'
      },
      {
        value5: 52,
        datetime: '2018-09-20T00:00:00Z'
      },
      {
        value5: 53,
        datetime: '2018-10-20T00:00:00Z'
      }
    ]

    const expected = mergeTimeseriesByKey({
      timeseries: [ts5, ts2],
      key: 'datetime'
    })
    expect(expected).toEqual(goodMerged)
  })

  it('should merge 2 timeseries properly', () => {
    const goodMerged = [
      {
        value1: 11,
        value2: 21,
        datetime: '2018-06-20T00:00:00Z'
      },
      {
        value1: 12,
        value2: 22,
        datetime: '2018-07-20T00:00:00Z'
      },
      {
        value2: 23,
        datetime: '2018-08-20T00:00:00Z'
      }
    ]

    const expected = mergeTimeseriesByKey({
      timeseries: [ts1, ts2],
      key: 'datetime'
    })
    expect(expected).toEqual(goodMerged)
  })

  it('should merge timeseries properly', () => {
    const goodMerged = [
      {
        value1: 11,
        value2: 21,
        value3: 31,
        datetime: '2018-06-20T00:00:00Z'
      },
      {
        value1: 12,
        value2: 22,
        value3: 32,
        datetime: '2018-07-20T00:00:00Z'
      },
      {
        value2: 23,
        datetime: '2018-08-20T00:00:00Z'
      }
    ]

    const expected = mergeTimeseriesByKey({
      timeseries: [ts1, ts2, ts3],
      key: 'datetime'
    })
    expect(expected).toEqual(goodMerged)
  })
  it('should merge 2 timeseries when large one has gaps', () => {
    const goodMerge = [
      {
        value5: 51,
        value6: 61,
        datetime: '2018-08-20T00:00:00Z'
      },
      {
        value5: 52,
        value6: 62,
        datetime: '2018-09-20T00:00:00Z'
      },
      {
        value5: 53,
        datetime: '2018-10-20T00:00:00Z'
      },
      {
        value6: 63,
        datetime: '2018-11-20T00:00:00Z'
      },
      {
        value6: 64,
        datetime: '2018-12-20T00:00:00Z'
      }
    ]

    const expected = mergeTimeseriesByKey({
      timeseries: [ts5, ts6],
      key: 'datetime'
    })

    expect(expected).toEqual(goodMerge)
  })

  it('should merge 3 timeseries when large one has gaps', () => {
    const goodMerge = [
      {
        value2: 23,
        value5: 51,
        value6: 61,
        datetime: '2018-08-20T00:00:00Z'
      },
      {
        value5: 52,
        value6: 62,
        datetime: '2018-09-20T00:00:00Z'
      },
      {
        value5: 53,
        datetime: '2018-10-20T00:00:00Z'
      },
      {
        value6: 63,
        datetime: '2018-11-20T00:00:00Z'
      },
      {
        value6: 64,
        datetime: '2018-12-20T00:00:00Z'
      }
    ]

    const expected = mergeTimeseriesByKey({
      timeseries: [ts5, ts6, ts2],
      key: 'datetime'
    })

    expect(expected).toEqual(goodMerge)
  })

  it('should merge 2 timeseries leaving the unfound datetime', () => {
    const goodMerged = [
      {
        value2: 21,
        value4: 42,
        datetime: '2018-06-20T00:00:00Z'
      },
      {
        value2: 22,
        datetime: '2018-07-20T00:00:00Z'
      },
      {
        value2: 23,
        datetime: '2018-08-20T00:00:00Z'
      }
    ]

    const expected = mergeTimeseriesByKey({
      timeseries: [ts2, ts4],
      key: 'datetime'
    })

    expect(expected).toEqual(goodMerged)
  })
})

describe('getEscapedGQLFieldAlias', () => {
  const SLUGS = ['bitcoin', 'bitcoin-cash', 'ab-chain-rtb', '0x']
  const ESCAPED_SLUGS = ['_bitcoin', '_bitcoincash', '_abchainrtb', '_0x']
  it('should correctly escape slugs', () => {
    const escapedSlugs = SLUGS.map(getEscapedGQLFieldAlias)
    expect(escapedSlugs).toEqual(ESCAPED_SLUGS)
  })
})

describe('isEthAddress', () => {
  it('should be eth address', () => {
    expect(
      isEthStrictAddress('0x1f3df0b8390bb8e9e322972c5e75583e87608ec2')
    ).toBeTruthy()
    expect(
      isEthStrictAddress('0x140427a7d27144a4cda83bd6b9052a63b0c5b589')
    ).toBeTruthy()
  })
  it('should not be a valid eth address', () => {
    expect(isEthStrictAddress('0x1f3df0b8390bb8e9e322972c5e75582')).toBeFalsy()
    expect(
      isEthStrictAddress('1f3df0b8390bb8e9e322972c5e75583e87608ec2')
    ).toBeFalsy()
    expect(
      isEthStrictAddress('1f3df0b8390bb8e9e322972c5e75583e87608ec2')
    ).toBeFalsy()
    expect(isEthStrictAddress('asjdfh92ef2boejv')).toBeFalsy()
  })
})

describe('getTimeRangeByDuration', () => {
  it('should calculate time range for 4 hours', () => {
    const goodTimeRange = {
      to: moment()
        .startOf('hour')
        .toISOString(),
      from: moment()
        .startOf('hour')
        .subtract('4', 'h')
        .toISOString(),
      timeWindow: '4h'
    }

    expect(getTimeRangeByDuration('4h')).toEqual(goodTimeRange)
  })

  it('should calculate time range for 2 days', () => {
    const goodTimeRange = {
      to: moment()
        .startOf('hour')
        .toISOString(),
      from: moment()
        .startOf('hour')
        .subtract('2', 'd')
        .toISOString(),
      timeWindow: '2d'
    }

    expect(getTimeRangeByDuration('2d')).toEqual(goodTimeRange)
  })

  it('should calculate time range for 3 weeks', () => {
    const goodTimeRange = {
      to: moment()
        .startOf('hour')
        .toISOString(),
      from: moment()
        .startOf('hour')
        .subtract('3', 'w')
        .toISOString(),
      timeWindow: '3w'
    }

    expect(getTimeRangeByDuration('3w')).toEqual(goodTimeRange)
  })
})
