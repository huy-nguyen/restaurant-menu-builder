import {
  createStore,
  applyMiddleware,
  Middleware,
  compose
} from 'redux';
import {
  IStoreState,
  IAnalyticsPayload,
  IAnalyticsAction
} from './utils/Interfaces';
import {
  saveLocalState
} from './utils/localStorage';
import * as _ from 'lodash';
import * as createLogger from 'redux-logger';
import reducer from './reducers/reducer';
import thunk from 'redux-thunk';
import reduxAnalytics = require('redux-analytics');

declare var process: any;
// Google Analytics tracker:
declare var ga: Function;

// `analyticsTracker` is Google Analytics. It's an argument here simply to allow injection
// in testing:
export default function getConfiguredStore(inputTracker: Function = null) {

  function createTracker(analyticsAction: IAnalyticsAction<any>) {
    const {
      type,
      payload: {
        info
      }
    } = analyticsAction;

    // This weird contraption is needed because:
    // - We need to be able to inject a spy as a tracking function for testing so the tracking
    // function can't be harccoded as `ga` all the time.
    // - The `ga` function is defined twice in the app's lifetime. The first time, it is
    // defined synchronously at the location of the google analytics snippet
    // (so before the execution of the main app code.).
    // However, this function doesn't actually send anything to GA. The `ga` function
    // is then subsequently redefined by the `analytics.js` script loaded from `google-analytics.com`.
    // This is the tracking function we want. The only problem is that the `script` tag for that
    // `analytics.js` script is `async` so the redefinition happens after the app code has initialized.
    // Thus, we can't just set `ga` as the default value for the `inputTracker` argument.
    const actualTrackingFunction = (inputTracker === null) ? ga : inputTracker;

    // If the payload's data is a primitive type, just send it. Otherwise,
    // convert to JSOn string before sending:
    const eventLabel = _.isObject(info) ? JSON.stringify(info) : info;

    actualTrackingFunction('send', {
      hitType: 'event',
      eventCategory: 'interaction',
      eventAction: type,
      eventLabel
    })
  }
  const analyticsMiddleware = reduxAnalytics(createTracker) as Middleware

  let middlewares: Middleware[];
  try {
    if (process.env.NODE_ENV === 'development') {
      // Add logger middleware in dev mode only:
      middlewares = [thunk as Middleware, createLogger() as Middleware];
    } else if (process.env.NODE_ENV === 'test') {
      // Include analytics for for unit testing:
      middlewares = [thunk as Middleware, analyticsMiddleware];
    } else {
      // Of course, analytics in production:
      middlewares = [thunk as Middleware, analyticsMiddleware];
    }
  } catch(e) {
    if (e.name === 'ReferenceError') {
      console.log(e);
      console.log('Must define the value of process.env.NODE_ENV global variable in webpack config. Treat as "development" for now.');
      middlewares = [thunk as Middleware, createLogger() as Middleware];
    } else {
      throw e;
    }
  }

  const enhancers = applyMiddleware(...middlewares);

  // Redux store:
  const store = createStore<IStoreState>(
    reducer, {
      // Let the store start out with an empty list of items:
      items: undefined,
      fetchStatus: undefined
  } as IStoreState, enhancers)

  // Persist the state to `localStorage` whenever the state changes but not more
  // often than every 2 seconds:
  // store.subscribe(_.throttle((state: IStoreState) => {
  //   saveLocalState(state);
  // }, 2000));
  return store;
}
