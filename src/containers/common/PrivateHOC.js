import React, { Component } from 'react';
import Aux from 'react-aux';
import { Grid, Button, Icon, Responsive } from 'semantic-ui-react';
import { GetNavMeta } from '../../theme/layout/SidebarNav';
import SecondaryMenu from '../../theme/layout/SecondaryMenu';

class PrivateHOC extends Component {
  render() {
    const pathInfo = this.props.location.pathname.split('/app/');
    const pageMeta = GetNavMeta(pathInfo[1]);
    return (
      <Aux>
        <div>
          <div className="page-header-section">
            <Grid>
              <Grid.Row>
                <Grid.Column width={6}>
                  <h1>{pageMeta.heading || pageMeta.title}</h1>
                </Grid.Column>
                <Grid.Column width={4} floated="right" textAlign="right">
                  <span className="item notification">
                    <Icon name="ns-bell" />
                    <span className="unread-count">3</span>
                  </span>
                  <Button primary floated="right">Invest Now</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
          {this.props.StickyNotification &&
            <div className="top-cta-section">
              <Responsive {...Responsive.onlyComputer}>
                {this.props.StickyNotification}
              </Responsive>
            </div>
          }
          {pageMeta.subPanel === 1 &&
            <SecondaryMenu match={this.props.match} navItems={pageMeta.subNavigations} />
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
