import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { Button, Table, Icon, Confirm } from 'semantic-ui-react';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
};

@inject('offeringsStore', 'uiStore')
@withRouter
@observer
export default class Actions extends Component {
  handleAction = (action) => {
    if (action === 'Delete') {
      this.props.uiStore.setConfirmBox(action);
    } else if (action === 'Edit') {
      this.props.history.push(`${this.props.refLink}/edit/${this.props.offeringId}`);
    }
  }

  handleDeleteOffering = () => {
    const { offeringsStore, offeringId } = this.props;
    offeringsStore.deleteOffering(offeringId);
    this.props.uiStore.setConfirmBox('');
  }

  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const { confirmBox } = this.props.uiStore;
    return (
      <Aux>
        <Table.Cell collapsing textAlign="center">
          {Object.keys(actions).map(action => (
            <Button.Group vertical>
              <Button className="link-button" >
                <Icon className={`ns-${actions[action].icon}`} onClick={() => this.handleAction(actions[action].label)} />
              </Button>
            </Button.Group>
          ))}
        </Table.Cell>
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this offering?"
          open={confirmBox.entity === 'Delete'}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteOffering}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
