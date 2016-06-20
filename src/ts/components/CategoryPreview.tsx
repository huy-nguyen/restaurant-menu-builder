import * as React from 'react';
import MenuItem from '../models/MenuItem';
import ItemPreview from './ItemPreview';


interface IProps {
  name: string,
  items: MenuItem[]
}

export default function CategoryPreview (props: IProps) {
  const {name, items} = props;

  const displayedItems = items.map((item: MenuItem) => (<ItemPreview item={item} key={item.id}/>));
  return (
    <li className='category-preview'>
      <h4>{name}</h4>
      <ul>
        {displayedItems}
      </ul>
    </li>
  );
}
