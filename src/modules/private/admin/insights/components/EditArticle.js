import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Grid, Card, Form } from 'semantic-ui-react';
import { FormInput, FormDropDown, DropZoneConfirm as DropZone } from '../../../../../theme/form';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { ARTICLE_STATUS_VALUES, AUTHORS } from '../../../../../services/constants/admin/article';
import Actions from './Actions';


@inject('articleStore', 'userStore', 'offeringCreationStore')
@withRouter
@observer
export default class EditArticle extends Component {
  // state = { displayMode: false };
  componentWillMount() {
    this.initiateFlow(this.props.match.params.id);
    const { id } = this.props.match.params;
    if (id !== 'new') {
      this.props.articleStore.setFormData(id);
    } else {
      this.props.articleStore.reset();
    }
    // this.props.articleStore.reset();
  }
  onDrop = (files, name) => {
    this.props.articleStore.setFileUploadData('ARTICLE_FRM', name, files);
  }
  initiateFlow = (id) => {
    if (id !== 'new') {
      this.props.articleStore.getArticle(id, false);
    } else {
      this.props.articleStore.reset();
    }
  }
  handleCloseModal = () => {
    // e.stopPropagation();
    this.props.history.replace(this.props.refLink);
  };

  save = (status) => {
    console.log(status);
    this.props.articleStore.save(this.props.match.params.id);
    // const access = this.props.userStore.myAccessForModule('OFFERINGS');
    // const isManager = access.asManager;
    // this.props.articleStore.save(this.props.match.params.id,
    // status, isManager, this.props.status === 'PUBLISHED');
    this.props.history.push(this.props.refLink);
    this.handleCloseModal();
  }
  render() {
    // const { displayMode } = this.state;
    const {
      ARTICLE_FRM,
      articleChange,
      htmlContentChange,
      categoriesDropdown,
    } = this.props.articleStore;
    console.log(categoriesDropdown);
    const isNew = this.props.match.params.id === 'new';
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
              {isNew ? 'Create' : 'Edit'} Article
              <Actions save={this.save} meta={ARTICLE_FRM.meta} />
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
                    Article settings
                    </Header>
                    <Form>
                      <div className="field">
                        <FormDropDown
                          fielddata={ARTICLE_FRM.fields.articleStatus}
                          selection
                          containerclassname="dropdown-field"
                          value={ARTICLE_FRM.fields.articleStatus.value}
                          placeholder="Choose here"
                          name="articleStatus"
                          options={ARTICLE_STATUS_VALUES}
                          onChange={(e, result) => articleChange(e, result)}
                        />
                      </div>
                      <div className="field">
                        <FormDropDown
                          fielddata={ARTICLE_FRM.fields.author}
                          selection
                          containerclassname="dropdown-field"
                          value={ARTICLE_FRM.fields.author.value}
                          placeholder="Choose here"
                          name="author"
                          options={AUTHORS}
                          onChange={(e, result) => articleChange(e, result)}
                        />
                      </div>
                      {/* <FormInput
                        name="author"
                        fielddata={ARTICLE_FRM.fields.author}
                        changed={articleChange}
                      /> */}
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
                      <FormInput
                        name="tags"
                        fielddata={ARTICLE_FRM.fields.tags}
                        changed={articleChange}
                      />
                      <FormInput
                        name="minuteRead"
                        fielddata={ARTICLE_FRM.fields.minuteRead}
                        changed={articleChange}
                      />
                      {/* <MaskedInput
                        containerclassname={displayMode ? 'display-only' : ''}
                        readOnly={displayMode}
                        name="minuteRead"
                        number
                        value={ARTICLE_FRM.fields.minuteRead.value}
                        fielddata={ARTICLE_FRM.fields.minuteRead}
                        changed={articleChange}
                      /> */}
                      <FormInput
                        name="banner"
                        fielddata={ARTICLE_FRM.fields.banner}
                        changed={articleChange}
                      />
                    </Form>
                  </Card.Content>
                </Card>
                <Card fluid>
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
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}
