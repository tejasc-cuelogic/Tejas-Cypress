import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Card, Header } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';

const userVerifiedDetails = ({ legalDetails, isUserVerified, status }) => {
  const setupIncomplete = () => !['FULL', 'MIGRATION_FULL'].includes(status);
  if (legalDetails === null ||
    (!isUserVerified(get(legalDetails, 'status') || null) || setupIncomplete())) {
    return (
      <Card fluid className="form-card">
        <Header as="h5">Identity not verified</Header>
        <Link to="/app/summary/identity-verification/0" ><b>Verify Identity</b></Link>
      </Card>
    );
  }
  return (
    <Card fluid className="form-card">
      <Header as="h5">Verified Identity</Header>
      <dl className="dl-horizontal">
        <dt>Legal First Name</dt>
        <dd>{legalDetails.legalName.firstLegalName}</dd>
        <dt>Legal Last Name</dt>
        <dd>{legalDetails.legalName.lastLegalName}</dd>
        <dt>SSN</dt>
        <dd>{Helper.formattedSSNNumber(legalDetails.ssn) || '-'}</dd>
        <dt>DOB</dt>
        <dd>{legalDetails.dateOfBirth ? moment(legalDetails.dateOfBirth, 'MM/DD/YYYY').format('MM-DD-YYYY') : '-'}</dd>
        { /* Commented due to change requested in #1483 */}
        {/* <dt>Street</dt>
        <dd>{legalDetails.legalAddress.street}</dd>
        <dt>Address Line 2</dt>
        <dd>{legalDetails.legalAddress.streetTwo}</dd>
        <dt>City</dt>
        <dd>{legalDetails.legalAddress.city}</dd>
        <dt>State</dt>
        <dd>{legalDetails.legalAddress.state}</dd>
        <dt>ZIP Code</dt>
        <dd>{legalDetails.legalAddress.zipCode}</dd> */}
      </dl>
      <p className="intro-text">
        If any of this information needs to be updated, please contact support at{' '}
        <a href="mailto:support@nextseed.com">Support@Nextseed.com</a>.
      </p>
    </Card>
  );
};

export default userVerifiedDetails;
