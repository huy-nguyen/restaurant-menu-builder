import * as React from 'react';
import * as classnames from 'classnames';
import Editor from './Editor';
import MenuPreview from './MenuPreview';

interface IProps {
}

interface IState {

}

export default class App extends React.Component<IProps, IState> {
  render() {
    return (
      <div id='root container-fluid'>
        <header>
          <h1>Restaurant menu builder</h1>
        </header>
          <div className='row'>
            <Editor/>
            <MenuPreview/>
          </div>
      </div>
    );
  }
}
