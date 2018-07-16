class Helper {
  getFundingTypeIndex = (value) => {
    let index = '';
    if (value === 'check') {
      index = 0;
    } else if (value === 'iraTransfer') {
      index = 1;
    } else if (value === 'directRollOver') {
      index = 2;
    }
    return index;
  }

  getAccountTypeIndex = (value) => {
    let index = '';
    if (value === 'traditional') {
      index = 0;
    } else if (value === 'roth') {
      index = 1;
    }
    return index;
  }
}

export default new Helper();
