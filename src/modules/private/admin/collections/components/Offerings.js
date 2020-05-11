/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { SortableContainer, SortableElement, arrayMove, sortableHandle } from 'react-sortable-hoc';
import { InlineLoader } from '../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES, OFFERING_REGULATIONS } from '../../../../../constants/offering';
import formHoc from '../../../../../theme/form/formHOC';

const actions = {
  publish: { label: 'Publish', icon: 'view', icon1: 'no-view' },
};

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_MAPPING_CONTENT_FRM',
};

// const removeMedia = (form, name) => {
//   window.logger(form, name);
// };

const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);

const SortableItem = SortableElement(({
  offering, handleAction,
}) => (
    <div className={(offering.isAvailablePublicly) ? 'row-wrap striped-table' : 'row-wrap row-highlight striped-table'}>
      <div className="balance first-column">
        <DragHandle />
        <Link to={`/dashboard/offering/${offering.offeringSlug}`}>
          <b>
            {((offering.keyTerms && offering.keyTerms.shorthandBusinessName)
              ? offering.keyTerms.shorthandBusinessName : (
                (offering.keyTerms && offering.keyTerms.legalBusinessName) ? offering.keyTerms.legalBusinessName : 'N/A'
              ))}
          </b>
          <br />
          {OFFERING_REGULATIONS[offering.keyTerms.regulation] && `${OFFERING_REGULATIONS[offering.keyTerms.regulation]} -`} {CAMPAIGN_KEYTERMS_SECURITIES[offering.keyTerms.securities]}
        </Link>
      </div>
      {}
      {/* <div className="balance">
        {smartElement.ImageCropper('image', {
          multiForm: [metaInfo.form, 'mappingContent', itemIndex],
          uploadPath: `collection/${collectionId}`,
          removeMedia,
          key: `item${itemIndex}`,
          isImagePreviewDisabled: true,
        })}
      </div> */}
      <div className="action right-align width-70">
        <Button.Group>
          {Object.keys(actions).map(action => (
            <Button icon className="link-button">
              <Icon className={`ns-${offering.isAvailablePublicly === 'PUBLIC' ? actions[action].icon : actions[action].icon1}`} onClick={() => handleAction(actions[action].label, offering, offering.isAvailablePublicly !== 'PUBLIC')} />
            </Button>
          ))}

          <Button icon className="link-button">
            <Icon className="ns-trash" onClick={() => handleAction('Delete', offering, !offering.isAvailablePublicly)} />
          </Button>
        </Button.Group>
      </div>
    </div>
  ));

const SortableList = SortableContainer((props) => {
  const { allOfferingsList, handleAction, stage, listIndex } = props;
  return (
    <div className="tbody">
      {allOfferingsList.map((offering, index) => (
        <SortableItem
          // eslint-disable-next-line react/no-array-index-key
          key={`item-${index}`}
          docIndx={index}
          offering={offering}
          handleAction={handleAction}
          itemIndex={index}
          stage={stage}
          listIndex={listIndex}
          {...props}
        />
      ))}
    </div>
);
});

@inject('uiStore', 'collectionStore')
@withRouter
@observer
class Offerings extends Component {
  state = { isPublic: false, loading: false };

  constructor(props) {
    super(props);
    if (!props.collectionStore.initLoad.includes('COLLECTION_MAPPING_CONTENT_FRM')) {
      props.collectionStore.setFormData('COLLECTION_MAPPING_CONTENT_FRM', false, true, this.props.offeringsList);
    }
  }

  onSortEnd = async ({ oldIndex, newIndex }) => {
    const { setOrderForCollectionsMapping, setFieldValue } = this.props.collectionStore;
    if (oldIndex !== newIndex) {
      this.setState({ loading: true });
      await setOrderForCollectionsMapping(arrayMove(this.props.offeringsList, oldIndex, newIndex));
      this.setState({ loading: false });
      setFieldValue('collectionIndex', null);
      this.props.history.push(`${this.props.match.url}`);
    }
  }

  handleAction = (action, offering, isPublished = false) => {
    if (action === 'Delete') {
      this.props.uiStore.setConfirmBox(action, offering.id);
    } else if (action === 'Publish') {
      this.setState({ isPublic: isPublished });
      this.props.uiStore.setConfirmBox(action, offering.id, isPublished);
    }
  }

  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }

  handlePublishOffering = async () => {
    const { collectionStore, uiStore } = this.props;
    const params = {
      type: 'OFFERING',
      collectionId: collectionStore.collectionId,
      referenceId: uiStore.confirmBox.refId,
      scope: this.state.isPublic ? 'PUBLIC' : 'HIDDEN',
    };
    await collectionStore.collectionMappingMutation('adminCollectionMappingUpsert', params);
    collectionStore.setFieldValue('collectionIndex', null);
    this.props.history.push(`${this.props.match.url}`);
    this.props.uiStore.setConfirmBox('');
  }

  handleDeleteCollection = async () => {
    const { collectionStore, uiStore } = this.props;
    const params = {
      type: 'OFFERING',
      collectionId: collectionStore.collectionId,
      referenceId: uiStore.confirmBox.refId,
    };
    await collectionStore.collectionMappingMutation('adminDeleteCollectionMapping', params);
    collectionStore.setFieldValue('collectionIndex', null);
    this.props.history.push(`${this.props.match.url}`);
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const {
      uiStore, stage, offeringsList, isLoading,
    } = this.props;

    const { confirmBox } = uiStore;
    if (isLoading || this.state.loading) {
      return <InlineLoader />;
    }
    return (
      <>
        <div className="ui card fluid">
          <div className="ui basic table">
            <div className="row-wrap striped-table thead">
              <div className="balance first-column">Name</div>
              <div className="action right-align width-70" />
            </div>
            <SortableList
              allOfferingsList={offeringsList}
              pressDelay={100}
              handleAction={this.handleAction}
              onSortEnd={e => this.onSortEnd(e)}
              stage={stage}
              lockAxis="y"
              useDragHandle
              {...this.props}
            />
          </div>
        </div>
        <Confirm
          header="Confirm"
          content={confirmBox.entity === 'Publish' ? `Are you sure you want to make this offering ${this.state.isPublic ? 'Public' : 'Non-Public'}?` : 'Are you sure you want to delete this offering?'}
          open={confirmBox.entity === 'Delete' || confirmBox.entity === 'Publish'}
          onCancel={this.handleDeleteCancel}
          onConfirm={confirmBox.entity === 'Publish' ? this.handlePublishOffering : this.handleDeleteCollection}
          size="mini"
          className="deletion"
        />
      </>
    );
  }
}

export default inject('collectionStore')(observer(formHoc(Offerings, metaInfo)));
