import React from 'react';
import { Table, List } from 'semantic-ui-react';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';

export const ApplicationListStepColumn = props => (
  <Table.Cell>
    {props.appStatus ===
    BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ?
      <p>
        {props.failedReasons}
      </p> : props.appStatus ===
    BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED &&
      <List as="ol" className="step-list">
        <List.Item as="li" className="done">Completed</List.Item>
        <List.Item as="li" className="done">Completed</List.Item>
        <List.Item as="li" className="current">Continue</List.Item>
        <List.Item as="li">Not Completed</List.Item>
      </List>
    }
  </Table.Cell>
);
