import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import UserModuleSubheader from './../components/UserModuleSubheader';
import UserDetail from './../components/UserDetail';
import UserLimits from './../components/UserLimits';
import UserBeneficiaries from './../components/UserBeneficiaries';
import UserPortfolio from './../components/UserPortfolio';
import UserTransactions from './../components/UserTransactions';
import UserStatements from './../components/UserStatements';
import UserMessages from './../components/UserMessages';

@inject('userDetailsStore')
@observer
class UserDetails extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getUser(this.props.match.params.userId);
  }

  render() {
    console.log(this.props.match.params.section);
    const {
      userDetails, editCard, setEditCard, save,
    } = this.props.userDetailsStore;
    return (
      <Aux>
        <UserModuleSubheader
          fullname={`${userDetails.firstName} ${userDetails.lastName}`}
          section={this.props.match.params.section}
          id={userDetails.id}
        />
        {(this.props.match.params.section === 'Profile' || this.props.match.params.section === 'profile') &&
        <UserDetail
          editCard={editCard}
          setEditCard={setEditCard}
          details={userDetails}
          save={save}
        />
        }
        {this.props.match.params.section === 'Limits' &&
        <UserLimits />
        }
        {this.props.match.params.section === 'Beneficiaries' &&
        <UserBeneficiaries />
        }
        {this.props.match.params.section === 'Portfolio' &&
        <UserPortfolio />
        }
        {this.props.match.params.section === 'Transactions' &&
        <UserTransactions />
        }
        {this.props.match.params.section === 'Statements' &&
        <UserStatements />
        }
        {this.props.match.params.section === 'Messages' &&
        <UserMessages />
        }
      </Aux>
    );
  }
}

export default UserDetails;
