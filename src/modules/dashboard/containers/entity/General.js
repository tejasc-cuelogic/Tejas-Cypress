import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Autocomplete from 'react-google-autocomplete';

import { US_STATES } from '../../../../constants/account';
import accountActions from '../../../../actions/account';
import validationActions from '../../../../actions/validation';
import FieldError from '../../../../components/common/FieldError';

@inject('accountStore')
@observer
export default class General extends Component {
  handleInputChange = (e, { name, value }) => {
    validationActions.validateEntityAccountField(name, value);
  }
  handleAutocompleteInputChange = e =>
    validationActions.validateEntityAccountField(e.target.name, e.target.value);
  render() {
    const { entityAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">General Information</Header>
        <Form error>
          <div className="field-wrap">
            <Form.Field>
              <Form.Input
                fluid
                name={entityAccount.nameOfEntity.key}
                label={entityAccount.nameOfEntity.label}
                placeholder={entityAccount.nameOfEntity.placeHolder}
                value={entityAccount.nameOfEntity.value}
                error={!!entityAccount.nameOfEntity.error}
                onChange={this.handleInputChange}
              />
              <FieldError error={entityAccount.nameOfEntity.error} />
            </Form.Field>
            <Form.Field>
              <Form.Input
                fluid
                name={entityAccount.taxId.key}
                label={entityAccount.taxId.label}
                placeholder={entityAccount.taxId.placeHolder}
                value={entityAccount.taxId.value}
                error={!!entityAccount.taxId.error}
                onChange={this.handleInputChange}
              />
              <FieldError error={entityAccount.taxId.error} />
            </Form.Field>
            <h5>Entity Address</h5>
            <Form.Field>
              <Autocomplete
                onPlaceSelected={(place) => {
                  accountActions.setAddressFieldsOnGoogleAutocomplete(place);
                }}
                types={['address']}
                placeholder={entityAccount.street.label}
                name={entityAccount.street.key}
                value={entityAccount.street.value}
                onChange={this.handleAutocompleteInputChange}
              />
              <FieldError error={entityAccount.street.error} />
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Field>
                <Form.Input
                  fluid
                  name={entityAccount.city.key}
                  label={entityAccount.city.label}
                  placeholder={entityAccount.city.placeHolder}
                  value={entityAccount.city.value}
                  error={!!entityAccount.city.error}
                  onChange={this.handleInputChange}
                />
                <FieldError error={entityAccount.city.error} />
              </Form.Field>
              <Form.Field>
                <Form.Select
                  fluid
                  search
                  name={entityAccount.state.key}
                  label={entityAccount.state.label}
                  placeholder={entityAccount.state.placeHolder}
                  value={entityAccount.state.value}
                  error={!!entityAccount.state.error}
                  onChange={this.handleInputChange}
                  options={US_STATES}
                />
              </Form.Field>
              <Form.Field>
                <Form.Input
                  fluid
                  name={entityAccount.zipCode.key}
                  label={entityAccount.zipCode.label}
                  placeholder={entityAccount.zipCode.placeHolder}
                  value={entityAccount.zipCode.value}
                  error={!!entityAccount.zipCode.error}
                  onChange={this.handleInputChange}
                />
                <FieldError error={entityAccount.zipCode.error} />
              </Form.Field>
            </Form.Group>
          </div>
        </Form>
      </div>
    );
  }
}
