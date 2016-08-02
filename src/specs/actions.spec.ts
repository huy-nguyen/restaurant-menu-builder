import getConfiguredStore from '../ts/getConfiguredStore';
import {
  addItem,
  removeItem,
  toggleItem,
  fetchMenuItems
} from '../ts/actions/actions';
import {
  ActionType,
  IMenuItemMetaData,
  IStoreState
} from '../ts/utils/Interfaces';
import MenuItem from '../ts/models/MenuItem';
import * as _ from 'lodash';
import {Store} from 'redux';
import configureMockStore = require('redux-mock-store');
import thunk from 'redux-thunk';
import sinon = require('sinon');
import chaiDeepMatch = require('chai-deep-match');

console.log(chai.use);
chai.use(chaiDeepMatch);

function extractReadData(item: MenuItem) {
  return _.omit(item.serialize(), ['id']);
}

function addIsSelected(item: IMenuItemMetaData, isSelected: boolean) {
  return _.extend(item, {
  isSelected
  });
}

type StoreType = Store<IStoreState>;

describe('Synchronoous actions', () => {
  beforeEach(() => {
    this.store = getConfiguredStore();
  })
  afterEach(() => {
    this.store = null;
  })

  it('Correctly add item', () => {
    const data = {
      category: 'Dessert',
      name: 'Ice Cream',
      description: 'milk and cream',
      price: 1,
      isUndercooked: false,
      isVegetarian: false
    } as IMenuItemMetaData;
    this.store.dispatch(addItem(data));
    const items = this.store.getState().items;
    expect(items).to.have.length(1);
    expect(extractReadData(items[0])).to.deep.equal(addIsSelected(data, true));
  })

  it('Correctly remove item', () => {
    const store = this.store as StoreType;
    const data1 = {
      category: 'Dessert',
      name: 'Ice Cream',
      description: 'milk and cream',
      price: 1,
      isUndercooked: false,
      isVegetarian: false
    } as IMenuItemMetaData;
    const data2 = {
      category: 'Meze',
      name: 'mussels',
      description: 'giant couscous, fennel, ginger',
      price: 10,
      isUndercooked: true,
      isVegetarian: false
    } as IMenuItemMetaData;

    // Add 2 items
    store.dispatch(addItem(data1));
    store.dispatch(addItem(data2));
    const beforeRemove = store.getState().items;
    expect(beforeRemove).to.have.length(2);

    // Then remove the first one
    store.dispatch(removeItem(beforeRemove[0].id));
    const afterFirstRemoval = store.getState().items;
    expect(afterFirstRemoval).to.have.length(1);
    expect(extractReadData(afterFirstRemoval[0])).to.deep.equal(addIsSelected(data2, true));

    // Them remove the last one:
    store.dispatch(removeItem(afterFirstRemoval[0].id));
    const afterLastRemoval = store.getState().items;
    expect(afterLastRemoval).to.have.length(0);
  })
})

describe('Async actions', () => {

  beforeEach(() => {
    this.server = sinon.fakeServer.create();
  })

  afterEach(() => {
    this.server.restore();
  })

  it('fetch action should fire off a correct sequence of actions on success', (done: any) => {
    const server = this.server;
    const responseData = [
      {
        "Category": "Meyhane Snacks",
        "Name": "parsnip fritter ",
        "Description": "cilantro, walnut, sesame, pepitas  ",
        "Price": 5,
        "Undercooked Warning": 0,
        "Vegetarian": 1
      },
      {
        "Category": "Meyhane Snacks",
        "Name": "beef jerky",
        "Description": "date molasses, Turkish spices",
        "Price": 7,
        "Undercooked Warning": 0,
        "Vegetarian": 0
      }
    ];
    server.respondWith('GET', /menu_items\.json/,
      [200, {}, JSON.stringify(responseData)]
    );

    // Create mocked store with correct initial state:
    const middlewares = [thunk];
    const mockStore = (configureMockStore as any)(middlewares);
    const store = mockStore({
        items: [],
        fetchStatus: {
        isFetching: false,
        message: null
      }
    });


    store.dispatch(fetchMenuItems()).then(() => {
      const actions = store.getActions();
      expect(actions).to.have.length(2);
      expect(actions[0]).to.deep.match({
        type: ActionType.FETCH_BEGIN
      });
      expect(actions[1]).to.deep.match({
        type: ActionType.FETCH_SUCCESS_REMOTE
      });
      done()
    })

    // Make fake server fire off response:
    server.respond();
  })
})
