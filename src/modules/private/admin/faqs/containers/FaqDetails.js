import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Grid, Card, Form, Divider, Button } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { FormInput, FormDropDown } from '../../../../../theme/form';
import { FAQ_STATUS_VALUES, AUTHORS, FAQ_TYPES_VALUES } from '../../../../../services/constants/admin/faqs';

@inject('faqStore', 'uiStore', 'articleStore')
@withRouter
@observer
export default class FaqDetails extends Component {
  componentWillMount() {
    const { match, faqStore } = this.props;
    const { id } = match.params;
    const { editMode } = faqStore;
    if (id !== 'new' && !editMode) {
      this.props.faqStore.getOne(id);
    }
  }
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  };
  save = () => {
    this.props.faqStore.save(this.props.match.params.id).then(() => {
      this.props.history.push(this.props.refLink);
    });
  }
  render() {
    const {
      loading,
      FAQ_FRM,
      formChange,
      htmlContentChange,
    } = this.props.faqStore;
    const isNew = this.props.match.params.id === 'new';
    const { inProgress } = this.props.uiStore;
    const { categoriesDropdown } = this.props.articleStore;
    if (loading || inProgress) {
      return <InlineLoader />;
    }
    return (
      <Modal dimmer="inverted" open onClose={this.handleCloseModal} size="large" closeIcon>
        <Modal.Content className="transaction-details">
          <div>
            <Header as="h3">
              {isNew ? 'Create' : 'Edit'} Article
              <Button.Group compact floated="right">
                <Button
                  inverted
                  onClick={() => this.save('DRAFT')}
                  color="green"
                  content="Save as draft"
                  disabled={!FAQ_FRM.meta.isValid}
                />
                <Button
                  primary
                  onClick={() => this.save('PENDING')}
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
                <small>Article name</small>
                <Form>
                  <FormInput
                    // readOnly={(this.props.status === 'PUBLISHED' &&
                    // isManager) ? !this.state.editForm : isReadonly}
                    ishidelabel
                    fluid
                    type="text"
                    name="title"
                    fielddata={FAQ_FRM.fields.question}
                    changed={formChange}
                  />
                  <HtmlEditor
                    // readOnly={(this.props.status === 'PUBLISHED'
                    // && isManager) ? !this.state.editForm : isReadonly}
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
                          options={FAQ_STATUS_VALUES}
                          onChange={(e, result) => formChange(e, result)}
                        />
                      </div>
                      <div className="field">
                        <FormDropDown
                          fielddata={FAQ_FRM.fields.author}
                          selection
                          containerclassname="dropdown-field"
                          value={FAQ_FRM.fields.author.value}
                          placeholder="Choose here"
                          name="author"
                          options={AUTHORS}
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
                          options={FAQ_TYPES_VALUES}
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
