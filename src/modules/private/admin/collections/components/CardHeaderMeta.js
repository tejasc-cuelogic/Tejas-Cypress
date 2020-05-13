import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { arrayMove, SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { Form, Button, Icon, Header, Divider } from 'semantic-ui-react';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'collectionStore',
  form: 'CARD_HEADER_SOCIAL_FRM',
};

const DragHandle = sortableHandle(() => <Icon className="ml-10 ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({ CARD_HEADER_SOCIAL_FRM, isReadOnly, fieldIndex, smartElement, removeOne }) => (
  <div className="row-wrap">
    <div className="balance-half simple-drag-row-title">
      <DragHandle />
      {smartElement.FormDropDown('type', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'social', fieldIndex], containerwidth: 8 })}
    </div>
    <div className="balance-half">
      {smartElement.Input('url', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'social', fieldIndex], ishidelabel: true })}
    </div>
    <div className="action">
      {!isReadOnly && CARD_HEADER_SOCIAL_FRM.fields.social.length > 1 && (
        <Button icon circular floated="right" className="link-button">
          <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'social', fieldIndex, e)} />
        </Button>
      )}
    </div>
  </div>
  // <Table.Body>
  //   <Table.Row>
  //     <Table.Cell collapsing>
  //       <DragHandle />
  //       {/* {!isReadOnly && <DragHandle />} */}
  //     </Table.Cell>
  //     <Table.Cell>
  //       {smartElement.FormSelect('type', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'social', fieldIndex], containerwidth: 8 })}
  //     </Table.Cell>
  //     <Table.Cell>
  //       {smartElement.Input('url', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'social', fieldIndex] })}
  //     </Table.Cell>
  //     {!isReadOnly && CARD_HEADER_SOCIAL_FRM.fields.social.length > 1 && (
  //       <Table.Cell collapsing>
  //         <Button icon circular floated="right" className="link-button">
  //           <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'social', fieldIndex, e)} />
  //         </Button>
  //       </Table.Cell>
  //     )}
  //   </Table.Row>
  // </Table.Body>
));
const SortableList = SortableContainer(({ collection, CARD_HEADER_SOCIAL_FRM, isReadOnly, smartElement, removeOne }) => (
  <div>
    {/* <div className="row-wrap">
      <Form.Group className="mlr-0 plr-0 pt-0 pb-0">
        <Table basic compact className="form-table"> */}
    {CARD_HEADER_SOCIAL_FRM.fields.social.map((field, index) => (
      <SortableItem
        // eslint-disable-next-line react/no-array-index-key
        key={`item-${index}`}
        field={field}
        fieldIndex={index}
        index={index}
        isReadOnly={isReadOnly}
        smartElement={smartElement}
        CARD_HEADER_SOCIAL_FRM={CARD_HEADER_SOCIAL_FRM}
        removeOne={removeOne}
        collection={collection}
      />
    ))}
    {/* </Table>
      </Form.Group>
    </div> */}
  </div>
));

const MetaList = ({ collection, CARD_HEADER_SOCIAL_FRM, isReadOnly, onSortEnd, smartElement, removeOne }) => (
  <SortableList
    CARD_HEADER_SOCIAL_FRM={CARD_HEADER_SOCIAL_FRM}
    pressDelay={100}
    onSortEnd={onSortEnd}
    lockAxis="y"
    useDragHandle
    isReadOnly={isReadOnly}
    smartElement={smartElement}
    removeOne={removeOne}
    collection={collection}
  />
);

function CardHeaderMeta(props) {
  const { smartElement, collectionStore, title, noAddMore, additinalInfoLenght } = props;
  const { CARD_HEADER_SOCIAL_FRM, removeOne, addMore, collection } = collectionStore;
  const isReadOnly = get(collection, 'lock');

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const social = [...props.collectionStore.CARD_HEADER_SOCIAL_FRM.fields.social];
    props.collectionStore.reOrderHandle(arrayMove(social, oldIndex, newIndex), 'CARD_HEADER_SOCIAL_FRM', 'social');
    props.collectionStore.setFieldValue('onDragSaveEnable', true);
  };
  return (
    <>
      <Form>
        <Header as="h4">
          {title || 'Social Links'}
          {(!isReadOnly && !noAddMore && CARD_HEADER_SOCIAL_FRM.fields.social.length < additinalInfoLenght)
            && <Button size="small" color="blue" className="ml-10 link-button mt-20" onClick={() => addMore('CARD_HEADER_SOCIAL_FRM', 'social')}>+ Add</Button>
          }
        </Header>
        <Divider hidden />
        <div className="ui basic compact table form-table social-links-table">
          <div className="row-wrap thead">
            <div className="balance-half">Type</div>
            <div className="balance-half">Url</div>
            <div className="action width-70">Actions</div>
          </div>
          <MetaList
            smartElement={smartElement}
            isReadOnly={isReadOnly}
            collection={collection}
            removeOne={removeOne}
            CARD_HEADER_SOCIAL_FRM={CARD_HEADER_SOCIAL_FRM}
            onSortEnd={onSortEnd}
          />
        </div>
      </Form>
    </>
  );
}

export default (withRouter(formHOC(observer(CardHeaderMeta), metaInfo)));
