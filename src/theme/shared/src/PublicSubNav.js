import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Container, Menu, Responsive, Visibility } from 'semantic-ui-react';
import { NavItems } from '../../layout/NavigationItems';
import { MobileDropDownNav } from '../../../theme/shared';
@inject('navStore')
@withRouter
@observer
export default class PublicSubNav extends Component {
  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);
  render() {
    const {
      moreProps, title, location, navItems, match, navStore,
    } = this.props;
    const { navStatus, subNavStatus } = navStore;
    return (
      <Aux>
        <Responsive minWidth={992} as={Aux}>
          <Visibility offset={[72, 10]} onUpdate={this.handleUpdate} continuous>
            <Menu
              secondary
              className={`menu-secondary-fixed ${moreProps ? moreProps.class : ''} ${navStatus === 'sub' ? 'active' : ''} ${subNavStatus}`}
            >
              <Container className={!(moreProps && moreProps.onlyNav) ? 'fluid' : ''}>
                <Menu.Menu
                  secondary
                  className={`menu-secondary ${(moreProps && moreProps.onlyNav) ? '' : 'center-align'}`}
                >
                  <Menu.Item header>{title}:</Menu.Item>
                  <NavItems sub refLoc="public" location={location} navItems={navItems} />
                </Menu.Menu>
              </Container>
            </Menu>
            <div className="animate-placeholder" />
          </Visibility>
        </Responsive>
        <MobileDropDownNav
          inverted
          refMatch={match}
          navItems={navItems}
          navStatus={navStatus}
          location={location}
        />
      </Aux>
    );
  }
}

