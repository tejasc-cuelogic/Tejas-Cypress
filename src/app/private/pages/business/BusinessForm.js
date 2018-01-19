import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Grid } from 'semantic-ui-react';
import shortid from 'shortid';
import _ from 'lodash';

import businessActions from './../../../../actions/business';

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
    const { formValues, documentList } = this.props.businessStore;
    return (
      <Form as={Grid}>
        {formValues.map(data => (
          <Form.Input
            placeholder={data.placeholder}
            label={data.placeholder}
            name={data.name}
            onChange={this.handleInputChange}
            width={4}
            key={shortid.generate()}
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
            />))
        }
        <Button onClick={businessActions.generateDocxFile}>Generate Docx</Button>
      </Form>
    );
  }
}
