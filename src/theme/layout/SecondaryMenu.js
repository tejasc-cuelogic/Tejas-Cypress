import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List } from 'semantic-ui-react';

class SecondaryMenu extends Component {
  render() {
    return (
      <div className="secondary-menu">
        <List celled horizontal inverted>
          {
            this.props.navItems.map(item => (
              <Link
                className={`item ${this.props.active.includes(item.to) ? 'active' : ''}`}
                as="a"
                to={`/app/${this.props.parent}/${item.to}`}
              >
                {item.title}
              </Link>
            ))
          }
        </List>
      </div>
    );
  }
}

export default SecondaryMenu;
