import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Form, Button, Grid, Divider, Icon } from 'semantic-ui-react';
import shortid from 'shortid';
import '../../../assets/custom.css';

import businessActions from '../../../actions/business';
import Spinner from '../../../theme/ui/Spinner';
import Helper from '../../../helper/utility';

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
    } else if (params.businessId) {
      businessActions.fetchBusinessName(params.businessId);
    }
  }

  componentWillUnmount() {
    // this.props.uiStore.reset();
    this.props.businessStore.resetTemplateVariables();
  }

  handleInputChange = (e) => {
    this.props.businessStore.setTemplateVariableByKey(e.target.name, e.target.value);
  };

  handleSubmit = () => {
    businessActions.generateDocxFile()
      .then((data) => {
        this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
        Helper.toast(`.docx file with id ${data.body.requestId} created successfully`, 'success');
      })
      .finally(() => {
        this.props.uiStore.toggleSubmitButton();
        this.props.uiStore.clearLoaderMessage();
        this.props.uiStore.setProgress(false);
      });
  }

  render() {
    if (this.props.uiStore.inProgress) {
      return (
        <div>
          <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
        </div>
      );
    }
    const { formValues, templateVariables } = this.props.businessStore;
    if (this.props.uiStore.inProgress) {
      return (
        <div>
          <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
        </div>
      );
    }
    return (
      <div>
        <div className="page-header-section">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <h1>
                  <Link to={`/app/business/${this.props.match.params.businessId}`} className="back-link"><Icon name="long arrow left" /></Link>
                  Edgar Form
                </h1>
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
              <div className="center-align">
                <Button
                  primary
                  disabled={
                    !this.props.businessStore.canSubmitEdgarForm ||
                      this.props.uiStore.submitButtonDisabled
                  }
                  onClick={this.handleSubmit}
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
