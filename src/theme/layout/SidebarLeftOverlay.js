import React from 'react';

const sidebarLeftOverlay = () => {
  const sidebarClasses = 'ui left demo vertical inverted sidebar labeled icon menu uncover visible collapse';
  return (
    <div style={{ top: '58px' }} className={sidebarClasses}>
      <a className="item">
        <i className="block layout icon" />
        <span>Dashboard</span>
      </a>
      <a className="item">
        <i className="gift icon" />
        <span>Bonus Rewards Fulfillment</span>
      </a>
      <a className="item">
        <i className="users icon" />
        <span>User Management</span>
      </a>
      <a className="item">
        <i className="mail icon" />
        <span>Messages</span>
      </a>
      <a className="item">
        <i className="money icon" />
        <span>Banking</span>
      </a>
      <a className="item">
        <i className="settings icon" />
        <span>Settings</span>
      </a>
      <a className="item collapseIcon" role="presentation" >
        <i className="angle double left icon" />
        <span>collapse</span>
      </a>
    </div>
  );
};

export default sidebarLeftOverlay;
