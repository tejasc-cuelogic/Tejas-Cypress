import React from 'react';
import { Label } from 'semantic-ui-react';

const SMap = {
  DRAFT: { color: 'red', label: 'Draft' },
  PENDING: { color: 'orange', label: 'Pending Admin Approval' },
  PUBLISHED: { color: 'green', label: 'Published' },
};

const Status = ({ status }) => (
  <span className="title-meta">
    <Label circular empty size="mini" color={SMap[status].color} /> {SMap[status].label}
  </span>
);

export default Status;
