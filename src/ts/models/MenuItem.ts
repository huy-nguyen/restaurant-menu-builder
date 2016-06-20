import {
  IMenuItemRaw,
  IMenuItem,
  IMenuItemSerialized
} from '../utils/Interfaces';
import * as _ from 'lodash';

export default class MenuItem implements IMenuItem {
  // For the meaning of these properties, see the definition of IMenuItem:
  category: string
  name: string
  description: string
  price: number
  isUndercooked: boolean
  isVegetarian: boolean
  isSelected: boolean = true
  id: string

  // Constructor signature for taking in raw data from the API
  constructor(
    // raw data from API response:
    rawData: IMenuItemRaw,
    // UUID string for this item:
    id: string);

  // Constructore signature to be used when taking in data from user's input
  // fields:
  constructor(parsedData: IMenuItem, id: string);

  constructor(...args: any[]) {
    let [data, id] = args;
    if ((data as IMenuItemRaw).Category) {
      // This means the first constructore signature was used:
      const {Category, Name, Description,
        Price, Vegetarian} = data as IMenuItemRaw;
      this.category = Category;
      this.name = Name;
      this.description = Description;
      this.price = Price;
      this.isUndercooked = !!data['Undercooked Warning'];
      this.isVegetarian = !!Vegetarian;
    } else {
      // The second cosntructor signature was used:
      const {category, name, description, price,
              isUndercooked, isVegetarian} = data as IMenuItem;
      this.category = category;
      this.name = name;
      this.description = description;
      this.price = price;
      this.isUndercooked = isUndercooked;
      this.isVegetarian = isVegetarian;
    }
    this.id = id;
  }

  // Return a deep clone of this item:
  clone(): MenuItem {
    return MenuItem.deserialize(this.serialize());
  }

  /** Two functions for JSON serialization/deserialization */

  // Return a representation of a menu item that only consists of primitive data
  // types so that the item can be `JSON.stringify`ed and put into
  // `localStorage`:
  serialize(): IMenuItemSerialized {
    const {category, name, description, price,
      isUndercooked, isVegetarian, isSelected, id} = this;
    return {
      category,
      name,
      description,
      price,
      isUndercooked,
      isVegetarian,
      isSelected,
      id
    };
  }

  // Inverse function of the one above:
  static deserialize(serializedData: IMenuItemSerialized): MenuItem {
    const {category, name, description, price,
      isUndercooked, isVegetarian, isSelected, id} = serializedData;
    return new MenuItem({
      category,
      name,
      description,
      price,
      isUndercooked,
      isVegetarian,
      isSelected
    }, id);
  }
}

