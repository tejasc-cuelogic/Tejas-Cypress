import React from 'react';

export default class Sidebar extends React.Component {
  render() {
    return (
      <div className="ui left demo vertical inverted sidebar labeled icon menu">
        <a className="item">
          <i className="home icon" />
          Home
        </a>
        <a className="item">
          <i className="block layout icon" />
          Topics
        </a>
        <a className="item">
          <i className="smile icon" />
          Friends
        </a>
      </div>
    );
  }
}
