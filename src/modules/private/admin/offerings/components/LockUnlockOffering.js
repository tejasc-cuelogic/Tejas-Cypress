import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Checkbox } from 'semantic-ui-react';

function LockUnlockOffering(props) {
  const [lockStatus, setLockStatus] = useState(false);
  useEffect(() => {
    const { offer } = props.offeringsStore;
    const lock = get(offer, 'lock');
    if (lock) {
      setLockStatus(true);
    }
  }, [lockStatus]);
  const adminLockOrUnlockOffering = (result, forceUnlockEnabled = false) => {
    const aResult = result;
    const action = forceUnlockEnabled ? 'FORCE_UNLOCK' : get(aResult, 'checked') ? 'LOCK' : 'UNLOCK';
    props.manageOfferingStore.adminLockOrUnlockOffering(action).then(() => {
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
    adminLockOrUnlockOffering({ checked: true }, true);
  };

  const { nsUiStore, offeringsStore, userDetailsStore } = props;
  const { currentUserId } = userDetailsStore;
  const { loadingArray } = nsUiStore;
  const { offer } = offeringsStore;
  const lock = get(offer, 'lock');
  return (
    <>
      <Checkbox
        disabled={(lock && (currentUserId !== get(lock, 'userId'))) || loadingArray.includes('adminLockOrUnlockOffering')}
        name="isLocked"
        value={lockStatus}
        onChange={(e, result) => adminLockOrUnlockOffering(result)}
        checked={lockStatus}
        label={loadingArray.includes('adminLockOrUnlockOffering') ? 'Loading...' : lockStatus ? 'Unlock Offering' : 'Lock Offering'}
        toggle
        className="negative-toggle"
      />
      {get(lock, 'user') && currentUserId !== get(lock, 'userId')
      ? (
        <>
          <div className="mt-10">Offering is locked by {get(lock, 'user')}</div>
          <Link to="/" onClick={handleForceUnlock} disabled={loadingArray.includes('adminLockOrUnlockOffering')}>Force Unlock</Link>
        </>
      ) : ''}
    </>
  );
}

export default inject('nsUiStore', 'manageOfferingStore', 'offeringsStore', 'userDetailsStore')(observer(LockUnlockOffering));
