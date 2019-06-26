import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('helloWorldStore')
@withRouter
@observer
export default class CrowdPayDetails extends Component {
  render() {
    const { currentRecord } = this.props.helloWorldStore;
    return (
      <>
        <Card.Group stackable itemsPerRow={1}>
          <Card fluid>
            <Card.Content>
              <div style={{ fontSize: '24px', color: '#666', textAlign: 'center' }}>
                {currentRecord}
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </>
    );
  }
}
