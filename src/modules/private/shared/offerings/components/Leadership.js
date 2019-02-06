import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Button } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { FaqWidget } from '../../../../../theme/shared';
import Leader from './leadership/Leader';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Leadership extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/leader/1`);
    }
    if (!this.props.offeringCreationStore.initLoad.includes('LEADERSHIP_FRM')) {
      this.props.offeringCreationStore.setFormData('LEADERSHIP_FRM', false);
    }
  }
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, 'leadership');
    const { LEADERSHIP_FRM } = this.props.offeringCreationStore;
    const leaderCount = LEADERSHIP_FRM.fields.leadership.length;
    this.props.history.push(`${this.props.match.url}/leader/${leaderCount}`);
  }
  render() {
    const { match } = this.props;
    const { LEADERSHIP_FRM } = this.props.offeringCreationStore;
    const navItems = [];
    const formName = 'LEADERSHIP_FRM';
    LEADERSHIP_FRM.fields.leadership.map((leader, index) => {
      navItems.push({ title: `Leader ${index + 1}`, to: `leader/${index + 1}` });
      return navItems;
    });
    const faqsOfModule = [
      {
        id: 1,
        title: 'Who does a “Control Person” include?',
        description: `1. An officer, director, general partner or managing member of the company
        2. A person or entity that owns 20% or more of the voting securities of the company
        3. Any predecessor of the company or any affiliated company
        4. Any promoter connected with the company in any capacity
        5. Any person that has been paid or will be paid for solicitation of purchasers in connection with the offering
        6. Any control person of the person described in (5). `,
      },
    ];
    const { isIssuer } = this.props.userStore;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'inner-content-spacer' : ''}>
        <Grid>
          <Grid.Column widescreen={4} computer={3} tablet={3} mobile={16}>
            <div className="sticky-sidebar">
              <SecondaryMenu secondary vertical match={match} navItems={navItems} />
              {LEADERSHIP_FRM.fields.leadership.length < 5 &&
              <Button size="small" color="blue" className="link-button mt-20" onClick={e => this.addMore(e, formName)}>+ Add another leader</Button>
              }
              <FaqWidget fullHeading="FAQ" faqs={faqsOfModule} />
            </div>
          </Grid.Column>
          <Grid.Column widescreen={12} computer={13} tablet={13} mobile={16}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={props =>
                  <Leader refLink={match.url} {...props} index={0} />}
              />
              {
                navItems.map((item, index) => (
                  <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <Leader refLink={match.url} {...props} index={index || 0} />} />
                ))
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
