import React from 'react';
import Aux from 'react-aux';
import { Menu, Responsive, Dropdown, Icon, Visibility } from 'semantic-ui-react';
import { matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NavItems } from '../../../theme/layout/NavigationItems';

@inject('campaignStore', 'navStore')
@observer
export default class MobileDropDownNav extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps, nextState);
    return false;
  }
  activeText = () => {
    const { navItems, location, refMatch } = this.props;
    const active = navItems.find((i) => {
      const path = `${refMatch.url}/${i.to}`;
      return matchPath(location.pathname, { path });
    });
    return active ? active.title : this.props.navItems[0].title;
  }
  toggleCampaignSideBar = () => {
    this.props.campaignStore.setFieldValue('campaignSideBarShow', !this.props.campaignStore.campaignSideBarShow);
  }
  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);
  render() {
    const {
      navItems, location, className, navStore, slideUpNot,
    } = this.props;
    const { navStatus } = navStore;
    return (
      <Responsive maxWidth={767} as={Aux}>
        <Visibility offset={[58, 10]} onUpdate={this.handleUpdate} continuous>
          <Menu inverted className={`mobile-dropdown-menu ${className} ${navStatus === 'sub' && !slideUpNot ? 'active' : ''}`}>
            <Dropdown item text={this.activeText()}>
              <Dropdown.Menu>
                <NavItems sub refLoc="public" location={location} navItems={navItems} />
              </Dropdown.Menu>
            </Dropdown>
            {location.pathname.startsWith('/offerings/') &&
              <Icon onClick={this.toggleCampaignSideBar} color="white" className="open-campaign-menu ns-campaign-dashboard" />
            }
          </Menu>
        </Visibility>
      </Responsive>
    );
  }
}
