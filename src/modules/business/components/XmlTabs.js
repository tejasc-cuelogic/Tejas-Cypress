import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Step } from 'semantic-ui-react';
import _ from 'lodash';

/* eslint-disable arrow-body-style */
const XmlSubmissionTabs = observer((props) => {
  return (
    <Grid.Column width={4}>
      <Step.Group vertical fluid>
        {_.map(props.tabs, tab => (
          <Step
            key={tab.id}
            active={props.xmlActiveTabId === tab.id}
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
});

export default XmlSubmissionTabs;
