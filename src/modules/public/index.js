import React from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Route, Switch } from 'react-router-dom';
import { Segment, Container, Grid } from 'semantic-ui-react';
import { publicRoutes } from './../../modules/routes';
import { uiStore } from '../../services/stores';
import Footer from './../../theme/layout/Footer';

@inject('uiStore')
@observer
export default class Public extends React.Component {
  render() {
    const { location } = this.props;
    return (
      <Aux>
        <Segment vertical className={uiStore.devBanner ? 'content foot-banner' : 'content'}>
          <Container>
            <Grid columns={1}>
              <Grid.Row>
                <Grid.Column className="nsContent">
                  <Switch>
                    {publicRoutes.map(route => (
                      <Route
                        exact={route.exact ? route.exact : false}
                        path={route.path}
                        component={route.auth ?
                          route.auth(route.component, this.props) : route.component}
                        key={route.path}
                      />
                    ))}
                  </Switch>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
        {(location.pathname !== '/business-application' && !location.pathname.startsWith('/auth')) &&
          <Footer />
        }
      </Aux>
    );
  }
}
