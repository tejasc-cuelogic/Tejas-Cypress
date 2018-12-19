import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../../shared/PrivateHOC';

@inject('helloWorldStore')
@withRouter
@observer
export default class CatergoriesDetails extends Component {
  render() {
    const { currentRecord } = this.props.helloWorldStore;
    return (
      <PrivateLayout {...this.props}>
        <Card.Group stackable itemsPerRow={1}>
          <Card fluid>
            <Card.Content>
              <div style={{ fontSize: '24px', color: '#666', textAlign: 'center' }}>
                {currentRecord || 'hello'}
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </PrivateLayout>
    );
  }
}
