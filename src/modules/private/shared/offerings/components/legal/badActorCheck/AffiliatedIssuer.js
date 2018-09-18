import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Grid } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';
import SecondaryMenu from '../../../../../../../theme/layout/SecondaryMenu';
import AfIssuer from './AfIssuer';

@inject('offeringCreationStore')
@observer
export default class AffiliatedIssuer extends Component {
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName);
  }
  render() {
    const { LEADERSHIP_FRM } = this.props.offeringCreationStore;
    const navItems = [];
    LEADERSHIP_FRM.fields.data.map((leader, index) => {
      navItems.push({ title: `Afiiliated Issuer ${index + 1}`, to: `/${index + 1}` });
      return navItems;
    });
    const { match } = this.props;
    const formName = 'LEADERSHIP_FRM';
    return (
      <div className="inner-content-spacer">
        <Grid>
          <Grid.Column widescreen={4} computer={3} tablet={3} mobile={16}>
            <SecondaryMenu secondary match={match} navItems={navItems} />
            <Button size="small" color="blue" className="link-button mt-20" onClick={e => this.addMore(e, formName)}>+ Add another leader</Button>
          </Grid.Column>
          <Grid.Column widescreen={12} computer={13} tablet={13} mobile={16}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={props =>
                  <AfIssuer refLink={match.url} {...props} index={0} />}
              />
              {
                navItems.map((item, index) => (
                  <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <AfIssuer refLink={match.url} {...props} index={index || 0} />} />
                ))
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
