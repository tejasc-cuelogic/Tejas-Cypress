import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateLayout';
import { ByKeyword as Search } from '../../../../../theme/form/Filters';
import CollectionsListing from '../components/CollectionsListing';

function ManageCollections(props) {
  useEffect(() => {
    props.collectionStore.initRequest();
  }, []);

  const search = (e) => {
    if (e.charCode === 13) {
      // search goes here..
    }
  };

  const { match } = props;
  const {
    requestState,
  } = props.collectionStore;
  return (
    <PrivateLayout
      refMatch={props.refMatch}
      {...props}
      P1={(
        <Search
          {...props}
          w={[10]}
          placeholder="Search by keyword or phrase"
          change={e => search(e, 'title')}
          addon={(
            <Grid.Column width={3} textAlign="right" floated="right">
              <Button color="green" as={Link} floated="right" to={`${match.url}/new/draft`}>
                Add new article
                </Button>
            </Grid.Column>
          )}
          requestState={requestState}
          more="no"
        />
      )}
    >
      <CollectionsListing match={match} />
    </PrivateLayout>
  );
}
export default inject('collectionStore')(observer(ManageCollections));
