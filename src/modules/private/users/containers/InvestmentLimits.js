import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Grid, Header, Button, Divider } from 'semantic-ui-react';
import FinancialInfo from '../components/investmentLimits/FinancialInfo';
import VerifyAccreditation from './VerifyAccreditation';

@inject('userDetailsStore')
@observer
export default class InvestmentLimits extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getFinancialLimit();
  }

  render() {
    return (
      <div>
        <Route exact path={`${this.props.match.url}/verify-accreditation`} component={VerifyAccreditation} />
        <Header as="h3">Regulation Crowdfunding Limits</Header>
        <p className="intro-text">Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis</p>
        <Grid columns={1} stackable>
          <FinancialInfo />
        </Grid>
        <Header as="h3">Accreditation</Header>
        <p className="intro-text">Aliquam erat ac ipsum. Integer aliquam purus. Quisque lorem tortor fringilla sed, vestibulum ideoso</p>
        <Grid columns={1} stackable>
          <Grid.Row>
            <Grid.Column widescreen={6} largeScreen={8} computer={13} tablet={16} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Header as="h3">Are you accredited investor?</Header>
                  <p>Verify your accreditation now</p>
                  <Divider hidden />
                  <Card.Description>
                    <Button as={Link} to={`${this.props.match.url}/verify-accreditation`} primary content="Verify accreditation" />
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card fluid>
                <Card.Content>
                  <dl className="dl-horizontal pull-left">
                    <dt>Status</dt>
                    <dd className="positive-text"><b>Verified</b></dd>
                    <dt>Status</dt>
                    <dd className="negative-text"><b>Failed</b></dd>
                    <dt>Accreditation Date</dt>
                    <dd>12/2/17</dd>
                    <dt>Expiration Date</dt>
                    <dd>5/12/19</dd>
                  </dl>
                  <Button primary className="pull-right" content="Update accreditation" />
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
