import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Card, Form, Header, Button } from 'semantic-ui-react';
import { FormInput, AutoComplete, FormDatePicker } from '../../../../../theme/form/FormElements';
import Helper from '../../../../../helper/utility';

@inject('userDetailsStore', 'uiStore')
@observer
export default class AddBeneficiary extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }

  submit = (e) => {
    e.preventDefault();
    this.props.userDetailsStore.createBeneficiary().then(() => {
      Helper.toast('Beneficiary added!', 'success');
      this.props.history.push(this.props.refLink);
    });
  }

  render() {
    const {
      BENEFICIARY_META, beneficiaryEleChange, beneficiaryDateChange, setAddressFields,
    } = this.props.userDetailsStore;
    return (
      <Grid.Row>
        <Grid.Column widescreen={8} largeScreen={10} computer={13} tablet={16} mobile={16}>
          <Card fluid>
            <Card.Content className="padded">
              <Header as="h4">Beneficiary 1</Header>
              <Form onSubmit={this.submit}>
                <div className="field-wrap">
                  <Form.Group widths="equal">
                    {
                      ['firstName', 'lastName'].map(field => (
                        <FormInput
                          key={field}
                          type="text"
                          name={field}
                          fielddata={BENEFICIARY_META.fields[field]}
                          changed={beneficiaryEleChange}
                        />
                      ))
                    }
                  </Form.Group>
                  <Form.Group widths="equal">
                    <FormDatePicker
                      type="text"
                      name="dob"
                      fielddata={BENEFICIARY_META.fields.dob}
                      selected={BENEFICIARY_META.fields.dob.value}
                      changed={beneficiaryDateChange}
                    />
                    <FormInput
                      type="text"
                      name="relationship"
                      fielddata={BENEFICIARY_META.fields.relationship}
                      changed={beneficiaryEleChange}
                    />
                  </Form.Group>
                  <Header as="h4">Pernament address</Header>
                  <AutoComplete
                    name="residentalStreet"
                    fielddata={BENEFICIARY_META.fields.residentalStreet}
                    onplaceselected={setAddressFields}
                    changed={beneficiaryEleChange}
                  />
                  <Form.Group widths="equal">
                    {
                      ['city', 'state', 'zipCode'].map(field => (
                        <FormInput
                          key={field}
                          type="text"
                          name={field}
                          fielddata={BENEFICIARY_META.fields[field]}
                          changed={beneficiaryEleChange}
                        />
                      ))
                    }
                  </Form.Group>
                  <FormInput
                    type="text"
                    name={BENEFICIARY_META.fields.share}
                    fielddata={BENEFICIARY_META.fields.share}
                    changed={beneficiaryEleChange}
                  />
                </div>
                <Button color="violet" className="ghost-button pull-right">+ Add new beneficiary</Button>
                <Button loading={this.props.uiStore.inProgress} disabled={!BENEFICIARY_META.meta.isValid} color="green">Submit to approval</Button>
              </Form>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
