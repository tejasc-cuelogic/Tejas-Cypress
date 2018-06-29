import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Card, Statistic, Popup, Icon, Form, Button } from 'semantic-ui-react';
import { FormInput } from '../../../../../../theme/form';
import Helper from '../../../../../../helper/utility';

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
                      <Statistic.Value>
                        {Helper.CurrencyFormat(FIN_INFO.fields.currentLimit.value)}
                      </Statistic.Value>
                    </Statistic>
                  </Card.Content>
                  <Card.Content>
                    <p className="intro-text">Due to regulations, your investment limit is calculated based on your annual income (AI) and net worth (NW).</p>
                  </Card.Content>
                </Grid.Column>
                <Grid.Column width={10}>
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
