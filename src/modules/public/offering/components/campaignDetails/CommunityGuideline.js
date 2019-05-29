import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';

class CommunityGuideline extends Component {
  handleClose = () => this.props.history.push(this.props.refLink);
  render() {
    return (
      <Modal
        open
        onClose={this.handleClose}
        closeIcon
      >
        <Modal.Header>Community Guidelines</Modal.Header>
        <Modal.Content scrolling>
          <p>
            NextSeed is a community of people passionate about small business
            entrepreneurship. Our community thrives on honesty, transparency
            and knowledge. In furtherance of our community values, please stick
            to the following guidelines as you participate on NextSeed:
          </p>
          <p>
            <b>1. Be mindful of trade secrets</b><br />
            Conversation is an essential part of our community, and we support
            the exchange information between members and entrepreneurs. Nonetheless,
            we ask that you not trouble entrepreneurs with information requests about
            matters that could be trade secrets. All material information pertaining
            to an offering (including all financial information legally required to
            be disclosed) is set forth in the disclosure statement. We encourage
            members to seek clarification on content that has already been disclosed
            but to keep in mind that entrepreneurs are not legally required to answer
            every question.
          </p>
          <p>
            <b>2. Don’t spam</b><br />
            NextSeed provides a comments channel so members can communicate, ask
            questions, express their opinions and root on our entrepreneurs. It
            should not be utilized for any other purpose.
          </p>
          <p>
            <b>3. Don’t be rude or inappropriate</b><br />
            If an offering doesn’t appeal to you and you don’t feel like participating,
            that’s fine. Just don’t post malicious, inappropriate, prejudicial or
            libelous content. Don’t post any personal information either.
          </p>
          <p>
            NextSeed reserves the right to remove any content that violates these
            guidelines and to take appropriate actions against repeat offenders. As
            always, our goal is to ensure that NextSeed remains a thriving ecosystem
            that nurtures entrepreneurship and empowers small businesses. Thank you
            for being a member of NextSeed!
          </p>
        </Modal.Content>
      </Modal>
    );
  }
}

export default CommunityGuideline;
