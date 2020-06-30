import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { DataFormatter } from '../../../../../helper';

function LockUnlockCollection(props) {
  const [lockStatus, setLockStatus] = useState(false);
  useEffect(() => {
    const { collection } = props.collectionStore;
    const lock = get(collection, 'lock');
    if (lock && !lockStatus) {
      setLockStatus(true);
    }
  }, [lockStatus]);
  const adminLockOrUnlockCollection = (result, forceUnlockEnabled = false) => {
    const aResult = result;
    const action = forceUnlockEnabled ? 'FORCE_UNLOCK' : get(aResult, 'lock') ? 'LOCK' : 'UNLOCK';
    props.collectionStore.adminLockOrUnlockCollection(action).then(() => {
      setLockStatus(get(aResult, 'lock'));
    }).catch((err) => {
      const message = get(err, 'message') || '';
      if (message.includes('Not authorized.') || message.includes('has the lock')) {
        window.location.reload();
      }
    });
  };

  const handleForceUnlock = (e) => {
    e.preventDefault();
    adminLockOrUnlockCollection({ value: true }, true);
  };

  const handlePersonalUnlock = (e) => {
    e.preventDefault();
    adminLockOrUnlockCollection({ value: true }, false);
  };

  const { nsUiStore, collectionStore, userDetailsStore } = props;
  const { currentUserId } = userDetailsStore;
  const { loadingArray } = nsUiStore;
  const { collection } = collectionStore;
  const lock = get(collection, 'lock');
  return (
    <>
      <span>
        <Button circular name="isLocked" color={lockStatus ? 'red' : 'green'} className="link-button ml-30" disabled={(lock && (currentUserId !== get(lock, 'id'))) || loadingArray.includes('adminLockOrUnlockCollection')}>
          <Icon lock={!lockStatus} className={`mr-10 ${lockStatus ? 'ns-lock' : 'ns-unlock'}`} onClick={(e, result) => adminLockOrUnlockCollection(result)} />
        </Button>
        {get(lock, 'by') && currentUserId !== get(lock, 'id')
        ? (
          <>
            <span className="mt-10">Locked by {get(lock, 'by')} on {DataFormatter.formatedDate(get(lock, 'date'))} {' '}
              (<Link to="/" onClick={handleForceUnlock} disabled={loadingArray.includes('adminLockOrUnlockCollection')}>Force Unlock</Link>)
            </span>
          </>
        ) : lockStatus
        ? (
          <>
            <span className="mt-10">Locked by me on {DataFormatter.formatedDate(get(lock, 'date'))} {' '}
              (<Link to="/" onClick={handlePersonalUnlock} disabled={loadingArray.includes('adminLockOrUnlockCollection')}>Unlock</Link>)
            </span>
          </>
        ) : 'Unlocked'}
      </span>
    </>
  );
}

export default inject('nsUiStore', 'collectionStore', 'userDetailsStore')(observer(LockUnlockCollection));
