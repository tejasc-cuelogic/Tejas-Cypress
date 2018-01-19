import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Grid } from 'semantic-ui-react';
import shortid from 'shortid';

import businessActions from './../../../../actions/business';

const FormBusinessInput = props => (
  <Form.Input
    placeholder={props.htmlPlaceholder}
    label={props.htmlPlaceholder}
    name={props.htmlName}
    onChange={props.handleInputChange}
    width={4}
  />
);

const FormDocPreferences = props => (
  <Form.Field
    type="checkbox"
    control="input"
    label={props.label}
    name={props.name}
    checked={props.checked}
    onChange={props.handleOnChange}
  />
);

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
          <FormBusinessInput
            htmlName={data.name}
            htmlPlaceholder={data.placeholder}
            handleInputChange={this.handleInputChange}
            key={shortid.generate()}
          />))
        }
        <Form.Group grouped>
          {Object.keys(documentList).map(doctype => (
            <FormDocPreferences
              label={doctype}
              name={doctype}
              checked={documentList[doctype]}
              handleOnChange={this.handleCheckboxChange}
              key={shortid.generate()}
            />))
          }
        </Form.Group>
        <Button onClick={businessActions.generateDocxFile}>Generate Docx</Button>
      </Form>
    );
  }
}
