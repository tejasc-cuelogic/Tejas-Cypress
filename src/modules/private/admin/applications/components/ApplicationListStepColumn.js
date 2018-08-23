import React from 'react';
import { Table, List } from 'semantic-ui-react';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';

export const ApplicationListStepColumn = (props) => {
  const {
    applicationStatus, prequalDetails, businessDetails, businessPerformance, businessDocumentation,
  } = props.application;
  const detailsStepTitle = businessDetails ? businessDetails.stepStatus === 'IN-PROGRESS' ? 'Continue' : 'Completed' : 'Not Completed';
  const detailsClass = detailsStepTitle === 'Completed' ? 'done' : detailsStepTitle === 'Continue' ? 'current' : '';
  const performanceStepTitle = businessPerformance ? businessPerformance.stepStatus === 'IN-PROGRESS' ? 'Continue' : 'Completed' : 'Not Completed';
  const performanceClass = performanceStepTitle === 'Completed' ? 'done' : performanceStepTitle === 'Continue' ? 'current' : '';
  const documentationStepTitle = businessDocumentation ? businessDocumentation.stepStatus === 'IN-PROGRESS' ? 'Continue' : 'Completed' : 'Not Completed';
  const documentationClass = documentationStepTitle === 'Completed' ? 'done' : documentationStepTitle === 'Continue' ? 'current' : '';
  return (
    <Table.Cell>
      {applicationStatus ===
      BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ?
        (prequalDetails.failReasons.length ?
          <ul>{prequalDetails.failReasons.map(reason => <li>{reason}</li>)}</ul>
        : <p>-</p>
        )
        : applicationStatus ===
      BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED &&
        <List as="ol" className="step-list">
          <List.Item as="li" className="done">Completed</List.Item>
          <List.Item as="li" className={detailsClass}>{detailsStepTitle}</List.Item>
          <List.Item as="li" className={performanceClass}>{performanceStepTitle}</List.Item>
          <List.Item as="li" className={documentationClass}>{documentationStepTitle}</List.Item>
        </List>
      }
    </Table.Cell>
  );
};
