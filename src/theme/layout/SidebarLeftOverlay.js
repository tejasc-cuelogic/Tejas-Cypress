import React from 'react';

const sidebarLeftOverlay = () => {
  const sidebarClasses = 'ui left demo vertical inverted sidebar labeled icon menu uncover  ';
  return (
    <div style={{ top: '58px' }} className={sidebarClasses}>
      <a className="item">
        <i className="home icon" />
        <span>Home</span>
      </a>
      <a className="item">
        <i className="block layout icon" />
        <span>Topics</span>
      </a>
      <a className="item">
        <i className="smile icon" />
        <span>Friends</span>
      </a>
      <a className="item collapseIcon" role="presentation" >
        <i className="angle double left icon" />
        <span>collapse</span>
      </a>
    </div>
  );
};

export default sidebarLeftOverlay;
