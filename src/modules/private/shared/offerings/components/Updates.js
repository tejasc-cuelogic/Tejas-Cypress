import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Form, Grid, Button } from 'semantic-ui-react';
import { ByKeyword } from '../../../../../theme/form/Filters';
import { InlineLoader } from '../../../../../theme/shared';
import Listing from './updates/Listing';
import NewUpdate from './updates/NewUpdate';

@inject('updateStore', 'userStore')
@withRouter
@observer
export default class BonusRewards extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.updateStore.initRequest();
    }
  }

  executeSearch = (e) => {
    this.props.updateStore.setInitiateSrch('keyword', e.target.value);
  }

  addEditUpdate = (action) => {
    this.props.history.push(`${this.props.match.url}/${action}`);
  }

  render() {
    const {
      updateStore, match,
    } = this.props;
    const {
      updates, loading, requestState, filters, count,
    } = updateStore;
    const { isIssuer } = this.props.userStore;
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form className={!isIssuer ? 'search-filters more inner-content-spacer' : ''}>
          <Grid stackable className="bottom-aligned">
            <Grid.Row>
              <ByKeyword
                change={this.executeSearch}
                w={[11]}
                placeholder="Search by keyword or phrase"
                requestState={requestState}
                filters={filters}
                more="no"
                addon={(
                  <Grid.Column width={5} textAlign="right">
                    <Button color="green" size="small" onClick={() => this.addEditUpdate('new')}>Add new Update</Button>
                  </Grid.Column>
                )}
              />
            </Grid.Row>
          </Grid>
        </Form>
        <Switch>
          <Route exact path={match.url} render={props => <Listing data={updates} count={count} match={match} requestState={requestState} {...props} />} />
          <Route exact path={`${match.url}/:action?/:id?`} render={props => <NewUpdate match={match} refLink={match.url} {...props} />} />
        </Switch>
      </Aux>
    );
  }
}
