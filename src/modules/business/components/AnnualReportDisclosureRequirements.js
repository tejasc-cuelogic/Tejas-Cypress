import React from 'react';
import _ from 'lodash';
import { Divider, Grid, Header, Form, Dropdown } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { COUNTRIES } from '../../../constants/business';

@inject('businessStore')
@observer
export default class AnnualReportDisclosureRequirements extends React.Component {
  render() {
    return (
      <Grid
        textAlign="left"
        verticalAlign="middle"
      >
        <Grid.Column>
          <Header as="h1" textAlign="left">Annual Report Disclosure Requirements</Header>
          <Divider section />
          {_.map(this.props.businessStore.annualReportRequirements, (field) => {
            if (field.key === 'issueJurisdictionSecuritiesOffering') {
              return (
                <Dropdown
                  fluid
                  multiple
                  search
                  selection
                  placeholder="State"
                  options={COUNTRIES}
                  onChange={this.props.handleSelectChange}
                  key={field.key}
                />
              );
            }
            return (
              <Form.Input
                label={field.label}
                name={field.key}
                defaultValue={field.value}
                onChange={this.props.handleInputChange}
                key={field.key}
              />
            );
          })}
        </Grid.Column>
      </Grid>
    );
  }
}
