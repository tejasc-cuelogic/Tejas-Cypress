import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Grid, Divider } from 'semantic-ui-react';
import shortid from 'shortid';
import '../../../assets/custom.css';

import businessActions from '../../../actions/business';
import ListErrors from '../../../components/common/ListErrors';
import SuccessMessage from '../../../components/common/SuccessMessage';

const key = shortid.generate();

@inject('businessStore', 'uiStore')
@observer
export default class EdgarForm extends React.Component {
  componentWillMount() {
    const { params } = this.props.match;
    if (params.filingId && params.businessId) {
      businessActions.fetchEdgarDetails(
        params.businessId,
        params.filingId,
      );
    }
  }

  componentWillUnmount() {
    this.props.uiStore.reset();
    this.props.businessStore.resetTemplateVariables();
  }

  handleInputChange = (e) => {
    this.props.businessStore.setTemplateVariableByKey(e.target.name, e.target.value);
  };

  render() {
    const { formValues, templateVariables } = this.props.businessStore;
    return (
      <div>
        <div className="page-header-section webcontent-spacer">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <h3>Edgar Form</h3>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
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
                    value={templateVariables[data.name]}
                    onChange={this.handleInputChange}
                    width={data.width || 8}
                    key={`${key}_${data.name}`}
                    disabled={data.name === 'name_of_business'}
                  />))
                }
              </Grid>
              <Divider section />
              <ListErrors errors={this.props.uiStore.errors} />
              <SuccessMessage success={this.props.uiStore.success} />
              <div
                className="form-footer"
                style={{
                paddingBottom: '40px',
                paddingLeft: '1rem',
                textAlign: 'center',
                }}
              >
                <Button
                  color="green"
                  disabled={
                    !this.props.businessStore.canSubmitEdgarForm ||
                      this.props.uiStore.submitButtonDisabled
                  }
                  onClick={businessActions.generateDocxFile}
                  primary
                >
                  Generate Docx
                </Button>
              </div>
            </Form>
          </Grid>
        </div>
      </div>
    );
  }
}
