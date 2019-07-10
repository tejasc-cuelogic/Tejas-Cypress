import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('dataStore', 'uiStore')
@withRouter
@observer
export default class PartialOrCipProcessingList extends Component {
  render() {
    const { partialOrCipAccountList, partialOrCipAccountData } = this.props.dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="CIP Bug Audit" />
        <Card.Content>
          <Card.Description>
            <Button secondary className="mb-10" onClick={() => this.props.dataStore.getListOfPartialOrCIPProcessingAccount()}>Audit CIP Bug</Button>
          </Card.Description>
          {partialOrCipAccountList.length > 0
            ? (
                <>
                  <b>Result:</b>
                  {/* <p className="break-text">{beautify(this.state.users)}</p> */}
                  <div><pre>{JSON.stringify(partialOrCipAccountList, null, 2) }</pre></div>
                </>
            )
            : partialOrCipAccountData.loading ? 'Loading...' : 'No records Found'}
        </Card.Content>
      </Card>
    );
  }
}
