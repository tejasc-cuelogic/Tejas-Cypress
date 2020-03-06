import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Cip from '../../components/cipVerification/Cip';
import CipHardFail from '../../components/cipVerification/CipHardFail';
import CipSoftFail from '../../components/cipVerification/CipSoftFail';
import CipAddressVerification from '../../components/cipVerification/CipAddressVerification';
import CipPhoneVerification from '../../components/cipVerification/CipPhoneVerification';

export const CIP_ROUTES = [
  {
    to: 'uploads',
    component: CipHardFail,
  },
  {
    to: 'questions',
    component: CipSoftFail,
  },
  {
    to: 'address-verification',
    component: CipAddressVerification,
  },
  {
    to: 'phone-verification',
    component: CipPhoneVerification,
  },
];

export default class CipVerification extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={match.url} component={Cip} />
        {
          CIP_ROUTES.map((item) => {
            const CurrentModule = item.component;
            return (
              <Route
                key={item.to}
                path={`${match.url}/${item.to}`}
                render={props => <CurrentModule {...props} />}
              />
            );
          })
        }
      </Switch>
    );
  }
}
