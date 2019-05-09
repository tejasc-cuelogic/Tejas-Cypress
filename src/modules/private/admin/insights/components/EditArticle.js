import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { join } from 'lodash';
import { Modal, Header, Divider, Grid, Card, Form, Checkbox, Button } from 'semantic-ui-react';
import { MaskedInput, FormInput, FormDropDown, ImageCropper } from '../../../../../theme/form';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { ARTICLE_STATUS_VALUES } from '../../../../../services/constants/admin/article';
import { Image64 } from '../../../../../theme/shared';
import Actions from './Actions';


@inject('articleStore', 'userStore')
@withRouter
@observer
export default class EditArticle extends Component {
  state = { displayMode: false };
  componentWillMount() {
    const { id } = this.props.match.params;
    if (id !== 'new') {
      this.initiateFlow(id);
      this.props.articleStore.setFormData(id);
      this.props.articleStore.getCategoryList(false);
    }
  }
  onDrop = (files, name) => {
    const { id } = this.props.match.params;
    this.props.articleStore.setFileUploadData('ARTICLE_FRM', name, files, id);
  }
  setData = (attr, value, fieldName) => {
    this.props.articleStore.setThumbnail(attr, value, fieldName);
  }
  uploadMedia = (name) => {
    const { id } = this.props.match.params;
    this.props.articleStore.uploadMedia(name, 'ARTICLE_FRM', id);
  }
  handleDelDoc = () => {
    const { id } = this.props.match.params;
    this.props.articleStore.removeMedia('featuredImage', id);
  }
  handleresetProfilePhoto = (field) => {
    this.props.articleStore.resetThumbnail(field);
  }
  handelImageDeimension = (width, height, field) => {
    if (width < 200 || height < 200) {
      const attr = 'error';
      const errorMsg = 'Image size should not be less than 200 x 200.';
      this.props.articleStore.setThumbnail(attr, errorMsg, field);
    }
  }
  initiateFlow = (id) => {
    if (id !== 'new') {
      new Promise(() => {
        this.props.articleStore.getSingleInsightAdmin(id, false);
      }).then(() => {
        this.props.articleStore.setFormData(id);
      }).catch();
    } else {
      this.props.articleStore.reset();
    }
  }
  handleCloseModal = () => {
    // e.stopPropagation();
    if (this.props.match.params.id !== 'new') {
      this.props.articleStore.reset();
    }
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
    const { displayMode } = this.state;
    const {
      ARTICLE_FRM,
      articleChange,
      maskChange,
      htmlContentChange,
      categoriesDropdown,
      handleVerifyFileExtension,
    } = this.props.articleStore;
    const isNew = this.props.match.params.id === 'new';
    // const access = this.props.userStore.myAccessForModule('OFFERINGS');
    // const isManager = access.asManager;
    // const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    // const isReadonly = !isManager &&
    // (this.props.status === 'PENDING' || this.props.status === 'PUBLISHED');
    return (
      <Modal closeOnDimmerClick={false} closeOnEscape={false} dimmer="inverted" open onClose={this.handleCloseModal} size="large" closeIcon>
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
                    ishidelabel
                    fluid
                    type="text"
                    name="title"
                    fielddata={ARTICLE_FRM.fields.title}
                    changed={articleChange}
                  />
                  <HtmlEditor
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
                      <FormInput
                        name="author"
                        fielddata={ARTICLE_FRM.fields.author}
                        changed={articleChange}
                      />
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
                        value={ARTICLE_FRM.fields.tags.value ? join(ARTICLE_FRM.fields.tags.value, ', ') : ''}
                        changed={articleChange}
                      />
                      <MaskedInput
                        containerclassname={displayMode ? 'display-only' : ''}
                        readOnly={false}
                        name="minuteRead"
                        number
                        value={ARTICLE_FRM.fields.minuteRead.value}
                        fielddata={ARTICLE_FRM.fields.minuteRead}
                        changed={maskChange}
                      />
                      {
                        ['banner', 'slug'].map(field => (
                          <FormInput
                            key={field}
                            name={field}
                            fielddata={ARTICLE_FRM.fields[field]}
                            onChange={(e, result) => articleChange(e, result)}
                          />))
                      }
                      <Checkbox
                        name="isFeatured"
                        value={ARTICLE_FRM.fields.isFeatured.value}
                        onChange={(e, result) => articleChange(e, result)}
                        checked={
                          ARTICLE_FRM.fields.isFeatured &&
                          ARTICLE_FRM.fields.isFeatured.value
                        }
                        label="Featured Insight"
                      />
                    </Form>
                  </Card.Content>
                </Card>
                {
                  isNew ? '' :
                  <Card fluid>
                    <Card.Content>
                      <Header as="h4">Thumbnail</Header>
                      {ARTICLE_FRM.fields.featuredImage.preSignedUrl ? (
                        <div className="file-uploader attached">
                          {
                            <Button onClick={fieldName => this.handleDelDoc(fieldName)} circular icon={{ className: 'ns-close-light' }} />
                          }
                          <Image64 srcUrl={ARTICLE_FRM.fields.featuredImage.preSignedUrl} />
                        </div>
                    ) : (
                      <ImageCropper
                        fieldData={ARTICLE_FRM.fields.featuredImage}
                        setData={(attr, value) => this.setData(attr, value, 'featuredImage')}
                        verifyExtension={handleVerifyFileExtension}
                        handelReset={() => this.handleresetProfilePhoto('featuredImage')}
                        verifyImageDimension={this.handelImageDeimension}
                        field={ARTICLE_FRM.fields.featuredImage}
                        modalUploadAction={this.uploadMedia}
                        name="featuredImage"
                        cropInModal
                        aspect={3 / 2}
                      />
                  )}
                    </Card.Content>
                  </Card>
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}
