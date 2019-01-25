import React, { Component } from 'react';
import { Button, Modal, Header, Form } from 'semantic-ui-react';
import { FormInput, FormTextarea } from '../../../../../theme/form';


class AddNewCategory extends Component {
    handleClose = () => this.props.history.goBack();

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
                <Button content={this.state.modalIndex ? 'Update Category' : 'Add Category'} className="pull-right" color="green" onClick={() => this.addCategory()} />
              </Form>
            </div>
          </Modal.Content >
        </Modal>
      );
    }
}

export default AddNewCategory;
