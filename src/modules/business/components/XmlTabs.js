import React from 'react';
import { Grid, Step } from 'semantic-ui-react';
import _ from 'lodash';

const XmlSubmissionTabs = props => (

  <Grid.Column width={4}>
    <Step.Group vertical fluid>
      {_.map(props.tabs, tab => (
        <Step
          active={props.xmlActiveTabId === tab.id}
          disabled={tab.id > 0 && !props.xmlId}
          onClick={() => props.handleXmlActiveTab(tab.id)}
        >
          <Step.Content>
            <Step.Title>{tab.label}</Step.Title>
          </Step.Content>
        </Step>
      ))
      }
    </Step.Group>
  </Grid.Column>
);

export default XmlSubmissionTabs;
