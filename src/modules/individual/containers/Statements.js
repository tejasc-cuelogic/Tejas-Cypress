import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import SecondaryMenu from '../../../theme/layout/SecondaryMenu';
import MonthlyStatements from '../components/rewards/MonthlyStatements';
import TaxForms from '../components/rewards/TaxForms';
import { FaqWidget } from '../../../theme/common/ImportCommon';

const faqs = [
  {
    id: 1,
    title: 'Are these one-time investments or monthly investments?',
    description: `Funds for your investment will first be taken from the available cash sitting in
    your NextSeed account. If you have insufficient funds in your NextSeed account,
    you will be prompted to request an immediate transfer of funds from your external banking account
    to your NextSeed account.`,
  },
  {
    id: 2,
    title: 'Can I cancel my investment after the closing?',
    description: `Unlike investing in in companies listed on a stock exchange where you can quickly
    and easily trade securities, there is no public market for crowdfunded securities.`,
  },
];

const navItems = [
  { title: 'Monthly Statements', to: 'monthly-statements', component: MonthlyStatements },
  { title: 'Tax Forms', to: 'tax-forms', component: TaxForms },
];

export default class Statements extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
            <SecondaryMenu secondary vertical match={this.props.match} navItems={navItems} />
          </Grid.Column>
          <Grid.Column floated="right" widescreen={12} largeScreen={11} computer={12} tablet={12} mobile={16}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Switch>
                    <Route exact path={this.props.match.url} component={MonthlyStatements} />
                    {
                      navItems.map(item => (
                        <Route path={`${this.props.match.url}/${item.to}`} component={item.component} />
                      ))
                    }
                  </Switch>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column widescreen={12} largeScreen={12} computer={12} tablet={16} mobile={16}>
                  <FaqWidget heading="Tax Forms" faqs={faqs} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
