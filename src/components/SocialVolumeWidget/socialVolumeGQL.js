import gql from 'graphql-tag'

export const socialVolumeGQL = gql`
  query topicSearch($word: String!, $from: DateTime!, $to: DateTime!) {
    telegram: topicSearch(
      source: TELEGRAM
      searchText: $word
      interval: "1d"
      from: $from
      to: $to
    ) {
      chartData {
        mentionsCount
        datetime
      }
    }

    reddit: topicSearch(
      source: REDDIT
      searchText: $word
      interval: "1d"
      from: $from
      to: $to
    ) {
      chartData {
        mentionsCount
        datetime
      }
    }

    professional_traders_chat: topicSearch(
      source: PROFESSIONAL_TRADERS_CHAT
      searchText: $word
      interval: "1d"
      from: $from
      to: $to
    ) {
      chartData {
        mentionsCount
        datetime
      }
    }

    discord: topicSearch(
      source: DISCORD
      searchText: $word
      interval: "1d"
      from: $from
      to: $to
    ) {
      chartData {
        mentionsCount
        datetime
      }
    }
  }
`
