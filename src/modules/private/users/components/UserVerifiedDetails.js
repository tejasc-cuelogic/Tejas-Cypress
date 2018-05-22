import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import Spinner from '../../../../theme/ui/Spinner';

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
  return (
    <Card className="form-card">
      <h3>Identity verified</h3>
      <dl className="dl-horizontal">
        <dt>Legal First Name</dt>
        <dd>{legalName.firstLegalName}</dd>
        <dt>Legal Last Name</dt>
        <dd>{legalName.lastLegalName}</dd>
        <dt>SSN</dt>
        <dd>{ssn}</dd>
        <dt>DOB</dt>
        <dd>{moment(dateOfBirth).format('MM-DD-YYYY')}</dd>
        <dt>Legal Address</dt>
        <dd>{`${legalAddress.street1}, ${legalAddress.city}, ${legalAddress.state}, ${legalAddress.zipCode}`}
        </dd>
        <dt>Email Address</dt>
        <dd>{props.email}</dd>
      </dl>
      <p className="intro-text">
        If any of this information needs to be updated, please contact support through the{' '}
        <Link to={props.match.url} className="link"><b>Message center</b></Link>.
      </p>
    </Card>
  );
};

export default userVerifiedDetails;
