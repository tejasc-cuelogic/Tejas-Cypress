import React from 'react';
// import { Route } from 'react-router-dom';
import Aux from 'react-aux';
import { Grid, Popup, Header, List } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';

const data = {
  invested: 12000,
  milestones: [
    {
      amount: 500,
      reward: {
        head: 'Invest $500 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 1000,
      reward: {
        head: 'Invest $1000 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 2500,
      reward: {
        head: 'Invest $2500 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 5000,
      reward: {
        head: 'Invest $5000 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 10000,
      reward: {
        head: 'Invest $500 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 25000,
      reward: {
        head: 'Invest $500 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 50000,
      reward: {
        head: 'Invest $500 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
  ],
};

const InvestmentTimeline = (props) => {
  const progress = (data.invested / data.milestones[data.milestones.length - 1].amount) * 100;
  return (
    <Aux>
      <Header as="h3">{props.title}</Header>
      <Grid columns="equal" textAlign="center" className="investment-scale">
        <div className="invested">
          <span className="investment-progress" style={{ width: `${progress}%` }} />
          <div className="amount" style={{ left: `${progress}%` }}>Your investment <span>{Helper.CurrencyFormat(data.invested)}</span></div>
        </div>
        <Grid.Row>
          {
            data.milestones.map(milestone => (
              <Grid.Column className="crossed">
                <Popup
                  trigger={<span>{Helper.CurrencyFormat(milestone.amount)}</span>}
                  position="bottom center"
                  className="reward-info"
                  wide
                >
                  <Popup.Content>
                    <Header as="h3" className="mb-half">{milestone.reward.head}</Header>
                    <Header as="h5">{milestone.reward.subHead}</Header>
                    <List bulleted>
                      {
                        milestone.reward.highlights.map(h => (
                          <List.Item>{h}</List.Item>
                        ))
                      }
                    </List>
                  </Popup.Content>
                </Popup>
              </Grid.Column>
            ))
          }
        </Grid.Row>
      </Grid>
    </Aux>
  );
};

export default InvestmentTimeline;
