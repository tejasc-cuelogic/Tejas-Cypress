import React from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Modal, Card, Header } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
// import { InlineLoader } from '../../../../../theme/shared';
import LockUnlockOffering from '../../offerings/components/LockUnlockOffering';
// import CreationSummary from '../components/CreationSummary';
import { SuspenseBoundary, lazyRetry, InlineLoader } from '../../../../../theme/shared';

import Overview from '../components/Overview';

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
  const { match, refLink } = props;
  const history = useHistory();
  const { responsiveVars } = props.uiStore;
  return (
    <>
      <Modal closeOnDimmerClick={false} closeOnRootNodeClick={false} closeOnEscape={false} closeIcon size="large" dimmer="inverted" open onClose={() => history.push(refLink)} centered={false}>
        <Modal.Content className="transaction-details">
          {/* Lock unlock component */}
          <Header as="h3">
            Collection Details
          </Header>
          <LockUnlockOffering />
          <Card fluid>
            <SecondaryMenu isBonusReward bonusRewards className="offer-details" offering match={match} navItems={navItems} responsiveVars={responsiveVars} />
            <SuspenseBoundary fallback={<InlineLoader styledAs={{ marginTop: '100px' }} />}>
              <Switch>
                <Route exact path={match.url} component={Overview} />
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
export default inject('collectionStore', 'uiStore')(observer(CollectionDetails));
