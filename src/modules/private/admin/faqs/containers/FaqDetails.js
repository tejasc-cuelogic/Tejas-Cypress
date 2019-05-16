import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Grid, Card, Form, Divider, Button } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { FormInput, FormDropDown } from '../../../../../theme/form';
import { FAQ_STATUS_VALUES, FAQ_TYPES_VALUES } from '../../../../../services/constants/admin/faqs';

@inject('faqStore', 'uiStore', 'articleStore')
@withRouter
@observer
export default class FaqDetails extends Component {
  componentWillMount() {
    const { match } = this.props;
    const { id } = match.params;
    if (id !== 'new') {
      this.props.faqStore.getOne(id);
    } else {
      this.props.faqStore.reset();
    }
  }
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  };
  save = (isDraft = false) => {
    this.props.faqStore.save(this.props.match.params.id, isDraft).then(() => {
      this.props.history.push(this.props.refLink);
    });
  }
  render() {
    const {
      loading,
      FAQ_FRM,
      formChange,
      setFormData,
      htmlContentChange,
    } = this.props.faqStore;
    const faqStatuses = FAQ_STATUS_VALUES.filter(faqStatus => faqStatus.key !== 'All');
    const faqTypes = FAQ_TYPES_VALUES.filter(faqStatus => faqStatus.key !== 'All');
    const isNew = this.props.match.params.id === 'new';
    const { inProgress } = this.props.uiStore;
    const { categoriesDropdown, Categories } = this.props.articleStore;
    if (isNew) {
      setFormData({
        faqType: this.props.match.params.faqType,
        categoryId: this.props.match.params.categoryId,
      });
    }
    if (loading || inProgress || Categories.loading) {
      return <InlineLoader />;
    }
    return (
      <Modal dimmer="inverted" open closeOnDimmerClick={false} onClose={this.handleCloseModal} size="large" closeIcon>
        <Modal.Content className="transaction-details">
          <div>
            <Header as="h3">
              {isNew ? 'Create' : 'Edit'} FAQ
              <Button.Group compact floated="right">
                <Button
                  inverted
                  onClick={() => this.save(true)}
                  color="green"
                  content="Save as draft"
                  disabled={!FAQ_FRM.meta.isValid}
                />
                <Button
                  primary
                  onClick={() => this.save()}
                  content="Submit for Approval"
                  disabled={!FAQ_FRM.meta.isValid}
                />
              </Button.Group>
            </Header>
          </div>
          <Divider hidden />
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <small>FAQ name</small>
                <Form>
                  <FormInput
                    ishidelabel
                    fluid
                    type="text"
                    name="question"
                    fielddata={FAQ_FRM.fields.question}
                    changed={formChange}
                  />
                  <HtmlEditor
                    changed={htmlContentChange}
                    name="answer"
                    content={FAQ_FRM.fields.answer.value}
                  />
                </Form>
              </Grid.Column>
              <Grid.Column width={4}>
                <Card fluid>
                  <Card.Content>
                    <Header as="h4">
                    FAQ settings
                    </Header>
                    <Form>
                      <div className="field">
                        <FormDropDown
                          fielddata={FAQ_FRM.fields.itemStatus}
                          selection
                          containerclassname="dropdown-field"
                          value={FAQ_FRM.fields.itemStatus.value}
                          placeholder="Choose here"
                          name="itemStatus"
                          options={faqStatuses}
                          onChange={(e, result) => formChange(e, result)}
                        />
                      </div>
                      <div className="field">
                        <FormDropDown
                          fielddata={FAQ_FRM.fields.faqType}
                          selection
                          containerclassname="dropdown-field"
                          value={FAQ_FRM.fields.faqType.value}
                          placeholder="Choose here"
                          name="faqType"
                          options={faqTypes}
                          onChange={(e, result) => formChange(e, result)}
                        />
                      </div>
                      <div className="field">
                        <FormDropDown
                          fielddata={FAQ_FRM.fields.categoryId}
                          selection
                          containerclassname="dropdown-field"
                          value={FAQ_FRM.fields.categoryId.value}
                          placeholder="Choose here"
                          name="categoryId"
                          options={categoriesDropdown}
                          onChange={(e, result) => formChange(e, result)}
                        />
                      </div>
                      <div className="field">
                        <FormInput
                          type="text"
                          name="slug"
                          fielddata={FAQ_FRM.fields.slug}
                          changed={formChange}
                        />
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}
