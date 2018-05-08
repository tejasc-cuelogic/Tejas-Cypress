import React, { Component } from 'react';
import Aux from 'react-aux';
import { Grid, Button, Icon } from 'semantic-ui-react';
import { GetNavMeta } from '../../theme/layout/SidebarNav';
import SecondaryMenu from '../../theme/layout/SecondaryMenu';

class PrivateHOC extends Component {
  render() {
    const pathInfo = this.props.location.pathname.split('/app/page/');
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
          {pageMeta.subPanel === 1 &&
            <SecondaryMenu active={pathInfo[pathInfo.length - 1]} parent={`page/${pageMeta.to}`} navItems={pageMeta.subNavigations} />
          }
        </div>
        <div className="content-spacer">
          <Grid columns={1} stackable>
            {this.props.children}
          </Grid>
        </div>
      </Aux>
    );
  }
}

export default PrivateHOC;
