import React from 'react';
import _ from 'lodash';
import { Divider, Grid, Header, Form, Dropdown } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { COUNTRIES } from '../../../../constants/business';
import validationActions from '../../../../actions/validation';

@inject('businessStore')
@observer
export default class AnnualReportDisclosureRequirements extends React.Component {
  handleInputChange = (e, { name, value }) => {
    validationActions.validateAnnualReportField(name, value);
  }

  handleSelectChange = (e, { dataidentifier, name, value }) => {
    this.props.businessStore.setCountry(dataidentifier, name, value);
  }

  render() {
    const { annualReportRequirements } = this.props.businessStore;

    return (
      <div>
        <Divider section />
        <Header as="h1" textAlign="left">Annual Report Disclosure Requirements</Header>
        <Grid stackable>
          {_.map(annualReportRequirements, (field) => {
            if (field.key === 'issueJurisdictionSecuritiesOffering') {
              return null;
            }
            return (
              <Form.Input
                label={field.label}
                name={field.key}
                value={field.value}
                error={!!field.error}
                onChange={this.handleInputChange}
                key={field.key}
                className="column"
                width={8}
              />
            );
          })}
        </Grid>
        <Divider hidden />
        <Dropdown
          fluid
          multiple
          search
          selection
          placeholder="State"
          dataidentifier="annualReportRequirements"
          name="issueJurisdictionSecuritiesOffering"
          options={COUNTRIES}
          onChange={this.handleSelectChange}
          key={annualReportRequirements.issueJurisdictionSecuritiesOffering.key}
        />
      </div>
    );
  }
}
