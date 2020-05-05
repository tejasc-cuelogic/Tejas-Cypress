import React from 'react';
import { observer, inject } from 'mobx-react';
import { arrayMove } from 'react-sortable-hoc';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import DraggableMenu from '../../../../../theme/layout/DraggableMenu';
import NewContentModal from './NewContentModal';
import CollectionContent from './CollectionContent';
import { InlineLoader } from '../../../../../theme/shared';

// function Content(props) {
//   useEffect(() => {
//     if (!props.collectionStore.initLoad.includes('COLLECTION_CONTENT_FRM')) {
//       props.collectionStore.setFormData('COLLECTION_CONTENT_FRM', 'marketing');
//     }
//   }, []);

//   const [openModal, setOpenModal] = useState(false);

//   const toggleModal = (val, index = false) => {
//     setOpenModal(val);
//     if (index) {
//       props.collectionStore.removeOne('COLLECTION_CONTENT_FRM', 'content', index);
//     }
//   };

//   const checkValidFormIndexZero = () => {
//     const fields = props.collectionStore.COLLECTION_CONTENT_FRM.fields.content[0];
//     return (fields.title.value && fields.contentType.value && fields.scope.value);
//   };

//   const addMore = () => {
//     if (checkValidFormIndexZero()) {
//       props.collectionStore.addMore('COLLECTION_CONTENT_FRM', 'content');
//     }
//     toggleModal(true);
//   };

//   const onSortEnd = ({ oldIndex, newIndex }) => {
//     const docs = [...props.collectionStore.COLLECTION_CONTENT_FRM.fields.content];
//     props.collectionStore.reOrderHandle(arrayMove(docs, oldIndex, newIndex), 'COLLECTION_CONTENT_FRM', 'content');
//     props.collectionStore.setFieldValue('onDragSaveEnable', true);
//   };

//   const { match } = props;
//   const { COLLECTION_CONTENT_FRM } = props.collectionStore;
//   const navItems = [];
//   COLLECTION_CONTENT_FRM.fields.content.map((content, index) => {
//     navItems.push({ title: `${content.title.value !== '' ? content.title.value : `Content Block ${index + 1}`}`, to: `${index + 1}`, index });
//     return navItems;
//   });
//   return (
//     <div className="inner-content-spacer">
//       {openModal && <NewContentModal refLink={match.url} toggleModal={toggleModal} index={COLLECTION_CONTENT_FRM.fields.content.length - 1} />}
//       <Grid>
//         <Grid.Column widescreen={4} computer={4} tablet={3} mobile={16}>
//           <div className="sticky-sidebar">
//             <DraggableMenu secondary vertical match={match} onSortEnd={onSortEnd} navItems={navItems} />
//             {COLLECTION_CONTENT_FRM.fields.content.length < 10
//               && <Button size="small" color="blue" className="link-button mt-20" onClick={addMore}>+ Add another content block</Button>
//             }
//           </div>
//         </Grid.Column>
//         <Grid.Column widescreen={12} computer={12} tablet={13} mobile={16}>
//           <Switch>
//             <Route
//               exact
//               path={match.url}
//               render={renderProps => <CollectionContent refLink={match.url} {...renderProps} index={0} />}
//             />
//             {
//               navItems.map(item => (
//                 <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={renderProps => <CollectionContent refLink={match.url} {...renderProps} index={item.index || 0} />} />
//               ))
//             }
//           </Switch>
//         </Grid.Column>
//       </Grid>
//     </div>
//   );
// }
// export default inject('collectionStore')(observer(Content));

@inject('collectionStore', 'nsUiStore')
@withRouter
@observer
export default class Content extends React.Component {
  state = {
    openModal: false,
  };

  constructor(props) {
    super(props);
    if (props.isExact) {
      props.history.push('1');
    }

    if (!this.props.collectionStore.initLoad.includes('COLLECTION_CONTENT_FRM')) {
      this.props.collectionStore.setFormData('COLLECTION_CONTENT_FRM', 'marketing');
    }
    this.props.collectionStore.setFormData('TOMBSTONE_FRM', 'marketing.tombstone');
  }

  toggleModal = (val, index = false) => {
    this.setState({ openModal: val });
    if (index) {
      this.props.collectionStore.removeOne('COLLECTION_CONTENT_FRM', 'content', index);
    }
  }

  checkValidFormIndexZero = () => {
    const fields = this.props.collectionStore.COLLECTION_CONTENT_FRM.fields.content[0];
    return (fields.title.value && fields.contentType.value && fields.scope.value);
  }

  addMore = () => {
    if (this.checkValidFormIndexZero()) {
      this.props.collectionStore.addMore('COLLECTION_CONTENT_FRM', 'content');
    }
    this.toggleModal(true);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const docs = [...this.props.collectionStore.COLLECTION_CONTENT_FRM.fields.content];
    this.props.collectionStore.reOrderHandle(arrayMove(docs, oldIndex, newIndex), 'COLLECTION_CONTENT_FRM', 'content');
    this.props.collectionStore.setFieldValue('onDragSaveEnable', true);
  };

  render() {
    const { match } = this.props;
    const { COLLECTION_CONTENT_FRM } = this.props.collectionStore;
    const navItems = [];
    const { loadingArray } = this.props.nsUiStore;
    if (loadingArray.includes('getCollectionMapping')) {
      return <InlineLoader />;
    }
    COLLECTION_CONTENT_FRM.fields.content.map((content, index) => {
      navItems.push({ title: `${content.title.value !== '' ? content.title.value : `Content Block ${index + 1}`}`, to: `${index + 1}`, index });
      return navItems;
    });
    return (
      <div className="inner-content-spacer">
        {this.state.openModal && <NewContentModal refLink={match.url} toggleModal={this.toggleModal} index={COLLECTION_CONTENT_FRM.fields.content.length - 1} />}
        <Grid>
          <Grid.Column widescreen={4} computer={4} tablet={3} mobile={16}>
            <div className="sticky-sidebar">
              <DraggableMenu secondary vertical match={match} onSortEnd={this.onSortEnd} navItems={navItems} />
              {COLLECTION_CONTENT_FRM.fields.content.length < 10
                && <Button size="small" color="blue" className="link-button mt-20" onClick={this.addMore}>+ Add another content block</Button>
              }
            </div>
          </Grid.Column>
          <Grid.Column widescreen={12} computer={12} tablet={13} mobile={16}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={props => <CollectionContent refLink={match.url} {...props} index={0} />}
              />
              {
                navItems.map(item => (
                  <Route exact key={item.to} path={`${match.url}/:index`} render={props => <CollectionContent refLink={match.url} {...props} index={item.index || 0} />} />
                ))
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
