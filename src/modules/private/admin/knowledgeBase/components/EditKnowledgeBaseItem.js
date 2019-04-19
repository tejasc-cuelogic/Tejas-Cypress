import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Grid, Card, Form } from 'semantic-ui-react';
import { FormInput, FormDropDown } from '../../../../../theme/form';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { ARTICLE_STATUS_VALUES, USER_TYPES } from '../../../../../services/constants/admin/knowledgeBase';
import Actions from './Actions';


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
      this.props.knowledgeBaseStore.getArticle(id, false);
    } else {
      this.props.knowledgeBaseStore.reset();
    }
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
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
      ARTICLE_FRM,
      articleChange,
      htmlContentChange,
      categoriesDropdown,
    } = this.props.knowledgeBaseStore;
    // console.log('ARTICLE_FRM',ARTICLE_FRM);
    // const isNew = this.props.match.params.id === 'new';
    // const access = this.props.userStore.myAccessForModule('OFFERINGS');
    // const isManager = access.asManager;
    // const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    // const isReadonly = !isManager &&
    // (this.props.status === 'PENDING' || this.props.status === 'PUBLISHED');
    return (
      <Modal dimmer="inverted" open onClose={this.handleCloseModal} size="large" closeIcon>
        <Modal.Content className="transaction-details">
          <div>
            <Header as="h3">
              Instead of Selling Equity
              <Actions save={this.save} meta={ARTICLE_FRM.meta} />
            </Header>
          </div>
          <Divider hidden />
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <small>Article Title</small>
                <Form>
                  <FormInput
                    // readOnly={(this.props.status === 'PUBLISHED' &&
                    // isManager) ? !this.state.editForm : isReadonly}
                    ishidelabel
                    fluid
                    type="text"
                    name="title"
                    fielddata={ARTICLE_FRM.fields.title}
                    changed={articleChange}
                  />
                  <HtmlEditor
                    // readOnly={(this.props.status === 'PUBLISHED'
                    // && isManager) ? !this.state.editForm : isReadonly}
                    changed={htmlContentChange}
                    name="content"
                    content={ARTICLE_FRM.fields.content.value}
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
                      {/* <FormRadioGroup
                        fielddata={ARTICLE_FRM.fields.itemStatus}
                        name="itemStatus"
                        changed={(e, result) => personalInfoChange(e, result)}
                        containerclassname="button-radio center-align"
                      /> */}
                      <div className="field">
                        <FormDropDown
                          fielddata={ARTICLE_FRM.fields.userType}
                          selection
                          containerclassname="dropdown-field"
                          value={ARTICLE_FRM.fields.userType.value}
                          placeholder="Choose here"
                          name="userType"
                          options={USER_TYPES}
                          onChange={(e, result) => articleChange(e, result)}
                        />
                      </div>
                      <div className="field">
                        <FormDropDown
                          fielddata={ARTICLE_FRM.fields.categoryId}
                          selection
                          containerclassname="dropdown-field"
                          value={ARTICLE_FRM.fields.categoryId.value}
                          placeholder="Choose here"
                          name="categoryId"
                          options={categoriesDropdown}
                          onChange={(e, result) => articleChange(e, result)}
                        />
                      </div>
                      <div className="field">
                        <FormDropDown
                          fielddata={ARTICLE_FRM.fields.itemStatus}
                          selection
                          containerclassname="dropdown-field"
                          value={ARTICLE_FRM.fields.itemStatus.value}
                          placeholder="Choose here"
                          name="itemStatus"
                          options={ARTICLE_STATUS_VALUES}
                          onChange={(e, result) => articleChange(e, result)}
                        />
                      </div>
                      <FormInput
                        type="text"
                        name="authorId"
                        fielddata={ARTICLE_FRM.fields.authorId}
                        changed={articleChange}
                      />
                    </Form>
                  </Card.Content>
                </Card>
                {/* <Card fluid>
                  <Card.Content>
                    <Header as="h4">Thumbnail</Header>
                    <DropZone
                      name="featuredImage"
                      fielddata={ARTICLE_FRM.fields.featuredImage}
                      ondrop={(files, name) => this.onDrop(files, name)}
                      onremove={fieldName => this.handleDelDoc(fieldName)}
                      uploadtitle="Upload a file  or drag it here"
                      containerclassname="field"
                    />
                  </Card.Content>
                </Card> */}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}
