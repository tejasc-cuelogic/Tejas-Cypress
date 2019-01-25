import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Button, Modal, Header, Form } from 'semantic-ui-react';
import { FormInput, FormTextarea } from '../../../../../theme/form';

@withRouter
@inject('categoryStore')
@observer
class AddNewCategory extends Component {
    handleClose = () => this.props.history.goBack();
    addCategory = () => {
      console.log('Category has been added');
      const { saveCategories } = this.props.categoryStore;
      saveCategories();
      this.closeModal();
    }
    render() {
      const { formChange, CATEGORY_DETAILS_FRM } = this.props.categoryStore;
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
                              Add New Issuer FAQ Category
            </Header>
            <div className="left-align mt-30">
              <Form>
                <FormInput
                  // displayMode={isReadonly}
                  key="categoryName"
                  name="categoryName"
                  fielddata={CATEGORY_DETAILS_FRM.fields.categoryName}
                  changed={(e, result) => formChange(e, result, 'CATEGORY_DETAILS_FRM')}
                />
                <FormTextarea
                  // readOnly={isReadonly}
                  key="description"
                  name="description"
                  fielddata={CATEGORY_DETAILS_FRM.fields.description}
                  changed={(e, result) => formChange(e, result, 'CATEGORY_DETAILS_FRM')}
                  containerclassname="secondary"
                />
                <Button className="pull-right" color="green" onClick={() => this.addCategory()} />
              </Form>
            </div>
          </Modal.Content >
        </Modal>
      );
    }
}

export default AddNewCategory;
