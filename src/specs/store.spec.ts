import getConfiguredStore from '../ts/getConfiguredStore';
import * as _ from 'lodash'

describe('Redux store', () => {
  beforeEach(() => {
    this.store = getConfiguredStore(_.noop);
  })
  afterEach(() => {
    this.store = null;
  })
  it('Store should have correct initial state', () => {
    const storeInitialState = this.store.getState();
    expect(storeInitialState).to.deep.equal({
      items: [],
      fetchStatus: {
        isFetching: false,
        message: null
      }
    })
  })
})
