import React from 'react';
import Aux from 'react-aux';
import { Table, Button } from 'semantic-ui-react';
import { includes } from 'lodash';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';

export const ApplicationListButtons = props => (
  <Table.Cell width={1} textAlign="center">
    <Button.Group vertical compact size="mini">
      {!includes(['DELETED', 'REMOVED'], props.status) &&
      props.appStatus ===
      BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED &&
      <Button color="green">Promote</Button>
      }
      {props.appStatus ===
      BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED &&
      <Aux>
        {!includes(['DELETED', 'REMOVED', 'STASH'], props.status) &&
        <Button color="green">Stash</Button>
        }
        {includes(['STASH'], props.status) &&
        <Button color="green" inverted className="relaxed">UnStash</Button>
        }
      </Aux>
      }
      {includes(['DELETED'], props.status) &&
      <Aux>
        <Button color="blue">Restore</Button>
        <Button color="red">Remove</Button>
      </Aux>
      }
      {!includes(['DELETED', 'REMOVED'], props.status) &&
      <Button color="red">Delete</Button>
      }
      <Button color="blue" inverted className="relaxed">View</Button>
    </Button.Group>
  </Table.Cell>
);
