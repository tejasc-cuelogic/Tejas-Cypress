import TAFFY from 'taffy';
import { uniqWith, isEqual, isArray } from 'lodash';

class ClientDb {
  database = null;
  initiateDb = (data, isUniqWith = false) => {
    this.database = TAFFY(isUniqWith ? uniqWith(data, isEqual) : data);
    return this.getDatabase();
  };

  getDatabase = () => this.database().get();

  removeRecord = (key, value) => this.database({ [key]: value }).remove();

  getCount() {
    return (this.database && this.database() && this.database().get() &&
    this.database().get().length) || 0;
  }

  filterData = (key, value, filterBy = null, customKey = null, setDb = true) => {
    let resultArray = [];
    const filterByObj = filterBy ? { [filterBy]: value } : value;
    const customKeyVal = customKey ? { [customKey]: filterByObj } : filterByObj;
    if (isArray(value)) {
      value.map((val) => {
        const filterByObjArray = filterBy ? { [filterBy]: val } : val;
        const customKeyValArray = customKey ? { [customKey]: filterByObjArray } : filterByObjArray;
        resultArray = [...this.database({ [key]: customKeyValArray }).get(), ...resultArray];
        return false;
      });
    } else {
      resultArray = [...this.database({ [key]: customKeyVal }).get()];
    }
    return setDb ? this.initiateDb(resultArray, true) : uniqWith(resultArray, isEqual);
  }

  filterByDate = (sDate, eDate, key = 'date', subkey = null) => {
    const data = this.getDatabase();
    const filterData = data.filter(e => parseInt((subkey ? e[key][subkey] : e[key]), 10)
      <= eDate && parseInt((subkey ? e[key][subkey] : e[key]), 10) >= sDate);
    this.initiateDb(filterData, true);
  }
}

export default new ClientDb();
