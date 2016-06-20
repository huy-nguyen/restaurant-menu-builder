import * as React from 'react';
import MenuItem from '../models/MenuItem';
import * as _String from 'underscore.string';


interface IProps {
  item: MenuItem
}

export default function ItemPreview (props: IProps) {
  const {item: {
    name, description, price, isUndercooked, isVegetarian
  }} = props;
  const formattedPrice = _String.numberFormat(price, 2);

  let undercookedWarning: JSX.Element;
  if (isUndercooked) {
    undercookedWarning = (
      <span className='undercooked'>May be undercooked</span>
    );
  } else {
    undercookedWarning = null;
  }

  let vegetarianInfo: JSX.Element;
  if (isVegetarian) {
    vegetarianInfo = (
      <span className='vegetarian'>Vegetarian</span>
    );
  } else {
    vegetarianInfo = null;
  }

  return (
    <li className='item-preview'>
      <h5 className='item-title'>{name}<small>${formattedPrice}</small></h5>
      <p className='item-description'>{description}</p>
      <p className='info'>
        {vegetarianInfo}
        {undercookedWarning}
      </p>
    </li>
  );
}
