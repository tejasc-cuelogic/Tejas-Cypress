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
    if (e.charCode === 13) {
      this.props.updateStore.setInitiateSrch('keyword', e.target.value);
    }
  }
  render() {
    const {
      updateStore, match,
    } = this.props;
    const {
      updates, loading, requestState, filters,
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
                executeSearch={this.executeSearch}
                w={[11]}
                placeholder="Search by keyword or phrase"
                requestState={requestState}
                filters={filters}
                more="no"
                addon={
                  <Grid.Column width={5} textAlign="right">
                    <Modal dimmer="inverted" onClose={this.close} size="large" trigger={<Button color="green" size="small">Add new Update</Button>} closeIcon >
                      <NewUpdate match={match} refLink={match.url} id="new" />
                    </Modal>
                  </Grid.Column>
                }
              />
            </Grid.Row>
          </Grid>
        </Form>
        <div className={isIssuer ? 'ui card fluid' : ''}>
          <Listing data={updates} match={match} />
        </div>
      </Aux>
    );
  }
}
