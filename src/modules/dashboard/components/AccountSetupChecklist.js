import React from 'react';
import { Link } from 'react-router-dom';
import { List, Card } from 'semantic-ui-react';

const checklistMeta = [
  {
    item: 'personal_information',
    status: true,
    preMeta: {
      title: 'Complete all required information about you',
      link: {
        text: 'here',
      },
    },
    postMeta: {
      title: 'Personal information completed!',
    },
  },
  {
    item: 'confirm_email',
    status: false,
    preMeta: {
      title: 'Confirm your e-mail address',
      link: {
        text: 'Resend email',
      },
    },
    postMeta: {
      title: 'Email address confirmed!',
    },
  },
  {
    item: 'open_first_account',
    status: false,
    preMeta: {
      title: ' your first NextSeed Account',
      link: {
        text: 'Open',
      },
    },
  },
];

const AccountSetupChecklist = () => (
  <Card.Content>
    <Card.Description>
      <List relaxed className="check-list">
        {checklistMeta.map((item, index) => (
          <List.Item key={item.item}>
            <List.Icon name="check circle large" />
            <List.Content verticalAlign="middle">
              {!item.status && index === 2 &&
                <Link as="a" to=""><strong> {item.preMeta.link.text}</strong></Link>
              }
              {!item.status ? item.preMeta.title : item.postMeta.title}
              {!item.status && index !== 2 &&
                <Link as="a" to=""><strong> {item.preMeta.link.text}</strong></Link>
              }
            </List.Content>
          </List.Item>
        ))
        }
      </List>
    </Card.Description>
  </Card.Content>
);

export default AccountSetupChecklist;
