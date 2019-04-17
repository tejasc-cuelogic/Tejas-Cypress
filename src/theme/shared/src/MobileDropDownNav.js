import React from 'react';
import Aux from 'react-aux';
import { Menu, Responsive, Dropdown, Icon, Visibility } from 'semantic-ui-react';
import { matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NavItems } from '../../../theme/layout/NavigationItems';

@inject('campaignStore', 'navStore')
@observer
export default class MobileDropDownNav extends React.Component {
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
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);
  render() {
    const {
      navItems, location, className, navStore, slideUpNot, isActive, useIsActive,
    } = this.props;
    const { navStatus } = navStore;
    return (
      <Responsive maxWidth={location.pathname.startsWith('/offerings/') ? 991 : 991} as={Aux}>
        <Visibility offset={[58, 10]} onUpdate={this.handleUpdate} continuous className="visi-two">
          <Menu inverted={this.props.inverted} className={`mobile-dropdown-menu ${className} ${isActive ? 'active' : (!useIsActive && navStatus === 'sub' && !slideUpNot ? 'active' : '')}`}>
            <Dropdown item text={this.activeText()}>
              <Dropdown.Menu>
                <NavItems sub refLoc="public" bonusRewards={this.props.bonusRewards} location={location} isBonusReward={this.props.isBonusReward} countData={this.props.navCountData} navItems={navItems} />
              </Dropdown.Menu>
            </Dropdown>
            {location.pathname.startsWith('/offerings/') &&
              <Icon onClick={this.toggleCampaignSideBar} color="white" className="open-campaign-menu ns-campaign-dashboard" />
            }
          </Menu>
          <div className="animate-placeholder" />
        </Visibility>
      </Responsive>
    );
  }
}
