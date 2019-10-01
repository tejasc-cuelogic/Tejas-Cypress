import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Menu, Icon, Select } from 'semantic-ui-react';

@observer
export default class NsPaginationType2 extends Component {
  state = {
    lek: this.props.meta.requestState.lek,
    first: this.props.meta.requestState.perPage || 10,
    currentPageNo: this.props.meta.requestState.page || 1,
    stateOptions: [5, 10, 15].map(n => ({ key: n, value: n, text: n })),
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      lek: nextProps.meta.requestState.lek,
      first: nextProps.meta.requestState.perPage || 10,
      currentPageNo: nextProps.meta.requestState.page || 1,
      stateOptions: [5, 10, 15].map(n => ({ key: n, value: n, text: n })),
    });
  }

  pageChangeHandler = (e) => {
    this.setState({ currentPageNo: parseInt(e.target.value, 10) });
  }

  changeRecordsPerPage = (e, result) => {
    const first = result.value;
    const currentPageNo = 1;
    this.setState({ first, currentPageNo });
    this.props.initRequest({ first, page: currentPageNo });
  }

  goToPage = (currentPageNo) => {
    this.setState({ currentPageNo });
    this.props.initRequest({ page: currentPageNo, first: this.state.first });
  }

  render() {
    const {
      first, currentPageNo, stateOptions, recPerPage, lek,
    } = this.state;
    return (
      <Menu pagination text {...this.props}>
        {recPerPage
          && (
<Select
  value={first}
  options={stateOptions}
  onChange={this.changeRecordsPerPage}
/>
          )
        }
        <Menu.Item
          icon
          onClick={() => this.goToPage(currentPageNo - 1)}
          className={currentPageNo === 1 && 'disabled'}
        >
          <Icon className="ns-chevron-left" color="green" />
        </Menu.Item>
        <Menu.Item>
          Page : {currentPageNo}
        </Menu.Item>
        <Menu.Item
          icon
          onClick={() => this.goToPage(currentPageNo + 1)}
          className={!lek[`page-${currentPageNo + 1}`] && 'disabled'}
        >
          <Icon className="ns-chevron-right" color="green" />
        </Menu.Item>
      </Menu>
    );
  }
}
