import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Grid, Divider } from 'semantic-ui-react';
import shortid from 'shortid';
import '../../../assets/custom.css';

import businessActions from '../../../actions/business';

const key = shortid.generate();

@inject('businessStore')
@observer
export default class EdgarForm extends React.Component {
  handleInputChange = (e) => {
    this.props.businessStore.setTemplateVariable(e.target.name, e.target.value);
  };

  handleCheckboxChange = (e) => {
    this.props.businessStore.toggleRequiredFiles(e.target.textContent);
  };

  render() {
    const { formValues, templateVariables } = this.props.businessStore;
    return (
      <div className="content-spacer">
        <Grid stackable className="edgar-form">
          <Form>
            <Grid>
              {formValues.map(data => (
                <Form.Input
                  placeholder={data.placeholder}
                  className="column"
                  label={data.placeholder}
                  name={data.name}
                  defaultValue={templateVariables[data.name]}
                  onChange={this.handleInputChange}
                  width={data.width || 8}
                  key={`${key}_${data.name}`}
                />))
              }
            </Grid>
            <Divider section />
            <div
              className="form-footer"
              style={{
              paddingBottom: '40px',
              paddingLeft: '1rem',
              // textAlign: 'center',
              }}
            >
              <Button
                color="green"
                disabled={!this.props.businessStore.canSubmitEdgarForm}
                onClick={businessActions.generateDocxFile}
                primary
              >
                Generate Docx
              </Button>
            </div>
          </Form>
        </Grid>
      </div>
    );
  }
}
