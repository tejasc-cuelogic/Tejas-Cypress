import React, { Component } from 'react';
import { Header, Modal, Grid, Statistic } from 'semantic-ui-react';
import ChartPie from './ChartPie';


const CUSTOMER_DEMO_GENDER = [
  { name: 'Male', value: 45 },
  { name: 'Female', value: 55 },
];

const CUSTOMER_DEMO_AGE = [
  { name: '21-24', value: 20 },
  { name: '25-34', value: 30 },
  { name: '35-44', value: 20 },
  { name: '45-54', value: 15 },
  { name: '55+', value: 15 },
];

const GENDER_COLORS = ['#20C86D', '#189652'];
const AGE_COLORS = ['#1C2E4B', '#31333D', '#263E64', '#5C6E8B', '#676A73'];

class LocationAnalysisModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    return (
      <Modal
        open
        onClose={this.handleClose}
        closeIcon
        size="large"
      >
        <Header as="h3">
        Location Analysis
        </Header>
        <Modal.Content>
          <Grid doubling>
            <Grid.Row>
              <Grid.Column width={6}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.8980695673813!2d73.87562555088532!3d18.53350778733976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0f824992459%3A0x4f126e7b4c0ac0f6!2sCuelogic+Technologies!5e0!3m2!1sen!2sin!4v1530687811942"
                  title="test"
                  height="100%"
                  width="100%"
                />
              </Grid.Column>
              <Grid.Column width={10}>
                <Header as="h5">
                    Neighborhood
                </Header>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <Header as="h5">
                    Customer Demographics
                </Header>
                <Grid columns={3} celled="internally" divided className="demographics">
                  <Grid.Row>
                    <Grid.Column>
                      <ChartPie title="Gender" data={CUSTOMER_DEMO_GENDER} colors={GENDER_COLORS} />
                    </Grid.Column>
                    <Grid.Column>
                      <ChartPie title="Age" data={CUSTOMER_DEMO_AGE} colors={AGE_COLORS} />
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="tiny" className="basic">
                        <Statistic.Value>$82,000/yr</Statistic.Value>
                        <Statistic.Label>Average Income</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default LocationAnalysisModal;
