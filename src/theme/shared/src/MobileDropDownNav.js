import React from 'react';
import { Menu, Responsive, Dropdown } from 'semantic-ui-react';
import { matchPath } from 'react-router-dom';
import { NavItems } from '../../../theme/layout/NavigationItems';

export default class MobileDropDownNav extends React.Component {
  activeText = () => {
    const { navItems, location, refMatch } = this.props;
    const active = navItems.find((i) => {
      const path = `${refMatch}/${i.to}`;
      return matchPath(location.pathname, { path, exact: true });
    });
    return active ? active.title : this.props.navItems[0].title;
  }
  render() {
    const { navItems, location } = this.props;
    return (
      <Responsive maxWidth={767} as={Menu} className="mobile-dropdown-menu">
        <Dropdown item text={this.activeText()}>
          <Dropdown.Menu>
            <NavItems sub refLoc="public" location={location} navItems={navItems} />
          </Dropdown.Menu>
        </Dropdown>
      </Responsive>
    );
  }
}
