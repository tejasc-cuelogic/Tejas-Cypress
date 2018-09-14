import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Form, Grid, Divider, Button } from 'semantic-ui-react';
import { ByKeyword } from '../../../../../theme/form/Filters';
import { InlineLoader } from '../../../../../theme/shared';
import Listing from './updates/Listing';
import NewUpdate from './updates/NewUpdate';

@inject('updateStore')
@observer
export default class BonusRewards extends Component {
  componentWillMount() {
    this.props.updateStore.initRequest();
  }
  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.updateStore.setInitiateSrch('keyword', e.target.value);
    }
  }
  render() {
    const { updateStore, match } = this.props;
    const {
      updates, loading, requestState, filters,
    } = updateStore;

    if (loading) {
      return <InlineLoader />;
    }
    return (
      <div className="inner-content-spacer">
        <Form>
          <Grid stackable>
            <Grid.Row>
              <ByKeyword
                executeSearch={this.executeSearch}
                w={[11]}
                placeholder="Search by keyword or phrase"
                requestState={requestState}
                filters={filters}
                more="no"
                addon={
                  <Grid.Column width={5} textAlign="right">
                    <Button color="green" as={Link} floated="right" to={`${match.url}/new`}>
                      Add new Update
                    </Button>
                  </Grid.Column>
                }
              />
            </Grid.Row>
          </Grid>
        </Form>
        <Divider hidden />
        <Listing data={updates} match={match} />
        <Route path={`${match.url}/:id`} render={props => <NewUpdate refLink={match.url} {...props} />} />
      </div>
    );
  }
}
