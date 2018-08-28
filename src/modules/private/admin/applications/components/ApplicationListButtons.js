import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Table, Button } from 'semantic-ui-react';
import { includes } from 'lodash';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';

export default class ApplicationListButtons extends Component {
  onDeleteHandler = (applicationId) => {
    console.log(applicationId);
  }
  render() {
    return (
      <Table.Cell collapsing textAlign="center">
        <Button.Group vertical compact size="mini">
          {!includes(['DELETED', 'REMOVED'], this.props.status) &&
          this.props.appStatus ===
          BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED &&
          <Button color="green">Promote</Button>
          }
          {this.props.appStatus ===
          BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED &&
          <Aux>
            {!includes(['DELETED', 'REMOVED', 'STASH'], this.props.status) &&
            <Button color="green">Stash</Button>
            }
            {includes(['STASH'], this.props.status) &&
            <Button color="green" inverted>Unstash</Button>
            }
          </Aux>
          }
          {includes(['DELETED'], this.props.status) &&
          <Aux>
            <Button color="blue">Restore</Button>
            <Button color="red">Remove</Button>
          </Aux>
          }
          {!includes(['DELETED', 'REMOVED'], this.props.status) &&
          <Button as={Link} to={`${this.props.refLink}/confirm`} color="red">Delete</Button>
          }
          <Button as={Link} to={`${this.props.refLink}/view/${this.props.applicationId}/${this.props.userId}`} color="blue" inverted className="relaxed">View</Button>
        </Button.Group>
      </Table.Cell>
    );
  }
}
