import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Menu, Icon } from 'semantic-ui-react';

function NsPaginationHookType(props) {
  const [lek, setLek] = useState(props.meta.requestState.lek);
  const [first] = useState(props.meta.requestState.perPage || 10);
  const [currentPageNo, setCurrentPageNo] = useState(props.meta.requestState.page || 1);
  // const [stateOptions] = useState([5, 10, 15].map(n => ({ key: n, value: n, text: n })));

  // function pageChangeHandler(e) {
  //   setCurrentPageNo(parseInt(e.target.value, 10));
  // }

  // function changeRecordsPerPage(e, result) {
  //   const firstVal = result.value;
  //   const currentPageNoVal = 1;
  //   setFirst(firstVal);
  //   setCurrentPageNo(currentPageNoVal);
  //   props.initRequest({ first: firstVal, page: currentPageNoVal });
  // }

  function goToPage(currentPageNoVal) {
    setCurrentPageNo(currentPageNoVal);
    props.initRequest({ page: currentPageNoVal, first });
  }
  useEffect(() => {
    setLek(props.meta.requestState.lek);
  }, [props.meta.requestState.lek]);
  return (
    <Menu pagination text {...props}>
      {/* {recPerPage
        && (
          <Select
            value={first}
            options={stateOptions}
            onChange={changeRecordsPerPage()}
          />
        )
      } */}
      <Menu.Item
        icon
        onClick={() => goToPage(currentPageNo - 1)}
        className={currentPageNo === 1 && 'disabled'}
      >
        <Icon className="ns-chevron-left" color="green" />
      </Menu.Item>
      <Menu.Item>
        Page : {currentPageNo}
      </Menu.Item>
      <Menu.Item
        icon
        onClick={() => goToPage(currentPageNo + 1)}
        className={!lek[`page-${currentPageNo + 1}`] && 'disabled'}
      >
        <Icon className="ns-chevron-right" color="green" />
      </Menu.Item>
    </Menu>
  );
}

export default (observer(NsPaginationHookType));
