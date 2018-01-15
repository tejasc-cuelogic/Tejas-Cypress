import React from 'react';
import { Link } from 'react-router-dom';

export default class Sidebar extends React.Component {
  render() {
    return (
      <div className="ui left demo visible vertical inverted sidebar labeled icon menu">
        <Link to="/admin/users-list" className="item">
          <i className="home icon" />
          Users
        </Link>
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
