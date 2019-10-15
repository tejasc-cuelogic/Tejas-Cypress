import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Container, Button, Divider, Form, Grid } from 'semantic-ui-react';
// import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';
// import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';
import { FormInput } from '../../../../theme/form';

const LoadMoreBtn = ({ action, param }) => (
  <div className="center-align mb-50" data-cy={param}>
    <Button secondary content="Load More" onClick={() => action(param)} />
  </div>
);
const isMobile = document.documentElement.clientWidth < 768;
@inject('campaignStore')
@observer
class Offering extends Component {
  constructor(props) {
    super(props);
    this.props.campaignStore.initRequest(['active', 'completed']);
  }

  render() {
    const {
      active, completed, loading, loadMoreRecord, activeList,
      completedList, activeToDisplay, completedToDisplay, RECORDS_TO_DISPLAY,
    } = this.props.campaignStore;
    return (
      <>
        {/* <Banner /> */}
        {/* <Responsive maxWidth={767} as={Container}>
          <Header as="h2" className="mt-30">
            Invest in growing local businesses
          </Header>
        </Responsive> */}
        <CampaignList
          refLink={this.props.match.url}
          loading={loading}
          campaigns={active}
          filters
          heading={<Header as={isMobile ? 'h3' : 'h2'} textAlign="center" caption className={isMobile ? 'mb-30' : 'mb-50'}>Active Campaigns</Header>}
          subheading={<p className="campaign-subheader center-align">Invest in the growth of the following local businesses</p>}
        />
        {activeList && activeList.length > RECORDS_TO_DISPLAY
        && activeToDisplay < activeList.length
          && <LoadMoreBtn action={loadMoreRecord} param="activeToDisplay" />
        }
        <Divider section hidden />
        <Divider hidden />
        <section className="bg-offwhite">
          <Container textAlign="center">
            <Header as="h2">Be the first to know about new opportunities</Header>
            <p className="mb-30">
              Sign up to have exclusive investment opportunities delivered straight to your inbox.
            </p>
            {/* <SubscribeForNewsletter className="public-form" /> */}
            <Form className="public-form ">
              <Grid centered>
                <Grid.Row>
                  <Grid.Column computer={6} tablet={7} mobile={16}>
                    <FormInput
                      type="text"
                      name="fdsf"
                      fielddata={['fsdf', 'fsafs']}
                      ishidelabel
                      placeholder="Email"
                    />
                  </Grid.Column>
                  <Grid.Column computer={2} tablet={3} mobile={16}>
                    <Button primary fluid>
                        Subscribe
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Container>
        </section>
        {!loading
          && (
<CampaignList
  isFunded
  loading={loading}
  campaigns={completed}
  locked={3}
  heading={<Header as="h2" textAlign="center" caption className="mb-50">Successfully Funded on NextSeed</Header>}
/>
          )
        }
        {completedList && completedList.length > RECORDS_TO_DISPLAY
        && completedToDisplay < completedList.length
        && <LoadMoreBtn action={loadMoreRecord} param="completedToDisplay" />
        }
        <Divider section hidden />
        <Divider hidden />
      </>
    );
  }
}

export default Offering;
