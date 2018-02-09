import React from 'react';
import { Pagination as P } from 'semantic-ui-react';

const Pagination = props => (
  <P
    activePage={props.paginateOptions.activePage}
    boundaryRange={props.paginateOptions.boundaryRange}
    onPageChange={this.handlePaginationChange}
    size="mini"
    totalPages={props.paginateOptions.totalPages}
    ellipsisItem={props.paginateOptions.showEllipsis ? undefined : null}
    firstItem={props.paginateOptions.showFirstAndLastNav ? undefined : null}
    lastItem={props.paginateOptions.showFirstAndLastNav ? undefined : null}
    prevItem={props.paginateOptions.showPreviousAndNextNav ? undefined : null}
    nextItem={props.paginateOptions.showPreviousAndNextNav ? undefined : null}
  />
);

export default Pagination;
