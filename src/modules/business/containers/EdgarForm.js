import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Form, Button, Grid, Divider, Icon } from 'semantic-ui-react';
import shortid from 'shortid';
import '../../../assets/custom.css';

import businessActions from '../../../actions/business';
import ListErrors from '../../../components/common/ListErrors';
import SuccessMessage from '../../../components/common/SuccessMessage';
import Spinner from '../../../theme/ui/Spinner';

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
    this.props.uiStore.reset();
    this.props.businessStore.resetTemplateVariables();
  }

  handleInputChange = (e) => {
    this.props.businessStore.setTemplateVariableByKey(e.target.name, e.target.value);
  };

  handleSubmit = () => {
    businessActions.generateDocxFile()
      .then((data) => {
        this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
        this.props.uiStore.setSuccess(`Successfully created docx files with id ${data.body.requestId}`);
      });
  }

  render() {
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
        <div className="page-header-section webcontent-spacer">
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
                  onClick={this.handleSubmit}
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
