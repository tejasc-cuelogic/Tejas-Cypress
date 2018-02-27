import React from 'react';
import { Pagination as Pnation } from 'semantic-ui-react';

const Pagination = props => (
  <Pnation
    className="right floated"
    activePage={props.paginateOptions.activePage}
    onPageChange={this.handlePaginationChange}
    size="small"
    totalPages={props.paginateOptions.totalPages}
  />
);

export default Pagination;
