import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid, Card, Statistic, Popup, Icon, Button, Divider, Header } from 'semantic-ui-react';
// import { FormInput } from '../../../../../theme/form/FormElements';
import Helper from '../../../../../../helper/utility';

@inject('userDetailsStore', 'uiStore')
@withRouter
@observer
export default class FinancialInfo extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.userDetailsStore.updateFinInfo();
  }
  handleUpdateInvestmentLimit =(e, accountType) => {
    e.preventDefault();
    console.log(accountType);
    this.props.history.push(`${this.props.match.url}/update`);
  }
  render() {
    const {
      FIN_INFO, fLoading,
    } = this.props.userDetailsStore;
    if (fLoading) {
      return <div>loading...</div>;
    }
    return (
      <Aux>
        <Grid.Row>
          <Grid.Column widescreen={12} largeScreen={16} computer={16} tablet={16} mobile={16}>
            <Card fluid>
              <Card.Content>
                <Card.Header className="with-icon">
                  <Icon color="teal" className="ns-individual-line" /> Individual
                  <Icon color="teal" className="ns-ira-line" /> IRA
                </Card.Header>
              </Card.Content>
              <Divider horizontal className="only-border" />
              <Grid celled="internally" padded="horizontally" stackable>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Card.Content>
                      <Header as="h4">Regulation Crowdfunding Limits</Header>
                      <p className="intro-text">
                        Pellentesque facilisis. Nulla imperdiet sit amet magna.
                        Vestibulum dapibus, mauris nec malesuada fames ac turpis
                        Pellentesque facilisis. Nulla imperdiet sit amet
                      </p>
                      <Statistic size="tiny">
                        <Statistic.Label>
                          Your current investment limit
                          <Popup
                            trigger={<Icon className="ns-help-circle" />}
                            content="Your current investment limit as of today"
                            position="top center"
                            className="center-align"
                          />
                        </Statistic.Label>
                        <Statistic.Value>
                          {Helper.CurrencyFormat(FIN_INFO.fields.currentLimit.value)}
                        </Statistic.Value>
                      </Statistic>
                      <Divider clearing hidden />
                      <Button onClick={e => this.handleUpdateInvestmentLimit(e, 1)} inverted color="green" content="Update investment limits" />
                    </Card.Content>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Card.Content>
                      <Header as="h4">Accreditation</Header>
                      <p className="intro-text">This will trigger a modal of 3-4 steps, and show a status</p>
                      <Divider hidden />
                      <Card.Description>
                        <Button primary content="Verify accreditation" />
                      </Card.Description>
                    </Card.Content>
                    <Card.Content>
                      <Header as="h4">Reg A+ Elligible</Header>
                      <p className="intro-text">This will trigger a modal of 3-4 steps, and show a status</p>
                      <Divider hidden />
                      <Card.Description>
                        <Button primary content="Verify accreditation" />
                      </Card.Description>
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column widescreen={12} largeScreen={16} computer={16} tablet={16} mobile={16}>
            <Card fluid>
              <Card.Content>
                <Card.Header className="with-icon">
                  <Icon color="teal" className="ns-entity-line" /> Entity
                </Card.Header>
              </Card.Content>
              <Divider horizontal className="only-border" />
              <Grid celled="internally" padded="horizontally" stackable>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Card.Content>
                      <Header as="h4">Regulation Crowdfunding Limits</Header>
                      <p className="intro-text">
                        Pellentesque facilisis. Nulla imperdiet sit amet magna.
                        Vestibulum dapibus, mauris nec malesuada fames ac turpis
                        Pellentesque facilisis. Nulla imperdiet sit amet
                      </p>
                      <Statistic size="tiny">
                        <Statistic.Label>
                          Your current investment limit
                          <Popup
                            trigger={<Icon className="ns-help-circle" />}
                            content="Your current investment limit as of today"
                            position="top center"
                            className="center-align"
                          />
                        </Statistic.Label>
                        <Statistic.Value>$50,000.00</Statistic.Value>
                      </Statistic>
                      <Divider clearing hidden />
                      <Button onClick={e => this.handleUpdateInvestmentLimit(e, 2)} inverted color="green" content="Update investment limits" />
                    </Card.Content>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Card.Content>
                      <Header as="h4">Accreditation <Link to="/" className="link"><small>Update accreditation</small></Link></Header>
                      <dl className="dl-horizontal">
                        <dt>Status</dt>
                        <dd className="negative-text"><b>Failed</b></dd>
                        <dt>Date</dt>
                        <dd>12/2/12</dd>
                      </dl>
                    </Card.Content>
                    <Card.Content>
                      <Header as="h4">Reg A+ Elligible</Header>
                      <dl className="dl-horizontal">
                        <dt>Status</dt>
                        <dd className="positive-text"><b>Verified</b></dd>
                        <dt>Date</dt>
                        <dd>12/2/12</dd>
                      </dl>
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Aux>
    );
  }
}
