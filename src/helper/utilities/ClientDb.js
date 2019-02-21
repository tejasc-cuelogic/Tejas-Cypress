import TAFFY from 'taffy';
import { uniqWith, isEqual, isArray, map } from 'lodash';

class ClientDb {
  database = null;
  initiateDb = (data, isUniqWith = false, isReplaceId = false, idReplaceKey = 'refId') => {
    let updatedData = data;
    if (isReplaceId) {
      updatedData = map(data, e => ({ [idReplaceKey]: e.id, ...e }));
    }
    this.database = TAFFY(isUniqWith ? uniqWith(updatedData, isEqual) : updatedData);
    return this.getDatabase();
  };

  getDatabase = () => this.database().get();

  removeRecord = (key, value) => this.database({ [key]: value }).remove();

  getCount() {
    return (this.database && this.database() && this.database().get() &&
    this.database().get().length) || 0;
  }

  getFilterParaObj = (key, parameters) =>
    (isArray(key) ? key.map(k => ({ [k]: parameters })) : { [key]: parameters });

  filterData = (key, value, filterBy = null, customKey = null, setDb = true) => {
    let resultArray = [];
    const filterByObj = filterBy ? { [filterBy]: value } : value;
    const customKeyVal = customKey ? { [customKey]: filterByObj } : filterByObj;
    if (isArray(value) && !isArray(key)) {
      value.map((val) => {
        const filterByObjArray = filterBy ? { [filterBy]: val } : val;
        const customKeyValArray = customKey ? { [customKey]: filterByObjArray } : filterByObjArray;
        resultArray = [...this.database(this.getFilterParaObj(key, customKeyValArray)).get(),
          ...resultArray];
        return false;
      });
    } else {
      resultArray = [...this.database(this.getFilterParaObj(key, customKeyVal)).get()];
    }
    return setDb ? this.initiateDb(resultArray, true) : uniqWith(resultArray, isEqual);
  }

  filterByMultipleKeys = (filterObj, setDb = true) => {
    const resultArray = [...this.database(filterObj).get()];
    return setDb ? this.initiateDb(resultArray, true) : uniqWith(resultArray, isEqual);
  }

  getRefFromObjRef = (objRef, data) => {
    let tempRef = false;
    objRef.split('.').map((k) => {
      tempRef = !tempRef ? data[k] : tempRef[k];
      return tempRef;
    });
    return tempRef;
  }

  filterFromNestedObjs = (key, value) => {
    let tempRef;
    let resultArray = [];
    const data = this.getDatabase();
    if (isArray(key)) {
      let keyString = '';
      data.map((e) => {
        keyString = '';
        key.map((d) => {
          tempRef = this.getRefFromObjRef(d, e);
          keyString = `${keyString} ${tempRef}`;
          return false;
        });
        if (keyString.toLowerCase().includes(value.toLowerCase())) {
          resultArray.push(e);
        }
        return false;
      });
    } else {
      resultArray = data.filter((e) => {
        tempRef = this.getRefFromObjRef(key, e);
        return (tempRef && tempRef.toLowerCase().includes(value.toLowerCase()));
      });
    }
    this.initiateDb(resultArray, true);
  }

  filterByDate = (sDate, eDate, key = 'date', subkey = null) => {
    const data = this.getDatabase();
    const filterData = data.filter(e => parseInt((subkey ? e[key][subkey] : e[key]), 10)
      <= eDate && parseInt((subkey ? e[key][subkey] : e[key]), 10) >= sDate);
    this.initiateDb(filterData, true);
  }

  filterByNumber = (min, max, key, type = 'Integer') => {
    const data = this.getDatabase();
    const isInt = type === 'Integer';
    const filterData = data.filter(e => (isInt ? parseInt(e[key], 10) : parseFloat(e[key], 10))
    <= max && (isInt ? parseInt(e[key], 10) : parseFloat(e[key], 10)) >= min);
    this.initiateDb(filterData, true);
  }
}

export default new ClientDb();
