/*  eslint-disable jsx-a11y/label-has-for */
import React, { useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { Switch, Route, useHistory } from 'react-router-dom';
// import Content from '../../../shared/marketing/Content';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { SuspenseBoundary, lazyRetry } from '../../../../../theme/shared';
import Content from './Content';


const getModule = component => lazyRetry(() => import(`../components/${component}`));

const navItems = [
  {
    to: 'card',
    title: 'Card',
    component: 'Tombstone',
  },
  {
    to: 'header',
    title: 'Header',
    component: 'CollectionHeader',
  },
  {
    to: 'content',
    title: 'Content',
    component: 'Content',
  },
];

function Marketing(props) {
  const { match } = props;
  const history = useHistory();

  useEffect(() => {
    props.collectionStore.setFormData('TOMBSTONE_FRM', 'marketing.tombstone');
    const { url, isExact } = match;
    if (isExact) {
      history.push(`${url}/card`);
    }
  }, []);

  return (
    <>
      <SecondaryMenu force2ary match={match} navItems={navItems} />
      <SuspenseBoundary>
        <Switch>
          <Route exact path={match.url} component={Content} />
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
                    {...item.additionalProps}
                  />
                )
                }
              />
            );
          })
          }
        </Switch>
      </SuspenseBoundary>
    </>
  );
}

export default inject('collectionStore')(observer(Marketing));
