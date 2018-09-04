import React from 'react';
import { Label } from 'semantic-ui-react';

const SMap = {
  draft: { color: 'red', label: 'Draft' },
  submit_for_approval: { color: 'red', label: 'Waiting for approval' },
  published: { color: 'green', label: 'Published' },
};

const Status = ({ status }) => (
  <span className="title-meta">
    <Label circular empty size="mini" color={SMap[status].color} /> {SMap[status].label}
  </span>
);

export default Status;
