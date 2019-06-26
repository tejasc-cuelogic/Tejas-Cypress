import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Grid, Card, Form } from 'semantic-ui-react';
import { FormInput, FormDropDown, FormRadioGroup } from '../../../../../theme/form';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { ITEM_STATUS_VALUES } from '../../../../../services/constants/admin/knowledgeBase';
import Actions from './Actions';
import { InlineLoader } from '../../../../../theme/shared';


@inject('knowledgeBaseStore', 'userStore', 'offeringCreationStore', 'uiStore')
@withRouter
@observer
export default class EditKnowledgeBaseItem extends Component {
  componentWillMount() {
    if (this.props.match.params.id !== 'new') {
      this.props.knowledgeBaseStore.getKnowledgeBase(this.props.match.params.id, false);
    } else {
      this.props.knowledgeBaseStore.reset();
      this.props.knowledgeBaseStore.setFormData({
        userType: this.props.match.params.userType,
        categoryId: this.props.match.params.categoryId,
        itemStatus: 'DRAFT',
      });
    }
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
    this.props.knowledgeBaseStore.resetFormData('KNOWLEDGE_BASE_FRM');
  };

  save = (status, isDraft = false) => {
    this.props.knowledgeBaseStore.save(this.props.match.params.id, status, isDraft).then(() => {
      this.props.history.push(this.props.refLink);
    });
  }

  render() {
    const {
      KNOWLEDGE_BASE_FRM,
      knowledgeBaseChange,
      htmlContentChange,
      loading,
      userTypeChange,
      categoriesDropdown,
    } = this.props.knowledgeBaseStore;
    const { inProgress } = this.props.uiStore;
    const isNew = this.props.match.params.id === 'new';
    const itemStatus = this.props.match.params.status;
    return (
      <Modal closeOnEscape={false} closeOnDimmerClick={false} dimmer="inverted" open onClose={this.handleCloseModal} size="large" closeIcon>
        <Modal.Content className="transaction-details">
          {
            (loading || inProgress)
              ? <InlineLoader />
              : (
<div>
                <div>
                  <Header as="h3">
                    {isNew ? 'Create' : 'Edit'} Knowledge Base
                    <Actions
                      save={this.save}
                      meta={KNOWLEDGE_BASE_FRM.meta}
                      isPublished={itemStatus === 'PUBLISHED'}
                      isReview={itemStatus === 'IN_REVIEW'}
                    />
                  </Header>
                </div>
                <Divider hidden />
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={12}>
                      <small>Knowledge Base Title</small>
                      <Form>
                        <FormInput
                          ishidelabel
                          fluid
                          type="text"
                          name="title"
                          fielddata={KNOWLEDGE_BASE_FRM.fields.title}
                          changed={knowledgeBaseChange}
                        />
                        <HtmlEditor
                          changed={htmlContentChange}
                          name="content"
                          content={KNOWLEDGE_BASE_FRM.fields.content.value}
                        />
                      </Form>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <Card fluid>
                        <Card.Content>
                          <Header as="h4">
                            Tip settings
                          </Header>
                          <Form>
                            <div className="field">
                              <Header as="label">{KNOWLEDGE_BASE_FRM.fields.userType.label}</Header>
                              <FormRadioGroup
                                fielddata={KNOWLEDGE_BASE_FRM.fields.userType}
                                name="userType"
                                changed={(e, result) => userTypeChange(e, result)}
                                readOnly={false}
                                containerclassname="center-align"
                                widths="equal"
                                value={KNOWLEDGE_BASE_FRM.fields.userType.value}
                              />
                            </div>
                            {/* <div className="field">
                            <FormDropDown
                              fielddata={KNOWLEDGE_BASE_FRM.fields.userType}
                              selection
                              containerclassname="dropdown-field"
                              value={KNOWLEDGE_BASE_FRM.fields.userType.value}
                              placeholder="Choose here"
                              name="userType"
                              options={USER_TYPES}
                              onChange={(e, result) => knowledgeBaseChange(e, result)}
                            />
                          </div> */}
                            <div className="field">
                              <FormDropDown
                                fielddata={KNOWLEDGE_BASE_FRM.fields.categoryId}
                                selection
                                containerclassname="dropdown-field"
                                value={KNOWLEDGE_BASE_FRM.fields.categoryId.value}
                                placeholder="Choose here"
                                name="categoryId"
                                options={categoriesDropdown}
                                onChange={(e, result) => knowledgeBaseChange(e, result)}
                              />
                            </div>
                            <div className="field">
                              <FormDropDown
                                fielddata={KNOWLEDGE_BASE_FRM.fields.itemStatus}
                                selection
                                containerclassname="dropdown-field"
                                value={KNOWLEDGE_BASE_FRM.fields.itemStatus.value}
                                placeholder="Choose here"
                                name="itemStatus"
                                options={ITEM_STATUS_VALUES}
                                onChange={(e, result) => knowledgeBaseChange(e, result)}
                              />
                            </div>
                            <FormInput
                              type="number"
                              name="order"
                              fielddata={KNOWLEDGE_BASE_FRM.fields.order}
                              changed={knowledgeBaseChange}
                            />
                            <FormInput
                              type="text"
                              name="slug"
                              fielddata={KNOWLEDGE_BASE_FRM.fields.slug}
                              changed={knowledgeBaseChange}
                            />
                          </Form>
                        </Card.Content>
                      </Card>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
              )
          }
        </Modal.Content>
      </Modal>
    );
  }
}
