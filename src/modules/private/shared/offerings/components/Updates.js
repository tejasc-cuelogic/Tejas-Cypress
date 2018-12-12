import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Form, Grid, Button, Modal } from 'semantic-ui-react';
import { ByKeyword } from '../../../../../theme/form/Filters';
import { InlineLoader } from '../../../../../theme/shared';
import Listing from './updates/Listing';
import NewUpdate from './updates/NewUpdate';

@inject('updateStore', 'userStore')
@observer
export default class BonusRewards extends Component {
  componentWillMount() {
    this.props.updateStore.initRequest();
  }
  executeSearch = (e) => {
    this.props.updateStore.setInitiateSrch('keyword', e.target.value);
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
                addon={
                  <Grid.Column width={5} textAlign="right">
                    <Modal closeOnEscape={false} closeOnDimmerClick={false} dimmer="inverted" size="large" trigger={<Button color="green" size="small">Add new Update</Button>} >
                      <NewUpdate match={match} refLink={match.url} id="new" />
                    </Modal>
                  </Grid.Column>
                }
              />
            </Grid.Row>
          </Grid>
        </Form>
        <div className={isIssuer ? 'ui card fluid' : ''}>
          <Listing data={updates} count={count} match={match} requestState={requestState} />
        </div>
      </Aux>
    );
  }
}
