import React from 'react';
import { Menu, Responsive, Dropdown, Icon, Visibility } from 'semantic-ui-react';
import { get } from 'lodash';
import { matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NavItems } from '../../layout/NavigationItems';

@inject('campaignStore', 'navStore')
@observer
export default class MobileDropDownNav extends React.Component {
  state = {
    title: '',
  }

  activeText = () => {
    const { navItems, location, refMatch } = this.props;
    const active = navItems.find((i) => {
      const path = `${refMatch.url}/${i.to}`;
      return matchPath(location.pathname, { path });
    });
    const title = active ? active.title : get(this.props, 'navItems[0].title');
    if (title !== this.state.title) {
      if (document.querySelector('.anchor')) {
        document.querySelector('.anchor').scrollIntoView({
          block: 'start',
          behavior: 'smooth',
        });
      } else {
        window.scrollTo(0, 0);
      }
      this.setState({ title });
    }
    return title;
  }

  toggleCampaignSideBar = () => {
    this.props.campaignStore.setFieldValue('campaignSideBarShow', !this.props.campaignStore.campaignSideBarShow);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);

  setActiveHash = hash => this.props.navStore.setFieldValue('currentActiveHash', hash);

  render() {
    const {
      navItems, location, className, navStore, slideUpNot, useIsActive, id, newLayout, refMatch,
    } = this.props;
    const { navStatus, campaignHeaderStatus } = navStore;
    const navItemsComponent = <NavItems newLayout={newLayout} onToggle={hash => this.setActiveHash(hash)} refMatch={refMatch} sub refLoc="public" bonusRewards={this.props.bonusRewards} location={location} isBonusReward={this.props.isBonusReward} countData={this.props.navCountData} navItems={navItems} />;
    return (
      <Responsive maxWidth={991} as={React.Fragment}>
        <Visibility offset={[58, 10]} onUpdate={this.handleUpdate} continuous className={location.pathname.startsWith('/dashboard/') ? 'private-dropdown' : ''}>
          {newLayout ? (
            <Menu text className={`campaign-mobile-menu-v2 ${campaignHeaderStatus ? 'active' : (!useIsActive && navStatus === 'sub' && !slideUpNot ? 'active' : '')}`}>
              {navItemsComponent}
            </Menu>
          )
            : (
              <Menu id={id} inverted={this.props.inverted} className={`mobile-dropdown-menu ${className} ${campaignHeaderStatus ? 'active' : (!useIsActive && navStatus === 'sub' && !slideUpNot ? 'active' : '')}`}>
                <Dropdown item text={this.activeText()}>
                  <Dropdown.Menu>
                    {navItemsComponent}
                  </Dropdown.Menu>
                </Dropdown>
                {location.pathname.startsWith('/offerings/')
                  && <Icon onClick={this.toggleCampaignSideBar} color="white" className="open-campaign-menu ns-campaign-dashboard" />
                }
              </Menu>
            )}
          <div className="animate-placeholder" />
        </Visibility>
      </Responsive>
    );
  }
}
