import * as React from 'react';
import MenuItemModel from '../models/MenuItem';
import * as classnames from 'classnames';


interface IProps {
  item: MenuItemModel
  onClick: (id: string) => void;
  onRemove: (id: string) => void
}


// Presentational component that represents a menu item:
const MenuItem = (props: IProps) => {
  const {
    item: {
      id, name, category, description, price,
      isUndercooked, isVegetarian, isSelected
    },
    onClick, onRemove
  } = props;
  const onClickHandler = () => onClick(id);
  const onRemoveHandler = () => onRemove(id);

  const className = classnames('menu-item', {
    'selected': isSelected
  });
  return (
    <li onClick={onClickHandler} className={className}>
      <button className='btn btn-default' onClick={onRemoveHandler}> Delete</button>
      <span className='item-content'>
        <span className='h4 item-name'>{name}</span>: <span>{description}</span>
      </span>
    </li>
  );
}

export default MenuItem;
