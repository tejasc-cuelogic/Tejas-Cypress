import React from 'react';
import { Menu, Responsive, Dropdown, Icon } from 'semantic-ui-react';
import { matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NavItems } from '../../../theme/layout/NavigationItems';

@inject('campaignStore')
@observer
export default class MobileDropDownNav extends React.Component {
  activeText = () => {
    const { navItems, location, refMatch } = this.props;
    const active = navItems.find((i) => {
      const path = `${refMatch.url}/${i.to}`;
      return matchPath(location.pathname, { path, exact: true });
    });
    return active ? active.title : this.props.navItems[0].title;
  }
  toggleCampaignSideBar = () => {
    this.props.campaignStore.setFieldValue('campaignSideBarShow', !this.props.campaignStore.campaignSideBarShow);
  }
  render() {
    const { navItems, location } = this.props;
    return (
      <Responsive maxWidth={767} as={Menu} inverted className="mobile-dropdown-menu">
        <Dropdown item text={this.activeText()}>
          <Dropdown.Menu>
            <NavItems sub refLoc="public" location={location} navItems={navItems} />
          </Dropdown.Menu>
        </Dropdown>
        {location.pathname.startsWith('/offerings/') &&
          <Icon onClick={this.toggleCampaignSideBar} name="address card outline" color="white" className="open-campaign-menu" />
        }
      </Responsive>
    );
  }
}
