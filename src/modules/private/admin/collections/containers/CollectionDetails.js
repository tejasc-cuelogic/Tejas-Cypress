import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, useHistory, Link } from 'react-router-dom';
import { Modal, Card, Header, Icon } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import LockUnlockCollection from '../components/LockUnlockCollection';
import { SuspenseBoundary, lazyRetry, InlineLoader } from '../../../../../theme/shared';

const getModule = component => lazyRetry(() => import(`../components/${component}`));

const navItems = [
  {
    to: 'overview',
    title: 'Overview',
    component: 'Overview',
  },
  {
    to: 'marketing',
    title: 'Marketing',
    component: 'Marketing',
  },
];
function CollectionDetails(props) {
  // const isLocked = true;
  const history = useHistory();

  useEffect(() => {
    const { getCollection, initLoad } = props.collectionStore;
    if (!initLoad.includes('getCollection')) {
      getCollection(props.match.params.slug);
    }
  }, []);

  const handleCloseModal = () => {
    props.collectionStore.setFieldValue('initLoad', []);
    history.push(props.refLink);
  };

  const { match } = props;
  const { responsiveVars } = props.uiStore;
  const { collection, collectionLoading } = props.collectionStore;

  if (collectionLoading.includes('getCollection')) {
    return <InlineLoader />;
  }

  return (
    <>
      <Modal closeOnDimmerClick={false} closeOnRootNodeClick={false} closeOnEscape={false} closeIcon size="large" dimmer="inverted" open onClose={() => handleCloseModal()} centered={false}>
        <Modal.Content className="transaction-details">
          <Header as="h3">
            {collection.name}
            <Header.Subheader className="mt-10">
              <Link target="_blank" to={`/collections/preview/${collection.slug}`}>
                <Icon className="ns-view" /><b>Preview collection page</b>
              </Link>
            </Header.Subheader>
          </Header>
          <LockUnlockCollection />
          <Card fluid>
            <SecondaryMenu isBonusReward bonusRewards className="offer-details" offering match={match} navItems={navItems} responsiveVars={responsiveVars} />
            <SuspenseBoundary fallback={<InlineLoader styledAs={{ marginTop: '100px' }} />}>
              <Switch>
                {navItems.map((item) => {
                  const CurrentComponent = getModule(item.component);
                  return (
                    <Route
                      exact={false}
                      key={item.to}
                      path={`${match.url}/${item.to}`}
                      render={renderProps => (
                        <CurrentComponent
                          {...renderProps}
                        />
                      )
                      }
                    />
                  );
                })
                }
              </Switch>
            </SuspenseBoundary>
          </Card>
        </Modal.Content>
      </Modal>
    </>
  );
}
export default inject('collectionStore', 'uiStore', 'nsUiStore')(observer(CollectionDetails));
