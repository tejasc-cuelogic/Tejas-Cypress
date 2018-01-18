import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';
import shortid from 'shortid';

import { FORM_VALUES } from './../../../../constants/business';

const FormInput = props => (
  <Form.Input
    placeholder={props.htmlPlaceholder}
    name={props.htmlName}
    onChange={props.handleOnChange}
    key={shortid.generate()}
  />
);

@inject('businessStore')
@observer
export default class BusinessForm extends React.Component {
  handleOnChange = e => (
    this.props.businessStore.setTemplateVariable(e.target.name, e.target.value)
  )
  render() {
    return (
      <Form>
        {FORM_VALUES.map(data => (
          <FormInput
            htmlName={data.name}
            htmlPlaceholder={data.placeholder}
            handleOnChange={this.handleOnChange}
          />))
        }
        <Button>Generate Docx</Button>
      </Form>
    );
  }
}
