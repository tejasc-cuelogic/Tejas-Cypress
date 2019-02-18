import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Button, Container, Grid, Responsive } from 'semantic-ui-react';
import { authStore } from '../../../../services/stores/index';
@inject('authStore')
@observer
export default class Track extends Component {
  render() {
    return (
      <Aux>
        <section className="content-spacer">
          <Container>
            <Grid padded="vertically">
              <Grid.Row>
                <Grid.Column widescreen={8} computer={8} tablet={8} mobile={16} verticalAlign="middle" className="side-section track-left-section">
                  <div>
                    <Header as="h2">Track your investments.</Header>
                    <p className="mb-30">
                       See how you’re doing and reinvest any earnings effortlessly with our
                      <Responsive as={Aux} minWidth={1200}><br /></Responsive>
                       easy-to-use dashboard.
                    </p>
                    <Responsive as={Aux} minWidth={768}>
                      {authStore.isUserLoggedIn === false && <Button as={Link} to="/auth/register-investor" secondary>Sign Up Free</Button>}
                    </Responsive>
                    <Responsive as={Aux} maxWidth={767}>
                      <div className="center-align">
                        {authStore.isUserLoggedIn === false && <Button as={Link} to="/auth/register-investor" secondary>Sign Up Free</Button>}
                      </div>
                    </Responsive>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </section>
        <Responsive as={Aux} maxWidth={767}>
          <section className="banner track mb-50" />
        </Responsive>
      </Aux>
    );
  }
}
