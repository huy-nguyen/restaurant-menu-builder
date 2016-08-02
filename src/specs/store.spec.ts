import getConfiguredStore from '../ts/getConfiguredStore';

describe('Redux store', () => {
  beforeEach(() => {
    this.store = getConfiguredStore();
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
