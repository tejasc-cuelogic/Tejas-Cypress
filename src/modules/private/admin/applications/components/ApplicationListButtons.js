import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Table, Button } from 'semantic-ui-react';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';

export default class ApplicationListButtons extends Component {
  render() {
    const {
      applicationId, id, applicationStatus, prequalStatus, userId, stashed, deleted,
    } = this.props.application;
    const appId = applicationId || id;
    const appStatus = applicationStatus || prequalStatus;
    return (
      <Table.Cell collapsing textAlign="center">
        <Button.Group vertical compact size="mini">
          {!deleted
          && appStatus
          === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED
          && <Button as={Link} to={`${this.props.refLink}/${appId}/new/${appStatus}/PROMOTE/confirm`} color="green">Promote</Button>
          }
          {appStatus
          === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED
          && (
          <Aux>
            {!stashed
            && <Button color="green" as={Link} to={`${this.props.refLink}/${appId}/${userId}/${appStatus}/STASH/confirm`}>Stash</Button>
            }
            {stashed
            && <Button as={Link} to={`${this.props.refLink}/${appId}/${userId}/${appStatus}/UNSTASH/confirm`} color="green" inverted>Unstash</Button>
            }
          </Aux>
          )
          }
          {deleted
          && (
          <Aux>
            <Button as={Link} to={`${this.props.refLink}/${appId}/${userId || 'new'}/${appStatus}/RESTORE/confirm`} color="blue">Restore</Button>
            <Button as={Link} to={`${this.props.refLink}/${appId}/${userId || 'new'}/${appStatus}/REMOVED/confirm`} color="red">Remove</Button>
          </Aux>
          )
          }
          {!deleted
          && <Button as={Link} to={`${this.props.refLink}/${appId}/${userId || 'new'}/${appStatus}/DELETE/confirm`} color="red">Delete</Button>
          }
          <Button as={Link} to={`${this.props.refLink}/view/${appId}/${userId || 'new'}`} color="blue" inverted className="relaxed">View</Button>
        </Button.Group>
      </Table.Cell>
    );
  }
}
