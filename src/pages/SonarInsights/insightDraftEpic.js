import { Observable } from 'rxjs'
import { handleErrorAndTriggerAction } from '../../epics/utils'
import {
  CREATE_INSIGHT_DRAFT_MUTATION,
  UPDATE_INSIGHT_DRAFT_MUTATION
} from './InsightsGQL'
import * as actions from './actions'

const createDraft$ = ({ title, text, tags }, client) => {
  return Observable.from(
    client.mutate({
      mutation: CREATE_INSIGHT_DRAFT_MUTATION,
      variables: {
        title,
        text,
        tags
      }
    })
  )
}

const updateDraft$ = ({ id, title, text, tags }, client) => {
  return Observable.from(
    client.mutate({
      mutation: UPDATE_INSIGHT_DRAFT_MUTATION,
      variables: {
        id,
        title,
        text,
        tags
      }
    })
  )
}

export const insightDraftUpdateEpic = (action$, store, { client }) =>
  action$.ofType(actions.INSIGHT_DRAFT_UPDATE).switchMap(({ payload }) => {
    console.log('Updating insight')
    return Observable.of(null)

    const { tags, ...rest } = payload
    const normalizedTags = tags.map(({ name }) => name)

    return (payload.id ? updateDraft$ : createDraft$)(
      { tags: normalizedTags, ...rest },
      client
    )
      .switchMap(({ data: { updatedDraft: { id, updatedAt } } }) => {
        return Observable.of({
          type: actions.INSIGHT_DRAFT_UPDATE_SUCCESS,
          payload: {
            id,
            updatedAt
          }
        })
      })
      .catch(handleErrorAndTriggerAction(actions.INSIGHT_DRAFT_UPDATE_FAILED))
  })

export const insightDraftPublishEpic = (action$, store, { client }) =>
  action$.ofType(actions.INSIGHT_DRAFT_PUBLISH).switchMap(({ payload }) => {
    return Observable.from(
      client.mutate({
        mutation: PUBLISH_INSIGHT_DRAFT_MUTATION,
        variables: {
          id: +payload
        }
      })
    )
      .switchMap(({ data: { updatedDraft: { id, updatedAt } } }) => {
        return Observable.of({
          type: actions.INSIGHT_DRAFT_PUBLISH_SUCCESS
        })
      })
      .catch(handleErrorAndTriggerAction(actions.INSIGHT_DRAFT_UPDATE_FAILED))
  })
