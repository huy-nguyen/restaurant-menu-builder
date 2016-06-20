import * as React from 'react';
import MenuItem from '../models/MenuItem';
import {
  IContext,
  IStoreState,
  IMenuItem,
  IThunk
} from '../utils/Interfaces';
import {
  toggleItem,
  removeItem,
  addItem
} from '../actions/actions';
import {
  connect,
} from 'react-redux';
import ItemList from './MenuItemList';
import MenuItemAdder from './MenuItemAdder';
import {
  fetchMenuItems
} from '../actions/actions';
import {
  IDispatch
} from 'external-redux';
import {
  getAvailableMenuItems,
  getIsFetchingStatus,
  getErrorMessage
} from '../reducers/reducer';
import {
  // This signature allows for the input to `dispatch` to be a function in
  // addition to being an object:
  IDispatch as IDispatchThunk
}from '~redux-thunk~redux'

// All properties are optional because they will be obtained from the Redux
// store (via the `connect` call below):
interface IProps {
  isFetching?: boolean
  errorMessage?: string
  items?: MenuItem[]
  onItemClick?: (id: string) => void,
  onItemAdd?: (data: IMenuItem) => void,
  onItemRemove?: (id: string) => void,
  fetchItemsCallback?: () => void
}

class Editor extends React.Component<IProps,{}> {
  componentDidMount() {
    this.props.fetchItemsCallback();
  }
  render() {
    const {items, isFetching, errorMessage, onItemClick, onItemAdd, onItemRemove} = this.props;

    // Show loading message if a fetch is in progress. Otherwise show the menu
    // items:
    let content: JSX.Element;
    if (isFetching) {
      // Show spinner if fetch is in progress
      content = (
        <div className='loading'>Loading data...</div>
      );
    } else if (errorMessage) {
      // This means there was an error so show the error message:
      content = (
        <div className='error-message'>{errorMessage}</div>
      );
    } else {
      // Success!
      content = (
        <div>
          <h3>Available Items</h3>
          <ItemList items={items} onClickCallback={onItemClick} onRemoveCallback={onItemRemove }/>
        </div>
      );
    }
    return (
      <div className='editor col-md-6'>
        <h2>Menu Builder</h2>
        <MenuItemAdder addItemCallback={onItemAdd}/>
        {content}
      </div>
    );
  }
}

// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
function mapStateToProps(state: IStoreState): IProps {
  // Note that the computations here make no reference to the structure of the
  // store so this component is protected from changes in the store's structure
  // in the future:
  return {
    items: getAvailableMenuItems(state),
    isFetching: getIsFetchingStatus(state),
    errorMessage: getErrorMessage(state)
  } as IProps;
}

const mapDispatchToProps = (dispatch: IDispatch) => ({
  onItemClick(id: string) {
    dispatch(toggleItem(id))
  },
  onItemRemove(id: string) {
    dispatch(removeItem(id))
  },
  onItemAdd(data: IMenuItem) {
    dispatch(addItem(data));
  },
  fetchItemsCallback() {
    // Execute `fetchMenuItems` immediately because it takes no argument (for
    // now):
    (dispatch as IDispatchThunk)(fetchMenuItems());
  }
} as IProps)


// Subscribe to store's updates:
export default connect(mapStateToProps, mapDispatchToProps)(Editor);
