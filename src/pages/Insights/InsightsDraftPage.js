import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  INSIGHTS_USER_DRAFTS_QUERY,
  DELETE_INSIGHT_MUTATION
} from './InsightsGQL'
import InsightDraftCard from '../../components/Insight/InsightDraftCard'
import {
  filterInsightsOnlyDrafts,
  sortInsightsByUpdateDateDescending
} from './utils'
import styles from './InsightsDraftPage.module.scss'

class InsightsDraftPage extends Component {
  state = {
    deleted: new Set()
  }

  deleteInsightDraft = id => {
    const deleted = new Set([...this.state.deleted, id])

    this.props.deleteInsightDraft({
      variables: {
        id: +id
      }
    })

    this.setState({ deleted })
  }

  render () {
    const { deleted } = this.state
    const { data = {} } = this.props

    const { insights = [] } = data
    const drafts = insights
      .filter(filterInsightsOnlyDrafts)
      .filter(({ id }) => !deleted.has(id))
      .sort(sortInsightsByUpdateDateDescending)

    return (
      <div className={styles.wrapper}>
        {drafts.map(({ id, ...draft }) => (
          <InsightDraftCard
            key={id}
            className={styles.card}
            onDeleteClick={() => this.deleteInsightDraft(id)}
            id={id}
            {...draft}
          />
        ))}
      </div>
    )
  }
}

const mapStateToProps = ({ user }) => ({
  userId: user.data.id
})

const enhance = compose(
  connect(mapStateToProps),
  graphql(DELETE_INSIGHT_MUTATION, { name: 'deleteInsightDraft' }),
  graphql(INSIGHTS_USER_DRAFTS_QUERY, {
    options: ({ userId }) => ({
      variables: {
        userId: +userId
      },
      fetchPolicy: 'cache-and-network'
    })
  })
)

export default enhance(InsightsDraftPage)