import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card, Header } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';

const userVerifiedDetails = ({ legalDetails, isUserVerified }) => {
  if (legalDetails === null ||
    (legalDetails !== null && !isUserVerified(legalDetails.status))) {
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
        <dd>{Helper.cryptedSSNNumber(legalDetails.ssn) || '-'}</dd>
        <dt>DOB</dt>
        <dd>{legalDetails.dateOfBirth ? moment(legalDetails.dateOfBirth, 'MM/DD/YYYY').format('MM-DD-YYYY') : '-'}</dd>
        <dt>Street</dt>
        <dd>{legalDetails.legalAddress.street}</dd>
        <dt>City</dt>
        <dd>{legalDetails.legalAddress.city}</dd>
        <dt>State</dt>
        <dd>{legalDetails.legalAddress.state}</dd>
        <dt>ZIP Code</dt>
        <dd>{legalDetails.legalAddress.zipCode}</dd>
        {/* <dt>Legal Address</dt>
        <dd>{legalDetails.legalAddress ? `${legalDetails.legalAddress.street},
        ${legalDetails.legalAddress.city}, ${legalDetails.legalAddress.state},
        ${legalDetails.legalAddress.zipCode}` : 'N/A'}
        </dd>
        <dt>Email Address</dt>
        <dd>{email.address}</dd>
        */}
      </dl>
      <p className="intro-text">
        If any of this information needs to be updated, please contact support at{' '}
        <a href="mailto:support@nextseed.com">Support@Nextseed.com</a>.
      </p>
    </Card>
  );
};

export default userVerifiedDetails;
