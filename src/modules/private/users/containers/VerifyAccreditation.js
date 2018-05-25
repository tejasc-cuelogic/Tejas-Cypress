import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Grid, Button } from 'semantic-ui-react';
import Accreditation from './Accreditation';

@inject('uiStore')
@observer
export default class VerifyAccreditation extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    return (
      <div>
        <Route exact path={`${this.props.match.url}/net-worth`} component={Accreditation} />
        <Modal open closeIcon onClose={this.handleCloseModal} size="tiny" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h2">How are you accredited?</Header>
            <Divider />
            <p>
              Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            </p>
          </Modal.Header>
          <Modal.Content>
            <Grid stackable textAlign="center">
              <Grid.Row columns={2}>
                <Grid.Column>
                  <div className="user-type">
                    <h3>Income</h3>
                    <p>
                      <b>Income of $200k, or $300k</b><br />
                      with spouse, in each of past 2 years and expecting same or more this year
                    </p>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div className="user-type">
                    <h3>Assets</h3>
                    <p>
                      <b>Net worth of $1M</b><br />
                      individually or joint with spouse, excluding your primary residence
                    </p>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider section hidden />
            <Button
              circular
              icon={{ className: 'ns-arrow-right' }}
              className="multistep__btn next active"
              as={Link}
              to={`${this.props.match.url}/net-worth`}
              // onClick={() =>
              //   this.props.uiStore.setDashboardWizardStep('Accreditation')}
            />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
