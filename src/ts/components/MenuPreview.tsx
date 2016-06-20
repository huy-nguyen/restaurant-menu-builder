import * as React from 'react';
import {
  getAvailableMenuItems
} from '../reducers/reducer';
import {
  IStoreState
} from '../utils/Interfaces';
import MenuItem from '../models/MenuItem';
import {
  connect
} from 'react-redux';
import * as _ from 'lodash';
import CategoryPreview from './CategoryPreview';

interface IProps {
  selectedItems?: MenuItem[]
}

interface IState {

}
class MenuPreview extends React.Component<IProps, IState> {
  render() {
    const {selectedItems} = this.props;

    // Group the items by their category:
    const grouped = _.groupBy(selectedItems, (item: MenuItem) => item.category) as _.Dictionary<MenuItem[]>;

    const categories = _.map(grouped, (items: MenuItem[], categoryName: string) => (
      <CategoryPreview name={categoryName} items={items} key={categoryName}/>
    ));

    return (
      <div className='col-md-6'>
        <h2>Menu Preview</h2>
        <ul>
          {categories}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state: IStoreState): IProps {
  return {
    selectedItems: getAvailableMenuItems(state).filter((item: MenuItem) => item.isSelected)
  }
}

export default connect(mapStateToProps, null)(MenuPreview);

