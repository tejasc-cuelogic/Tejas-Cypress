import React from 'react';
import _ from 'lodash';
import { Divider, Grid, Header, Form, Dropdown } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { COUNTRIES } from '../../../../constants/business';

@inject('businessStore')
@observer
export default class AnnualReportDisclosureRequirements extends React.Component {
  handleInputChange = (e, { name, value }) => {
    this.props.businessStore.setAnnualReportInfo(name, value);
  }

  handleSelectChange = (e, { value }) => {
    this.props.businessStore.setCountry(value);
  }

  render() {
    const { annualReportRequirements } = this.props.businessStore;

    return (
      <Grid
        textAlign="left"
        verticalAlign="middle"
      >
        <Grid.Column>
          <Header as="h1" textAlign="left">Annual Report Disclosure Requirements</Header>
          <Divider section />
          {_.map(annualReportRequirements, (field) => {
            if (field.key === 'issueJurisdictionSecuritiesOffering') {
              return (
                <Dropdown
                  fluid
                  multiple
                  search
                  selection
                  placeholder="State"
                  options={COUNTRIES}
                  onChange={this.handleSelectChange}
                  key={field.key}
                />
              );
            }
            return (
              <Form.Input
                label={field.label}
                name={field.key}
                defaultValue={field.value}
                onChange={this.handleInputChange}
                key={field.key}
              />
            );
          })}
        </Grid.Column>
      </Grid>
    );
  }
}
