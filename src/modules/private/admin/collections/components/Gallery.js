import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { arrayMove, SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { Form, Button, Icon, Header, Table, Divider } from 'semantic-ui-react';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'collectionStore',
  form: 'GALLERY_FRM',
};

const DragHandle = sortableHandle(() => <Icon className="ml-10 ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({ toggleVisible, GALLERY_FRM, isReadOnly, fieldIndex, smartElement, removeOne, currentOfferingId, removeMedia }) => (
  <div className="row-wrap">
    <Form.Group className="mlr-0 plr-0 pt-0 pb-0">
      <Table basic compact className="form-table bg-white">
        <Table.Body>
          <Table.Row className={GALLERY_FRM.fields.gallery[fieldIndex].isVisible.value ? '' : 'bg-offwhite'}>
            <Table.Cell collapsing>
              {!isReadOnly && <DragHandle />}
            </Table.Cell>
            <Table.Cell>
              {smartElement.Input('caption', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'gallery', fieldIndex] })}
            </Table.Cell>
            <Table.Cell>
              <Header as="h4">{GALLERY_FRM.fields.gallery[fieldIndex].image.label}</Header>
              {smartElement.ImageCropper('image', { style: { height: '125px' }, disabled: isReadOnly, multiForm: [metaInfo.form, 'gallery', fieldIndex], uploadPath: `offerings/${currentOfferingId}`, removeMedia })}
            </Table.Cell>
            <Table.Cell collapsing>
              <Button className="link-button">
                <Icon onClick={() => toggleVisible(fieldIndex)} color="blue" name={GALLERY_FRM.fields.gallery[fieldIndex].isVisible.value ? 'ns-view' : 'ns-no-view'} />
              </Button>
              {/* {smartElement.FormCheckBox('isVisible', { customClass: 'customToggle', displayMode: isReadOnly, multiForm: [metaInfo.form, 'gallery', fieldIndex], toggle: true, defaults: true })} */}
            </Table.Cell>
            {!isReadOnly && GALLERY_FRM.fields.gallery.length > 1 && (
              <Table.Cell collapsing>
                <Button icon circular floated="right" className="link-button">
                  <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'gallery', fieldIndex, e)} />
                </Button>
              </Table.Cell>
            )}
          </Table.Row>
        </Table.Body>
      </Table>
    </Form.Group>
  </div>
));
const SortableList = SortableContainer(({ toggleVisible, GALLERY_FRM, isReadOnly, smartElement, currentOfferingId, removeMedia, removeOne }) => (
  <div className="tbody">
    {GALLERY_FRM.fields.gallery.map((field, index) => (
      <SortableItem
        // eslint-disable-next-line react/no-array-index-key
        key={`item-${index}`}
        field={field}
        fieldIndex={index}
        index={index}
        isReadOnly={isReadOnly}
        smartElement={smartElement}
        GALLERY_FRM={GALLERY_FRM}
        currentOfferingId={currentOfferingId}
        removeMedia={removeMedia}
        removeOne={removeOne}
        toggleVisible={toggleVisible}
      />
    ))}
  </div>
));

const GalleryList = ({ toggleVisible, GALLERY_FRM, isReadOnly, onSortEnd, smartElement, currentOfferingId, removeMedia, removeOne }) => (
  <div className="ui card fluid">
    <SortableList
      GALLERY_FRM={GALLERY_FRM}
      pressDelay={100}
      onSortEnd={onSortEnd}
      lockAxis="y"
      useDragHandle
      isReadOnly={isReadOnly}
      smartElement={smartElement}
      currentOfferingId={currentOfferingId}
      removeMedia={removeMedia}
      removeOne={removeOne}
      toggleVisible={toggleVisible}
    />
  </div>
);

function Gallery(props) {
  const { smartElement, title, noAddMore, uiStore } = props;
  const { GALLERY_FRM, removeOne, addMore } = props.collectionStore;

  const { loadingArray } = props.nsUiStore;
  const removeMedia = (form, name) => {
    window.logger(form, name);
  };
  const handleFormSubmit = () => {
    const params = {
      forms: ['GALLERY_FRM'],
    };
    props.collectionStore.upsertCollection(params);
  };
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const gallery = [...props.collectionStore.GALLERY_FRM.fields.gallery];
    props.collectionStore.reOrderHandle(arrayMove(gallery, oldIndex, newIndex), 'GALLERY_FRM', 'gallery');
  };
  return (
    <>
      <Header as="h4">
        {title || 'Gallery'}
        {(!noAddMore)
          && <Button size="small" color="blue" className="ml-10 link-button mt-20" onClick={() => addMore('GALLERY_FRM', 'gallery')}>+ Add another image</Button>
        }
      </Header>
      <GalleryList
        GALLERY_FRM={GALLERY_FRM}
        removeOne={removeOne}
        removeMedia={removeMedia}
        smartElement={smartElement}
        onSortEnd={onSortEnd}
      />
      <div className="sticky-actions">
        <Button.Group vertical={uiStore.responsiveVars.isMobile} size={uiStore.responsiveVars.isMobile ? 'mini' : ''} compact={uiStore.responsiveVars.isMobile} className={uiStore.responsiveVars.isMobile ? 'sticky-buttons' : ''}>
          <Button disabled={loadingArray.includes('adminCollectionUpsert')} loading={loadingArray.includes('adminCollectionUpsert')} primary onClick={handleFormSubmit} color="green" className="relaxed">Save</Button>
        </Button.Group>
      </div>
      <Divider section />
    </>
  );
}

export default inject('collectionStore', 'uiStore', 'nsUiStore')(withRouter(formHOC(observer(Gallery), metaInfo)));
