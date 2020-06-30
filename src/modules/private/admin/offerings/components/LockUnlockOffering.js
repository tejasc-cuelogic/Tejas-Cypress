import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';
import { DataFormatter } from '../../../../../helper';

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
    const action = forceUnlockEnabled ? 'FORCE_UNLOCK' : get(aResult, 'lock') ? 'LOCK' : 'UNLOCK';
    props.manageOfferingStore.adminLockOrUnlockOffering(action).then(() => {
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
    adminLockOrUnlockOffering({ value: true }, true);
  };

  const handlePersonalUnlock = (e) => {
    e.preventDefault();
    adminLockOrUnlockOffering({ value: true }, false);
  };

  const { nsUiStore, offeringsStore, userDetailsStore } = props;
  const { currentUserId } = userDetailsStore;
  const { loadingArray } = nsUiStore;
  const { offer } = offeringsStore;
  const lock = get(offer, 'lock');
  return (
    <>
      <span>
        <Button circular name="isLocked" color={lockStatus ? 'red' : 'green'} className="link-button ml-30" disabled={(lock && (currentUserId !== get(lock, 'userId'))) || loadingArray.includes('adminLockOrUnlockOffering')}>
          <Icon lock={!lockStatus} className={`mr-10 ${lockStatus ? 'ns-lock' : 'ns-unlock'}`} onClick={(e, result) => adminLockOrUnlockOffering(result)} />
        </Button>
        {get(lock, 'user') && currentUserId !== get(lock, 'userId')
        ? (
          <>
            <span className="mt-10">Locked by {get(lock, 'user')} on {DataFormatter.formatedDate(get(lock, 'date'))} {' '}
              (<Link to="/" onClick={handleForceUnlock} disabled={loadingArray.includes('adminLockOrUnlockOffering')}>Force Unlock</Link>)
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

export default inject('nsUiStore', 'manageOfferingStore', 'offeringsStore', 'userDetailsStore')(observer(LockUnlockOffering));
