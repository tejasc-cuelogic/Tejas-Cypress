import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Grid, Checkbox, Divider, GridColumn } from 'semantic-ui-react';
import shortid from 'shortid';
import _ from 'lodash';

import businessActions from '../../../actions/business';

const key = shortid.generate();

@inject('businessStore')
@observer
export default class EdgarForm extends React.Component {
  handleInputChange = e => (
    this.props.businessStore.setTemplateVariable(e.target.name, e.target.value)
  );

  handleCheckboxChange = e => (
    this.props.businessStore.toggleRequiredFiles(e.target.name)
  );

  render() {
    const { formValues, documentList, templateVariables } = this.props.businessStore;
    return (
      <Grid container stackable className="edgar-form">
        <Form>
          <Grid container>
            {formValues.map(data => (
              <Form.Input
                placeholder={data.placeholder}
                label={data.placeholder}
                name={data.name}
                defaultValue={templateVariables[data.name]}
                onChange={this.handleInputChange}
                width={8}
                columns={2}
                key={`${key}_${data.name}`}
              />))
            }
          </Grid>
          <Divider section />
          <Grid container stackable columns={2}>
            {
              _.map(documentList, (value, type) => (
                <GridColumn>
                  <Checkbox
                    label={type}
                    name={type}
                    checked={value}
                    onChange={this.handleCheckboxChange}
                    key={`${key}_${type}`}
                  />
                </GridColumn>
              ))
            }
          </Grid>
          <Divider section />
          <div className="form-footer">
            <Button onClick={businessActions.generateDocxFile2} primary>Generate Docx</Button>
          </div>
        </Form>
      </Grid>
    );
  }
}
