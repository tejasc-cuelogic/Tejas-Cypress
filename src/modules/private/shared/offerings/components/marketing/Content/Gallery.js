import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Button, Icon, Header, Table, Divider } from 'semantic-ui-react';
import formHOC from '../../../../../../../theme/form/formHOC';
import OfferingButtonGroup from '../../OfferingButtonGroup';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'GALLERY_FRM',
};

function Gallery(props) {
  const { smartElement, manageOfferingStore, title, noAddMore, offeringCreationStore } = props;
  const { GALLERY_FRM, removeOne, addMore, campaignStatus } = manageOfferingStore;
  const { currentOfferingId } = offeringCreationStore;
  const isReadOnly = campaignStatus.lock;
  const removeMedia = (form, name) => {
    console.log(form, name);
  };
  const handleFormSubmit = () => {
    const params = {
      forms: 'GALLERY_FRM',
    };
    props.manageOfferingStore.updateOffering(params);
  };
  return (
    <>
      <Header as="h4">
        {title || 'Gallery'}
        {(!isReadOnly && !noAddMore)
          && <Button size="small" color="blue" className="ml-10 link-button mt-20" onClick={() => addMore('GALLERY_FRM', 'gallery')}>+ Add another image</Button>
        }
      </Header>
      {GALLERY_FRM.fields.gallery.map((field, i) => (
        <Form.Group>
          <Table basic compact className="form-table">
            <Table.Body>
              <Table.Cell collapsing>
                {smartElement.FormCheckBox('isVisible', { customClass: 'customToggle', displayMode: isReadOnly, multiForm: [metaInfo.form, 'gallery', i], toggle: true, defaults: true })}
              </Table.Cell>
              <Table.Cell>
                {smartElement.Input('caption', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'gallery', i] })}
              </Table.Cell>
              <Table.Cell>
                <Header as="h4">{GALLERY_FRM.fields.gallery[i].image.label}</Header>
                {smartElement.ImageCropper('image', { style: { height: '125px' }, disabled: isReadOnly, multiForm: [metaInfo.form, 'gallery', i], uploadPath: `offerings/${currentOfferingId}`, removeMedia })}
              </Table.Cell>
              {!isReadOnly && GALLERY_FRM.fields.gallery.length > 1 && (
                <Table.Cell collapsing>
                  <Button icon circular floated="right" className="link-button">
                    <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'gallery', i, e)} />
                  </Button>
                </Table.Cell>
              )}
            </Table.Body>
          </Table>
        </Form.Group>
      ))}
      <Divider section />
      <OfferingButtonGroup
        updateOffer={handleFormSubmit}
      />
    </>
  );
}

export default inject('offeringCreationStore')(withRouter(formHOC(observer(Gallery), metaInfo)));
