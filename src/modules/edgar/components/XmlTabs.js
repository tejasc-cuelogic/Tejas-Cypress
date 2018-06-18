import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Step } from 'semantic-ui-react';
import _ from 'lodash';

const XmlSubmissionTabs = observer(props => (
  <Grid.Column width={4}>
    <Step.Group vertical fluid>
      {
        _.map(props.tabs, tab => (
          <Step
            key={tab.id}
            active={props.xmlActiveTabName === tab.name}
            onClick={() => props.handleXmlActiveTab(tab.name)}
            className={tab.errorClass}
          >
            <Step.Content>
              <Step.Title>{tab.label}</Step.Title>
            </Step.Content>
          </Step>
        ))
      }
    </Step.Group>
  </Grid.Column>
));

export default XmlSubmissionTabs;
