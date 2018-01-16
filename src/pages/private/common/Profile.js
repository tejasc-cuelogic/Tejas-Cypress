import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import LoadingSpinner from './../../../components/common/LoadingSpinner';
import RedError from './../../../components/common/RedError';
import EditProfileSettings from './EditProfileSettings';

@inject('profileStore', 'userStore')
@withRouter
@observer
export default class Profile extends React.Component {
  componentWillMount() {
    this.props.profileStore.loadProfile(this.props.match.params.username);
  }

  componentDidUpdate(previousProps) {
    if (this.props.location !== previousProps.location) {
      this.props.profileStore.loadProfile(this.props.match.params.username);
    }
  }

  render() {
    const { profileStore, userStore } = this.props;
    const { profile, isLoadingProfile } = profileStore;
    const { currentUser } = userStore;

    if (isLoadingProfile && !profile) return <LoadingSpinner />;
    if (!profile) return <RedError message="Can't load profile" />;

    const isUser = currentUser && profile.username === currentUser.username;

    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img src={profile.image} className="user-img" alt="" />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>

                <EditProfileSettings isUser={isUser} />
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1" />
          </div>
        </div>
      </div>
    );
  }
}
