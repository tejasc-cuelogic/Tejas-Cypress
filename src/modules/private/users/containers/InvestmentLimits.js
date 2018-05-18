import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Card, Statistic, Popup, Icon, Grid, Header, Form, Button, Divider } from 'semantic-ui-react';
import { FormInput } from '../../../../theme/form/FormElements';

@inject('profileStore')
@observer
export default class InvestmentLimits extends Component {
  render() {
    return (
      <div>
        <Header as="h3">Regulation Crowdfunding Limits</Header>
        <p className="intro-text">Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis</p>
        <Grid columns={1} stackable>
          <Grid.Row>
            <Grid.Column widescreen={8} largeScreen={10} computer={13} tablet={16} mobile={16}>
              <Card fluid>
                <Grid stackable celled="internally" padded="horizontally">
                  <Grid.Row>
                    <Grid.Column width={6}>
                      <Card.Content>
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
                          <Statistic.Value>$80,200</Statistic.Value>
                        </Statistic>
                      </Card.Content>
                      <Card.Content>
                        <p className="intro-text">Due to regulations, your investment limit is calculated based on your annual income (AI) and net worth (NW).</p>
                      </Card.Content>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <Card.Content>
                        <Form>
                          <FormInput
                            prefix="$"
                            defaultValue="80,000.00"
                            fielddata={this.props.profileStore.investmentLimits.annualIncome}
                          />
                          <FormInput
                            prefix="$"
                            defaultValue="50,000.00"
                            fielddata={this.props.profileStore.investmentLimits.netWorth}
                          />
                          <FormInput
                            prefix="$"
                            defaultValue="0"
                            fielddata={this.props.profileStore.investmentLimits.otherRegulation}
                          />
                          <Button inverted disabled color="green">Update financial info</Button>
                        </Form>
                      </Card.Content>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card>
            </Grid.Column>
          </Grid.Row>
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
                    <Button as={Link} to={`${this.props.match.url}/add-beneficiaries`} primary content="Verify accreditation" />
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
