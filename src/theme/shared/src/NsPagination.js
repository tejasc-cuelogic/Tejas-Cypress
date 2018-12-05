import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Menu, Icon, Input, Select } from 'semantic-ui-react';

@observer
export default class NsPagination extends Component {
  state = {
    skip: this.props.meta.requestState.skip || 0,
    first: this.props.meta.requestState.perPage || 10,
    currentPageNo: this.props.meta.requestState.page || 1,
    totalPages: this.props.meta.totalRecords > this.props.meta.requestState.perPage ?
      Math.ceil(this.props.meta.totalRecords / this.props.meta.requestState.perPage) : 1,
    stateOptions: [5, 10, 15].map(n => ({ key: n, value: n, text: n })),
  };
  componentWillReceiveProps(nextProps) {
    const totalPages = nextProps.meta.totalRecords > nextProps.meta.requestState.perPage ?
      Math.ceil(nextProps.meta.totalRecords / nextProps.meta.requestState.perPage) : 1;
    this.setState({ totalPages });
  }
  pageChangeHandler = (e) => {
    this.setState({ currentPageNo: parseInt(e.target.value, 10) });
  }
  changeRecordsPerPage = (e, result) => {
    const first = result.value;
    const totalPages = Math.ceil(this.props.totalRecords / first);
    const currentPageNo = (2 * this.state.currentPageNo) - 1;// this will only work for first=5
    this.setState({ first, totalPages, currentPageNo });
    this.props.initRequest({ first, skip: this.state.skip, page: currentPageNo });
  }
  jumpToPage = (e) => {
    if (e.key === 'Enter') {
      this.goToPage(parseInt(e.target.value, 10));
    }
  }
  goToPage = (currentPageNo) => {
    const skip = (currentPageNo === this.state.totalPages) ?
      this.props.meta.totalRecords - (this.props.meta.totalRecords % this.state.first) :
      (currentPageNo * this.state.first) - this.state.first;
    this.setState({ skip, currentPageNo });
    this.props.initRequest({ first: this.state.first, skip, page: currentPageNo });
  }
  render() {
    const {
      first, currentPageNo, totalPages, stateOptions, recPerPage,
    } = this.state;
    return (
      <Menu pagination text {...this.props}>
        <Menu.Menu position="right">
          {recPerPage &&
            <Select
              value={first}
              options={stateOptions}
              onChange={this.changeRecordsPerPage}
            />
          }
          <Menu.Item
            onClick={() => this.goToPage(1)}
            className={currentPageNo === 1 && 'disabled'}
          >
            <Icon className="ns-arrow-double-left" color="green" />
          </Menu.Item>
          <Menu.Item
            icon
            onClick={() => this.goToPage(currentPageNo - 1)}
            className={currentPageNo === 1 && 'disabled'}
          >
            <Icon className="ns-chevron-left" color="green" />
          </Menu.Item>
          <Menu.Item>
            <Input
              value={currentPageNo || null}
              onKeyPress={this.jumpToPage}
              onChange={this.pageChangeHandler}
            />
          </Menu.Item>
          <Menu.Item>of</Menu.Item>
          <Menu.Item>{totalPages}</Menu.Item>
          <Menu.Item
            icon
            onClick={() => this.goToPage(currentPageNo + 1)}
            className={currentPageNo === totalPages && 'disabled'}
          >
            <Icon className="ns-chevron-right" color="green" />
          </Menu.Item>
          <Menu.Item
            icon
            onClick={() => this.goToPage(totalPages)}
            className={currentPageNo === totalPages && 'disabled'}
          >
            <Icon className="ns-arrow-double-right" color="green" />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

