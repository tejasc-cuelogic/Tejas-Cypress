import React from 'react';
import { Table, List } from 'semantic-ui-react';
import { BUSINESS_APPLICATION_STATUS, BUSINESS_APPLICATION_STEP_STATUS } from '../../../../../services/constants/businessApplication';

export const ApplicationListStepColumn = (props) => {
  const {
    applicationStatus, failReasons, prequalDetails, businessDetails,
    businessPerformance, businessDocumentation, prequalStatus,
  } = props.application;
  const detailsStepTitle = businessDetails && businessDetails.stepStatus === BUSINESS_APPLICATION_STEP_STATUS.IN_PROGRESS ? 'Continue' : businessDetails && businessDetails.stepStatus === BUSINESS_APPLICATION_STEP_STATUS.COMPLETE ? 'Completed' : 'Not Completed';
  const detailsClass = detailsStepTitle === 'Completed' ? 'done' : detailsStepTitle === 'Continue' ? 'current' : '';
  const performanceStepTitle = businessPerformance && businessPerformance.stepStatus === BUSINESS_APPLICATION_STEP_STATUS.IN_PROGRESS ? 'Continue' : businessPerformance && businessPerformance.stepStatus === BUSINESS_APPLICATION_STEP_STATUS.COMPLETE ? 'Completed' : 'Not Completed';
  const performanceClass = performanceStepTitle === 'Completed' ? 'done' : performanceStepTitle === 'Continue' ? 'current' : '';
  const documentationStepTitle = businessDocumentation && businessDocumentation.stepStatus === BUSINESS_APPLICATION_STEP_STATUS.IN_PROGRESS ? 'Continue' : businessDocumentation && businessDocumentation.stepStatus === BUSINESS_APPLICATION_STEP_STATUS.COMPLETE ? 'Completed' : 'Not Completed';
  const documentationClass = documentationStepTitle === 'Completed' ? 'done' : documentationStepTitle === 'Continue' ? 'current' : '';
  return (
    <Table.Cell singleLine>
      {(applicationStatus || prequalStatus) ===
      BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ?
        (failReasons.length || prequalDetails.failReasons.length ?
          <List as="ol">{(failReasons || prequalDetails.failReasons).map(reason => <List.Item as="li" value="-">{reason}</List.Item>)}</List>
        : <p>-</p>
        )
        : (applicationStatus || prequalStatus) ===
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
