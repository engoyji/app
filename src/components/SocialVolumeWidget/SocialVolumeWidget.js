import React from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import moment from 'moment'
import { connect } from 'react-redux'
import { SOCIALVOLUME_DATA_FETCH, TOTAL_SOCIALVOLUME_SECRET } from './actions'
import { millify } from '../../utils/formatting'
import WidgetTrend from '../Widget/WidgetTrend'
import styles from './SocialVolumeWidget.module.scss'

const RoundBar = ({ x, y, height }) => (
  <rect x={x} y={y} width='6px' height={height} rx='3' />
)

export class SocialVolumeWidget extends React.Component {
  componentDidMount () {
    this.props.requestTotalSocialVolume()
  }

  render () {
    const {
      data = [],
      trendWord,
      isLoading,
      isScoreOverTime,
      error
    } = this.props

    return (
      <WidgetTrend
        className={styles.wrapper}
        trendWord={trendWord}
        description='social volume score'
        isLoading={isLoading}
        error={error}
        hasData={data.length > 0}
      >
        <ResponsiveContainer width='100%'>
          <BarChart
            data={data}
            margin={{ top: 0, right: -35, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey='datetime'
              interval='preserveStartEnd'
              axisLine={false}
              tickLine={false}
              tickFormatter={date => {
                const tickDate = moment(date)

                return tickDate.isSame(Date.now(), 'year')
                  ? tickDate.format('MMM DD')
                  : tickDate.format('MMM DD YYYY')
              }}
              minTickGap={20}
            />
            <YAxis
              domain={[0, dataMax => dataMax + parseInt(0.35 * dataMax)]}
              orientation='right'
              axisLine={false}
              tickLine={false}
              tickFormatter={count => millify(count, 0)}
            />

            <Bar dataKey='mentionsCount' shape={<RoundBar />} />
          </BarChart>
        </ResponsiveContainer>
      </WidgetTrend>
    )
  }
}

const mapStateToProps = state => ({
  trendWord: state.socialVolume.trendWord,
  data: state.socialVolume.data,
  isLoading: state.socialVolume.isLoading,
  isScoreOverTime: state.socialVolume.isScoreOverTime,
  error: state.socialVolume.error
})

const mapDispatchToProps = dispatch => ({
  requestTotalSocialVolume: () =>
    dispatch({
      type: SOCIALVOLUME_DATA_FETCH,
      payload: TOTAL_SOCIALVOLUME_SECRET
    })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SocialVolumeWidget)
