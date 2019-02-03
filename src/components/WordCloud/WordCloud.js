import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import TagCloud from 'react-tag-cloud'
import HelpPopupWordCloud from './HelpPopupWordCloud'
import WidgetTrend from '../Widget/WidgetTrend'
import styles from './WordCloud.module.scss'

const WORD_BIG = {
  color: '#7a859e',
  fontSize: 28
}

const WORD_MEDIUM = {
  color: '#7a859e',
  fontSize: 20
}

const WORD_SMALL = {
  fontSize: 12
}

const getWordStyles = index => {
  switch (index) {
    case 0:
      return WORD_BIG
    case 1:
    case 2:
      return WORD_MEDIUM
    default:
      return WORD_SMALL
  }
}

export const WordCloud = ({
  cloud = [],
  searchWord,
  isLoading,
  error,
  className = ''
}) => {
  return (
    <WidgetTrend
      className={className}
      trendWord={searchWord}
      description={
        <Fragment>
          social context
          <HelpPopupWordCloud />
        </Fragment>
      }
      isLoading={isLoading}
      error={error}
      hasData={cloud.length > 0}
    >
      <TagCloud
        style={{ width: '95%', height: '85%', padding: 10, marginTop: 0 }}
      >
        {cloud.map(({ word }, index) => (
          <div
            key={word}
            style={getWordStyles(index)}
            className={`${styles.text}`}
          >
            {word}
          </div>
        ))}
      </TagCloud>
    </WidgetTrend>
  )
}

const mapStateToProps = (state, ownProps) => ({
  cloud: state.wordCloud.cloud || ownProps.cloud,
  isLoading: state.wordCloud.isLoading,
  error: state.wordCloud.error,
  searchWord: state.wordCloud.word
})

export default connect(mapStateToProps)(WordCloud)
