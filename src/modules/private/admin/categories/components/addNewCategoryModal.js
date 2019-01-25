import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Button, Modal, Header, Form } from 'semantic-ui-react';
import { FormInput, FormTextarea } from '../../../../../theme/form';

@withRouter
@inject('categoryStore')
@observer
class AddNewCategory extends Component {
  componentWillMount() {
    console.log('selectedCategoryState ->', this.props.categoryStore.selectedCategoryState);
    if (this.props.match.params.id !== 'new') {
      this.props.categoryStore.setFormData(this.props.match.params.id);
    } else {
      this.props.categoryStore.reset();
    }
  }
    handleClose = () => this.props.history.push(this.props.refLink);
    addCategory = () => {
      const { saveCategories } = this.props.categoryStore;
      saveCategories(this.props.match.params.id);
      this.handleClose();
    }
    render() {
      const { formChange, CATEGORY_DETAILS_FRM, selectedCategoryState } = this.props.categoryStore;
      const { id } = this.props.match.params;
      return (
        <Modal
          closeIcon
          open
          onClose={this.handleClose}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          size="medium"
        >
          <Modal.Content className="transaction-details">
            <Header as="h3">
              {id === 'new' ? `Add New ${selectedCategoryState.title} Category` : `Update ${selectedCategoryState.title} Category`}
            </Header>
            <div className="left-align mt-30">
              <Form>
                <FormInput
                  key="categoryName"
                  name="categoryName"
                  fielddata={CATEGORY_DETAILS_FRM.fields.categoryName}
                  changed={(e, result) => formChange(e, result, 'CATEGORY_DETAILS_FRM')}
                />
                <FormTextarea
                  key="description"
                  name="description"
                  fielddata={CATEGORY_DETAILS_FRM.fields.description}
                  changed={(e, result) => formChange(e, result, 'CATEGORY_DETAILS_FRM')}
                  containerclassname="secondary"
                />
                <Button className="pull-right" color="green" disabled={!CATEGORY_DETAILS_FRM.meta.isValid} onClick={() => this.addCategory()} content="Add Category" />
              </Form>
            </div>
          </Modal.Content >
        </Modal>
      );
    }
}

export default AddNewCategory;
