import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Button } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import Leader from './leadership/Leader';

@inject('offeringCreationStore')
@observer
export default class Leadership extends Component {
  componentWillMount() {
    if (this.props.match.isExist) {
      this.props.history.push('./leader/1');
    }
  }
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName);
  }
  render() {
    const { match } = this.props;
    const { LEADERSHIP_FRM } = this.props.offeringCreationStore;
    const navItems = [];
    const formName = 'LEADERSHIP_FRM';
    LEADERSHIP_FRM.fields.data.map((leader, index) => {
      navItems.push({ title: `Leader ${index + 1}`, to: `leader/${index + 1}` });
      return navItems;
    });
    return (
      <div className="inner-content-spacer">
        <Grid>
          <Grid.Column widescreen={4} computer={3} tablet={3} mobile={16}>
            <SecondaryMenu secondary vertical match={match} navItems={navItems} />
            <Button size="small" color="blue" className="link-button" onClick={e => this.addMore(e, formName)}>+ Add another leader</Button>
          </Grid.Column>
          <Grid.Column widescreen={12} computer={13} tablet={13} mobile={16}>
            <Switch>
              <Route exact path={match.url} render={props => <Leader {...props} />} />
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
