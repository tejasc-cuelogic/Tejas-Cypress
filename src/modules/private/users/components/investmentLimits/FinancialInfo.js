import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Card, Statistic, Popup, Icon, Form, Button, Divider, Header } from 'semantic-ui-react';
import { FormInput } from '../../../../../theme/form/FormElements';
import Helper from '../../../../../helper/utility';

@inject('userDetailsStore', 'uiStore')
@observer
export default class FinancialInfo extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.userDetailsStore.updateFinInfo();
  }

  render() {
    const {
      FIN_INFO, finInfoEleChange, fLoading,
    } = this.props.userDetailsStore;
    if (fLoading) {
      return <div>loading...</div>;
    }
    return (
      <Grid.Row>
        <Grid.Column widescreen={12} largeScreen={12} computer={14} tablet={16} mobile={16}>
          <Card fluid>
            <Card.Content>
              <Card.Header className="with-icon">
                <Icon color="teal" className="ns-individual-line" /> Individual
                <Icon color="teal" className="ns-ira-line" /> IRA
              </Card.Header>
            </Card.Content>
            <Divider horizontal className="only-border" />
            <Grid stackable celled="internally" padded="horizontally">
              <Grid.Row>
                <Grid.Column width={8}>
                  <Card.Content>
                    <Header as="h3">Regulation Crowdfunding Limits</Header>
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
                    <Divider clearing />
                    <Button inverted color="green" content="Update investment limits" />
                  </Card.Content>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Card.Content>
                    <Form onSubmit={this.submit}>
                      {
                        ['annualIncome', 'netWorth', 'otherInvestments'].map(field => (
                          <FormInput
                            key={field}
                            type="text"
                            prefix="$"
                            name={field}
                            fielddata={FIN_INFO.fields[field]}
                            changed={finInfoEleChange}
                          />
                        ))
                      }
                      <Button loading={this.props.uiStore.inProgress} disabled={!FIN_INFO.meta.isValid} inverted color="green">
                        Update financial info
                      </Button>
                    </Form>
                  </Card.Content>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
