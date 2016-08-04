import {
  addItem,
  toggleItem
} from '../ts/actions/actions';
import {
  ActionType,
  IMenuItemMetaData,
} from '../ts/utils/Interfaces';
import getConfiguredStore from '../ts/getConfiguredStore';
import sinon = require('sinon');
import sinonChai = require('sinon-chai');

chai.use(sinonChai);


describe('Google Analytics', () => {
  beforeEach(() => {
    // Spy on the analytics tracking function:
    this.spy = sinon.spy()
    this.store = getConfiguredStore(this.spy)
  })

  afterEach(() => {
    this.spy = null;
    this.store = null;
  })

  it('Should send correct tracking message when an item is added', () => {
    const {store} = this;
    const data = {
      category: 'Dessert',
      name: 'Ice Cream',
      description: 'milk and cream',
      price: 1,
      isUndercooked: false,
      isVegetarian: false
    };

    store.dispatch(addItem(data));

    expect(this.spy).to.have.been.calledOnce;
    expect(this.spy).to.have.been.calledWith('send', {
      hitType: 'event',
      eventCategory: 'interaction',
      eventAction: 'ADD_ITEM',
      eventLabel: JSON.stringify(data)
    })
  })

  it('Should send correct tracking message when an item is toggled', () => {
    const {store, spy} = this;
    const data = {
      category: 'Dessert',
      name: 'Ice Cream',
      description: 'milk and cream',
      price: 1,
      isUndercooked: false,
      isVegetarian: false
    };

    store.dispatch(addItem(data));
    const id = store.getState().items[0].id;
    spy.reset();

    store.dispatch(toggleItem(id));

    expect(this.spy).to.have.been.calledOnce;
    expect(this.spy).to.have.been.calledWith('send', {
      hitType: 'event',
      eventCategory: 'interaction',
      eventAction: 'TOGGLE_SELECT',
      eventLabel: id
    })
  })
})
