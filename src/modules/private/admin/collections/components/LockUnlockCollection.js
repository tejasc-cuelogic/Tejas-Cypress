import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Checkbox } from 'semantic-ui-react';

function LockUnlockCollection(props) {
  const [lockStatus, setLockStatus] = useState(false);
  useEffect(() => {
    const { collection } = props.collectionStore;
    const lock = get(collection, 'lock');
    if (lock) {
      setLockStatus(true);
    }
  }, [lockStatus]);
  const adminLockOrUnlockCollection = (result, forceUnlockEnabled = false) => {
    const aResult = result;
    const action = forceUnlockEnabled ? 'FORCE_UNLOCK' : get(aResult, 'checked') ? 'LOCK' : 'UNLOCK';
    props.collectionStore.adminLockOrUnlockCollection(action).then(() => {
      setLockStatus(get(aResult, 'checked'));
    }).catch((err) => {
      const message = get(err, 'message') || '';
      if (message.includes('Not authorized.') || message.includes('has the lock')) {
        window.location.reload();
      }
    });
  };

  const handleForceUnlock = (e) => {
    e.preventDefault();
    adminLockOrUnlockCollection({ checked: true }, true);
  };

  const { nsUiStore, collectionStore, userDetailsStore } = props;
  const { currentUserId } = userDetailsStore;
  const { loadingArray } = nsUiStore;
  const { collection } = collectionStore;
  const lock = get(collection, 'lock');
  return (
    <>
      <Checkbox
        disabled={(lock && (currentUserId !== get(lock, 'id'))) || loadingArray.includes('adminLockOrUnlockCollection')}
        name="isLocked"
        value={lockStatus}
        onChange={(e, result) => adminLockOrUnlockCollection(result)}
        checked={lockStatus}
        label={loadingArray.includes('adminLockOrUnlockCollection') ? 'Loading...' : lockStatus ? 'Unlock Collection' : 'Lock Collection'}
        toggle
        className="negative-toggle"
      />
      {get(lock, 'user') && currentUserId !== get(lock, 'userId')
        ? (
          <>
            <div className="mt-10">Collection is locked by {get(lock, 'user')}</div>
            <Link to="/" onClick={() => handleForceUnlock()} disabled={loadingArray.includes('adminLockOrUnlockCollection')}>Force Unlock</Link>
          </>
        ) : ''}
    </>
  );
}

export default inject('nsUiStore', 'collectionStore', 'collectionStore', 'userDetailsStore')(observer(LockUnlockCollection));
