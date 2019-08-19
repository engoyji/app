const ACTIVITIES_LOAD_TIMEOUT = 1000 * 2 // * 60 * 15
const WS_DB_NAME = 'serviceWorkerDb'
const ACTIVITY_CHECKS_STORE_NAME = 'activityChecks'
const PARAMS_CHECKS_STORE_NAME = 'appParams'
const WEB_PUSH_CHANNEL = 'web_push'

console.log('Loading sonar service worker')

let PUBLIC_API_ROUTE
let PUBLIC_FRONTEND_ROUTE
let db
let timeoutId
let isStopped = false

const createActivityChecksTable = () => {
  if (db && !db.objectStoreNames.contains(ACTIVITY_CHECKS_STORE_NAME)) {
    db.createObjectStore(ACTIVITY_CHECKS_STORE_NAME, {
      keyPath: 'id',
      autoIncrement: true
    })
  }
  if (db && !db.objectStoreNames.contains(PARAMS_CHECKS_STORE_NAME)) {
    db.createObjectStore(PARAMS_CHECKS_STORE_NAME, {
      keyPath: 'id',
      autoIncrement: true
    })
  }
}

const createActivitiesDB = () => {
  if (db) {
    createActivityChecksTable()
    loadAndCheckActivities()
    return
  }

  const request = indexedDB.open(WS_DB_NAME, 1)
  request.onerror = event => {
    console.log('The database is opened failed')
  }
  request.onsuccess = event => {
    console.log('The database is opened successfully')
    db = request.result
    createActivityChecksTable()
    loadAndCheckActivities()
  }
  request.onupgradeneeded = event => {
    db = event.target.result
    createActivityChecksTable()
    loadAndCheckActivities()
  }
}

function getFirstValueFromTable (storeName, checkCallback) {
  if (!db) {
    return
  }

  const transaction = db.transaction([storeName])
  const objectStore = transaction.objectStore(storeName)

  const cursorRequest = objectStore.openCursor()

  cursorRequest.onsuccess = event => {
    var cursor = event.target.result
    if (cursor) {
      checkCallback(cursor.value)
    } else {
      checkCallback()
    }
  }

  cursorRequest.onerror = event => {
    console.log('IndexDB cursor failed', event)
  }
}

function removeFromDb (storeName, checkCallback) {
  if (!db) {
    return
  }

  const request = db
    .transaction([storeName], 'readwrite')
    .objectStore(storeName)
    .clear()

  request.onsuccess = event => {
    checkCallback()
  }
  request.onerror = () => {
    console.log('Error during clear IndexDb store')
  }
}

function addToDb (storeName, data, checkCallback) {
  if (!db) {
    return
  }

  const request = db
    .transaction([storeName], 'readwrite')
    .objectStore(storeName)
    .add(data)

  request.onsuccess = event => {
    checkCallback && checkCallback()
  }

  request.onerror = event => {
    console.log('The data has been written failed', event)
    checkCallback && checkCallback()
  }
}

const restart = () => {
  if (!isStopped) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(loadAndCheckActivities, ACTIVITIES_LOAD_TIMEOUT)
  } else {
    console.log("Stopped sonar service worker, can't start")
  }
}

const stop = () => {
  console.log('Stopped sonar service worker')
  clearTimeout(timeoutId)
  isStopped = true
}

const addActivityDateAndRestart = (triggeredAt, newCount, enabled) => {
  addToDb(
    ACTIVITY_CHECKS_STORE_NAME,
    {
      triggeredAt: triggeredAt,
      count: newCount
    },
    enabled ? restart : undefined
  )
}

const showActivitiesNotification = newCount => {
  console.log('show: ', newCount)
  self.registration.showNotification(newCount + ' new activities in Sonar!', {
    body: 'Open to check ' + PUBLIC_FRONTEND_ROUTE + '/sonar/activity',
    badge: '/favicon-96x96.png',
    icon: '/favicon-96x96.png',
    timestamp: new Date()
  })
}

const checkNewActivities = activities => {
  if (activities && activities.length > 0) {
    const loadedTriggeredAt = new Date(activities[0].triggeredAt)

    if (loadedTriggeredAt) {
      getFirstValueFromTable(ACTIVITY_CHECKS_STORE_NAME, data => {
        if (data) {
          const lastSavedTriggeredTime = new Date(data.triggeredAt).getTime()
          const count = activities.reduce((acc, item) => {
            if (new Date(item.triggeredAt).getTime() > lastSavedTriggeredTime) {
              acc++
            }
            return acc
          }, 0)

          const isSameActivities =
            loadedTriggeredAt.getTime() === lastSavedTriggeredTime &&
            data.count === count
          if (isSameActivities) {
            restart()
          } else if (count > data.count) {
            removeFromDb(ACTIVITY_CHECKS_STORE_NAME, () => {
              if (self.registration) {
                showActivitiesNotification(count)
                addActivityDateAndRestart(data.triggeredAt, count, true)
              }
            })
          } else {
            restart()
          }
        } else {
          addActivityDateAndRestart(loadedTriggeredAt, 0, true)
        }
      })
    }
  } else {
    restart()
  }
}

const loadAndCheckActivities = () => {
  const noUrls = !PUBLIC_API_ROUTE || !PUBLIC_FRONTEND_ROUTE
  if (isStopped || noUrls) {
    if (noUrls) {
      loadUrlParams()
    }
    console.log(
      "Can't load sonar activities: ",
      isStopped,
      PUBLIC_API_ROUTE,
      PUBLIC_FRONTEND_ROUTE
    )
    restart()
    return
  }

  console.log('Sonar is loading new activities')

  const from = new Date()
  const query = {
    operationName: 'signalsHistoricalActivity',
    query:
      'query signalsHistoricalActivity($datetime: DateTime!) {  activities: signalsHistoricalActivity(limit: 100, cursor: {type: BEFORE, datetime: $datetime}) {    cursor {      before      after      __typename    }    activity {      triggeredAt      userTrigger {     trigger {    settings }      }    __typename    }    __typename  }}',
    variables: { datetime: from.toISOString() }
  }

  fetch(PUBLIC_API_ROUTE + `/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: '*/*' },
    body: JSON.stringify(query),
    credentials: 'include'
  })
    .then(res => res.json())
    .then(res => {
      const {
        data: { activities: { activity } = {} }
      } = res

      if (activity) {
        const filtered = activity.filter(
          ({
            userTrigger: {
              trigger: {
                settings: { channel }
              }
            }
          }) =>
            Array.isArray(channel)
              ? channel.indexOf(WEB_PUSH_CHANNEL) !== -1
              : channel === WEB_PUSH_CHANNEL
        )

        checkNewActivities(filtered)
      } else {
        restart()
      }
    })
    .catch(error => {
      console.log(error)
      restart()
    })
}

self.addEventListener('message', function (event) {
  const { type, data } = event.data

  if (type) {
    if (type === 'SONAR_FEED_ACTIVITY') {
      removeFromDb(ACTIVITY_CHECKS_STORE_NAME, () => {
        addActivityDateAndRestart(data.lastTriggeredAt, 0, false)
      })
    } else if (type === 'SONAR_FEED_ACTIVITY_STOP') {
      stop()
    } else if (type === 'SONAR_FEED_PARAMS_START') {
      console.log(
        `Started sonar service-worker: ${PUBLIC_API_ROUTE} and ${PUBLIC_FRONTEND_ROUTE}`
      )

      PUBLIC_API_ROUTE = data.PUBLIC_API_ROUTE
      PUBLIC_FRONTEND_ROUTE = data.PUBLIC_FRONTEND_ROUTE
      isStopped = false

      removeFromDb(PARAMS_CHECKS_STORE_NAME, () => {
        addToDb(PARAMS_CHECKS_STORE_NAME, data, restart)
      })
    }
  }
})

const loadUrlParams = () => {
  getFirstValueFromTable(PARAMS_CHECKS_STORE_NAME, data => {
    console.log('Loaded sonar service worker params from DB')
    if (data) {
      const {
        PUBLIC_API_ROUTE: apiRoute,
        PUBLIC_FRONTEND_ROUTE: webRoute
      } = data

      if (apiRoute && webRoute) {
        PUBLIC_API_ROUTE = apiRoute
        PUBLIC_FRONTEND_ROUTE = apiRoute

        restart()
      }
    }
  })
}

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting()) // Activate worker immediately
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim()) // Become available to all pages
  createActivitiesDB()
})
