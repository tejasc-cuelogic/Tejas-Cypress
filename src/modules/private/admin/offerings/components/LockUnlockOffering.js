import React from 'react';
import { inject, observer } from 'mobx-react';
import { Checkbox } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';

function LockUnlockOffering(props) {
  const adminLockOrUnlockOffering = () => {
    props.manageOfferingStore.adminLockOrUnlockOffering();
  };

  const { manageOfferingStore, nsUiStore } = props;
  const { loadingArray } = nsUiStore;
  console.log(manageOfferingStore);
  return loadingArray.includes('adminListEmailType') ? <InlineLoader /> : (
    <>
      <Checkbox
        name="isLocked"
        // value={isLocked}
        onChange={(e, result) => adminLockOrUnlockOffering(e, result)}
        // checked={isLocked}
        label="Lock Offering"
        toggle
      />
    </>
  );
}

export default inject('nsUiStore', 'manageOfferingStore')(observer(LockUnlockOffering));
