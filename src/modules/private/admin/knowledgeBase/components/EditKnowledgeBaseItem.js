import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Grid, Card, Form } from 'semantic-ui-react';
import { FormInput, FormDropDown, FormRadioGroup } from '../../../../../theme/form';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { ITEM_STATUS_VALUES } from '../../../../../services/constants/admin/knowledgeBase';
import Actions from './Actions';
import { InlineLoader } from '../../../../../theme/shared';


@inject('knowledgeBaseStore', 'userStore', 'offeringCreationStore')
@withRouter
@observer
export default class EditKnowledgeBaseItem extends Component {
  componentWillMount() {
    this.initiateFlow(this.props.match.params.id);
    this.props.knowledgeBaseStore.reset();
  }
  initiateFlow = (id) => {
    if (id !== 'new') {
      this.props.knowledgeBaseStore.getKnowledgeBase(id, false);
    } else {
      this.props.knowledgeBaseStore.reset();
    }
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
    this.props.knowledgeBaseStore.resetFormData('KNOWLEDGE_BASE_FRM');
  };

  save = (status) => {
    console.log(status);
    this.props.knowledgeBaseStore.save(this.props.match.params.id);
    // const access = this.props.userStore.myAccessForModule('OFFERINGS');
    // const isManager = access.asManager;
    // this.props.knowledgeBaseStore.save(this.props.match.params.id,
    // status, isManager, this.props.status === 'PUBLISHED');
    this.props.history.push(this.props.refLink);
  }
  render() {
    const {
      KNOWLEDGE_BASE_FRM,
      knowledgeBaseChange,
      htmlContentChange,
      categoriesDropdown,
      loading,
      userTypeChange,
    } = this.props.knowledgeBaseStore;
    const isNew = this.props.match.params.id === 'new';
    return (
      <Modal dimmer="inverted" open onClose={this.handleCloseModal} size="large" closeIcon>
        <Modal.Content className="transaction-details">
          {
            loading ?
              <InlineLoader />
              :
              <div>
                <div>
                  <Header as="h3">
                    {isNew ? 'Create' : 'Edit'} Article
                    <Actions save={this.save} meta={KNOWLEDGE_BASE_FRM.meta} />
                  </Header>
                </div>
                <Divider hidden />
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={12}>
                      <small>Article Title</small>
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
                                containerclassname="mt-30 radio-basic center-align"
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
                              type="text"
                              name="authorId"
                              fielddata={KNOWLEDGE_BASE_FRM.fields.authorId}
                              changed={knowledgeBaseChange}
                            />
                          </Form>
                        </Card.Content>
                      </Card>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
          }
        </Modal.Content>
      </Modal>
    );
  }
}
