import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Button, Modal, Header, Form } from 'semantic-ui-react';
import { FormInput, FormTextarea } from '../../../../../theme/form';
import { FieldError } from '../../../../../theme/shared';

@withRouter
@inject('categoryStore', 'uiStore')
@observer
class AddNewCategory extends Component {
  componentWillMount() {
    this.props.uiStore.clearErrors();
    const { id } = this.props.match.params;
    if (id !== 'new') {
      this.props.categoryStore.setFormData(id);
    } else {
      this.props.categoryStore.reset();
    }
  }
    handleClose = () => {
      this.props.categoryStore.currentCategoryIndex =
      this.props.categoryStore.selectedCategoryState.index;
      this.props.history.push(this.props.refLink);
    }
    addCategory = () => {
      const { saveCategories } = this.props.categoryStore;
      saveCategories(this.props.match.params.id, 'defaultPublished').then(() => {
        this.handleClose();
      }).catch();
    }

    render() {
      const {
        formChange, CATEGORY_DETAILS_FRM, selectedCategoryState,
      } = this.props.categoryStore;
      const { errors } = this.props.uiStore;
      const { id } = this.props.match.params;
      return (
        <Modal
          closeIcon
          open
          onClose={this.handleClose}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          size="mini"
        >
          <Modal.Header className="center-align signup-header">
            <Header as="h4">{id === 'new' ? `Add New ${selectedCategoryState.title} Category` : `Update ${selectedCategoryState.title} Category`}
            </Header>
          </Modal.Header>
          <Modal.Content className="signup-content">
            <Form>
              <FormInput
                key="categoryName"
                name="categoryName"
                fielddata={CATEGORY_DETAILS_FRM.fields.categoryName}
                changed={(e, result) => formChange(e, result, 'CATEGORY_DETAILS_FRM')}
              />
              {errors &&
                <FieldError error={errors} />
              }
              <FormTextarea
                key="description"
                name="description"
                fielddata={CATEGORY_DETAILS_FRM.fields.description}
                changed={(e, result) => formChange(e, result, 'CATEGORY_DETAILS_FRM')}
              />
              <div className="center-align">
                <Button primary disabled={!CATEGORY_DETAILS_FRM.meta.isValid} onClick={() => this.addCategory()} content={id === 'new' ? 'Add Category' : 'Update Category'} />
              </div>
            </Form>
          </Modal.Content >
        </Modal>
      );
    }
}

export default AddNewCategory;
