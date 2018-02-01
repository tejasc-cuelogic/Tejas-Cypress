import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Grid } from 'semantic-ui-react';
import shortid from 'shortid';
import _ from 'lodash';

import businessActions from './../../../../actions/business';

const key = shortid.generate();

@inject('businessStore')
@observer
export default class BusinessForm extends React.Component {
  handleInputChange = e => (
    this.props.businessStore.setTemplateVariable(e.target.name, e.target.value)
  );

  handleCheckboxChange = e => (
    this.props.businessStore.toggleRequiredFiles(e.target.name)
  );

  render() {
    const { formValues, documentList, templateVariables } = this.props.businessStore;
    return (
      <Form as={Grid}>
        {formValues.map(data => (
          <Form.Input
            placeholder={data.placeholder}
            label={data.placeholder}
            name={data.name}
            defaultValue={templateVariables[data.name]}
            onChange={this.handleInputChange}
            width={4}
            key={`${key}_${data.name}`}
          />))
        }
        {
          _.map(documentList, (value, type) => (
            <Form.Field
              type="checkbox"
              control="input"
              label={type}
              name={type}
              checked={value}
              onChange={this.handleCheckboxChange}
              key={`${key}_${type}`}
            />))
        }
        <Button onClick={businessActions.generateDocxFile2}>Generate Docx</Button>
      </Form>
    );
  }
}
