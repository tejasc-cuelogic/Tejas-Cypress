import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import Spinner from '../../../../theme/ui/Spinner';
import Helper from '../../../../helper/utility';

/* eslint-disable arrow-body-style */
const userVerifiedDetails = (props) => {
  if (!props.legalDetails) {
    return (
      <div>
        <Spinner loaderMessage="Loading..." />
      </div>
    );
  }
  const {
    ssn,
    legalName,
    legalAddress,
    dateOfBirth,
  } = props.legalDetails;
  if (!legalName) {
    return (
      <Card fluid className="form-card">
        <h3>Identity not verified</h3>
        <Link to="/app/summary" ><b>Verify Identity</b></Link>
      </Card>
    );
  }
  return (
    <Card fluid className="form-card">
      <h3>Identity verified</h3>
      <dl className="dl-horizontal">
        <dt>Legal First Name</dt>
        <dd>{legalName.firstLegalName}</dd>
        <dt>Legal Last Name</dt>
        <dd>{legalName.lastLegalName}</dd>
        <dt>SSN</dt>
        <dd>{Helper.cryptedSSNNumber(ssn)}</dd>
        <dt>DOB</dt>
        <dd>{moment(dateOfBirth).format('MM-DD-YYYY')}</dd>
        <dt>Legal Address</dt>
        <dd>{`${legalAddress.street}, ${legalAddress.city}, ${legalAddress.state}, ${legalAddress.zipCode}`}
        </dd>
        <dt>Email Address</dt>
        <dd>{props.email}</dd>
      </dl>
      <p className="intro-text">
        If any of this information needs to be updated, please contact support through the{' '}
        <Link to="/app/messages" className="link"><b>Message center</b></Link>.
      </p>
    </Card>
  );
};

export default userVerifiedDetails;
