import React from 'react';
import { Link } from 'react-router-dom';

const userModuleSubheader = () => (
  <div className="page-header-section">
    <div className="ui grid">
      <div className="four wide column">
        <h3>James Wright</h3>
      </div>
      <div className="four wide column">
        search panel
      </div>
      <div className="four wide column">
        <Link to="/app/users/new">Add new user</Link>
      </div>
    </div>
    <div className="ui grid">
      <div className="twelve wide column userDetailsLinks">
        <Link to="/users/new">Account data</Link>
        <Link to="/users/new">Activity</Link>
        <Link to="/users/new">Investments</Link>
        <Link to="/users/new">Forms</Link>
        <Link to="/users/new">Referrals</Link>
        <Link to="/users/new">Messages</Link>
      </div>
    </div>
  </div>
);

export default userModuleSubheader;
