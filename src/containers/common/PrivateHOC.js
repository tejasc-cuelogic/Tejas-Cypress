/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Grid, Header, Image, Button, Icon, Responsive } from 'semantic-ui-react';
import { GetNavMeta } from '../../theme/layout/SidebarNav';
import SecondaryMenu from '../../theme/layout/SecondaryMenu';
import LogoWhite from '../../assets/images/nextseed_logo_white_green.svg';

@inject('userStore', 'uiStore')
@observer
class PrivateHOC extends Component {
  render() {
    const pathInfo = this.props.location.pathname.split('/app/');
    const pageMeta = GetNavMeta(pathInfo[1]);
    const { roles } = toJS(this.props.userStore.currentUser);
    return (
      <Aux>
        <div>
          <div className="page-header-section">
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={4}>
                  {!this.props.match.url.includes('/business-application') &&
                    <Header as="h1">{this.props.forceTitle || pageMeta.heading || pageMeta.title}</Header>
                  }
                  {this.props.match.url.includes('/business-application') &&
                    <Image
                      src={LogoWhite}
                      alt="NextSeed.com"
                      className="logo"
                      verticalAlign="middle"
                      as="a"
                      size="small"
                      href="/"
                    />
                  }
                </Grid.Column>
                {!this.props.match.url.includes('/business-application') &&
                  <Aux>
                    <Grid.Column width={5}>{this.props.P1}</Grid.Column>
                    <Grid.Column width={3} textAlign="center">{this.props.P2}</Grid.Column>
                    <Grid.Column width={3} textAlign="right">{this.props.P3}</Grid.Column>
                    <Grid.Column floated="right" textAlign="right">
                      <span className="item notification">
                        <Icon className="ns-bell" />
                        <span className="unread-count">3</span>
                      </span>
                    </Grid.Column>
                  </Aux>
                }
                {this.props.match.url.includes('/business-application') &&
                  <Grid.Column width={12} textAlign="right">
                    <Button.Group>
                      <Button inverted color="green">Save and Continue later</Button>
                      <Button color="grey" disabled>Submit</Button>
                    </Button.Group>
                  </Grid.Column>
                }
              </Grid.Row>
            </Grid>
          </div>
          {this.props.P4}
          {(pageMeta.subPanel === 1 || this.props.subNav) &&
            <SecondaryMenu match={this.props.match} attached="bottom" className="secondary-menu" navItems={pageMeta.subNavigations} />
          }
        </div>
        <div className="content-spacer">
          {this.props.children}
        </div>
      </Aux>
    );
  }
}

export default PrivateHOC;
