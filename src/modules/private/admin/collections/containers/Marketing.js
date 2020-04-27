/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer, inject } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
// import Content from '../../../shared/marketing/Content';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { SuspenseBoundary, lazyRetry, InlineLoader } from '../../../../../theme/shared';
import Content from '../components/Content';


const getModule = component => lazyRetry(() => import(`../components/${component}`));

const navItems = [
  {
    to: 'content',
    title: 'Content',
    component: 'Content',
  },
  {
    to: 'tombstone',
    title: 'Tombstone',
    component: 'Tombstone',
  },
];

  function Marketing(props) {
    const { match } = props;
    return (
      <>
        <SecondaryMenu force2ary match={match} navItems={navItems} />
        <SuspenseBoundary fallback={<InlineLoader styledAs={{ marginTop: '100px' }} />}>
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
