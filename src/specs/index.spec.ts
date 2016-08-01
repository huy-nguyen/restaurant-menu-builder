import getConfiguredStore from '../ts/getConfiguredStore';
import * as Mocha from 'mocha';
import {expect} from 'chai';

describe('Redux store', () => {
  it('should have correct initial state', () => {
    const store = getConfiguredStore();
    const storeInitialState = store.getState();
    expect(storeInitialState).to.deep.equal({
      items: [],
      fetchStatus: {
        isFetching: false,
        message: null
      }
    })
  })
})
