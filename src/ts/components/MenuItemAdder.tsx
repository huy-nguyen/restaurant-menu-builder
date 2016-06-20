import * as React from 'react';
import {
  IMenuItemMetaData
} from '../utils/Interfaces';
import * as _ from 'lodash';

interface IProps {
  // Callback to be called when user submits new item:
  addItemCallback: (data: IMenuItemMetaData) => void
}

type IState = IMenuItemMetaData;

export default class MenuItemAdder extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = this.getDefaultState();
  }

  private getDefaultState(): IState {
    return {
      category: '',
      name: '',
      description: '',
      isUndercooked: false,
      isVegetarian: false,
      price: 0
    };
  }
  private onNameChange = (e: Event) => {
    this.setState({
      name: (e.target as any).value
    } as IState);
  }
  private onCategoryChange = (e: Event) => {
    this.setState({
      category: (e.target as any).value
    } as IState);
  }
  private onDescriptionChange = (e: Event) => {
    this.setState({
      description: (e.target as any).value
    } as IState);
  }
  private onUndercookedChange = (e: React.FormEvent) => {
    this.setState({
      isUndercooked: (e.target as any).checked
    } as IState)
  }
  private onVegetarianChange = (e: React.FormEvent) => {
    this.setState({
      isVegetarian: (e.target as any).checked
    } as IState)
  }

  private onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.addItemCallback(_.clone(this.state));
    this.setState(this.getDefaultState());
  }
  render() {
    const {category, name, description, isUndercooked, isVegetarian} = this.state;
    return (
      <form className='item-adder form-inline'>
          <legend>Add new menu item</legend>
          {/* First row of inputs::*/}
          <div>
            <div className='form-group'>
              <label className='sr-only' for='item-input-name'>Name: </label>
              <input type='text' placeholder='Name' className='form-control'
                value={name} onChange={this.onNameChange} name='Name' id='item-input-name'/>
            </div>
            <div className='form-group'>
              <label className='sr-only' for='item-input-category'>Category: </label>
              <input type='text' placeholder='Category'  className='form-control'
                value={category} onChange={this.onCategoryChange} name='Category' id='item-input-category'/>
            </div>
          </div>

          {/* Second row of inputs::*/}
          <div>
            <div className='form-group'>
              <label className='sr-only' for='item-input-description'>Description: </label>
              <input type='text' placeholder='Description'  className='form-control'
                value={description} onChange={this.onDescriptionChange} name='Description' id='item-input-description'/>
            </div>
            <div className='checkbox'>
              <label>
                <input type='checkbox' checked={isUndercooked}
                  onChange={this.onUndercookedChange}/>Shows undercooked warning?
              </label>
            </div>
            <div className='checkbox'>
              <label>
                <input type='checkbox' checked={isVegetarian}
                  onChange={this.onVegetarianChange}/>Is Vegetarian?
              </label>
            </div>
          </div>

          {/* Third row of inputs:*/}
          <div>
          <button type='submit' class='btn btn-default' onClick={this.onSubmit}>Add Item</button>
          </div>
      </form>
    );
  }
}
