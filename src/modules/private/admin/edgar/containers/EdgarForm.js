import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Form, Button, Grid, Divider, Icon, Card, Responsive } from 'semantic-ui-react';
import shortid from 'shortid';

import { businessActions } from '../../../../../services/actions';
import { Spinner } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

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
        this.props.history.push(`/app/edgar/${this.props.match.params.businessId}`);
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
      <>
        <div className="page-header-section">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Header as="h1">
                  <Responsive
                    minWidth={Responsive.onlyLargeScreen.minWidth}
                    as={Link}
                    to={`/app/edgar/${this.props.match.params.businessId}`}
                    className="back-link"
                  >
                    <Icon className="ns-arrow-left" />
                  </Responsive>
                  Edgar Form
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div className="content-spacer">
          <Card fluid>
            <Card.Content>
              <Form>
                <Grid stackable className="edgar-form">
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
                    />
                  ))
                  }
                </Grid>
                <Divider hidden section />
                <div className="form-footer">
                  <Button
                    color="green"
                    onClick={this.handleSubmit}
                    primary
                    disabled={
                      this.props.match.params.filingId
                    }
                  >
                    Generate Docx
                  </Button>
                </div>
              </Form>
            </Card.Content>
          </Card>
        </div>
      </>
    );
  }
}
