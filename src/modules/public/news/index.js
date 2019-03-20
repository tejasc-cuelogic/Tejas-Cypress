/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { Container, Header, Grid, Item, Message, Responsive, Button, Segment, Form, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { FormInput, FormPasswordStrength } from '../../../theme/form';
import { ListErrors, Logo, NsCarousel } from '../../../theme/shared';
import NSImage from '../../shared/NSImage';

const highlights = [
  {
    title: 'Businesses you understand',
    icon: 'icons/businesses.svg',
    meta: `Investments in Main Street businesses and local properties 
      generating real cash flow.`,
  },
  {
    title: 'Exclusive deals',
    icon: 'icons/ventures.svg',
    meta: `Uncover opportunities that were once privately reserved for wealthy
      and well-connected investors.`,
  },
  {
    title: 'Pre-vetted opportunities',
    icon: 'icons/prevetted.svg',
    meta: `Every business must meet our proprietary financial
    criteria in addition to federal regulatory requirements. `,
  },
];
const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
};
const businesses = [
  {
    title: 'Houston, TX',
    image: 'investors/img-2.png',
    description: 'The Sugar Refinery raised $273,800 from 213 investors',
  },
  {
    title: 'San Francisco, CA',
    image: 'investors/img.png',
    description: 'Rambler raised $150,000 from 131 investors',
  },
  {
    title: 'Austin, TX',
    image: 'investors/img-1.png',
    description: 'The Brewer’s Table raised $3000,000 from 190 investors',
  },
];
const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 992;

@inject('authStore', 'uiStore', 'identityStore')
@observer
class News extends Component {
  componentWillMount() {
    this.props.authStore.setDefaultPwdType();
    this.props.authStore.setUserRole('investor');
  }
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }
  handleIsEmailExist = (email) => {
    this.props.authStore.checkEmailExistsPresignup(email);
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    if (this.props.authStore.newPasswordRequired) {
      this.props.history.push('/auth/change-password');
    } else {
      const { email, password, givenName } = this.props.authStore.SIGNUP_FRM.fields;
      this.props.authStore.checkEmailExistsPresignup(email.value).then(() => {
        this.props.authStore.setCredentials({
          email: email.value,
          password: password.value,
          givenName: givenName.value,
        });
        if (this.props.authStore.SIGNUP_FRM.meta.isValid) {
          this.props.identityStore.requestOtpWrapper().then(() => {
            this.props.history.push('/auth/confirm-email');
          });
        }
      });
    }
  };
  render() {
    const {
      SIGNUP_FRM, signupChange, pwdInputType, currentScore,
    } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;
    const customError = errors && errors.code === 'UsernameExistsException'
      ? 'An account with the given email already exists, Please login if already registered.' : errors && errors.message;
    return (
      <Aux>
        <Container>
          <section className="center-align">
            <Link to="/">
              <Logo centered dataSrc="LogoBlack" />
            </Link>
          </section>
          <Header as="h2" className="center-align mt-0">Small business investing, <span className="highlight-text">made easy.</span></Header>
          <section>
            <Grid stackable doubling centered relaxed="very" className="mb-30">
              <Grid.Row>
                <Grid.Column mobile={16} tablet={8} computer={7}>
                  <Item.Group relaxed="very" className={isMobile && 'horizontal-items'}>
                    {
                    highlights.map(h => (
                      <Item className="mb-40">
                        <div className="ui mini image">
                          <NSImage path={h.icon} />
                        </div>
                        <Item.Content>
                          <Item.Header as="h5">{h.title}</Item.Header>
                          <Item.Meta>{h.meta}</Item.Meta>
                        </Item.Content>
                      </Item>
                    ))
                  }
                  </Item.Group>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={8} computer={7}>
                  <Segment padded>
                    <Header as="h4" className={`${isMobile && 'center-align'} mb-20`}>Start investing in local businesses you know and trust.</Header>
                    <Form error onSubmit={this.handleSubmitForm}>
                      {
                        ['givenName', 'familyName'].map(field => (
                          <FormInput
                            asterisk="true"
                            key={field}
                            type="text"
                            autoFocus={field === 'givenName'}
                            name={field}
                            fielddata={SIGNUP_FRM.fields[field]}
                            changed={signupChange}
                            containerclassname="secondary"
                          />
                        ))
                      }
                      <FormInput
                        asterisk="true"
                        type="email"
                        name="email"
                        fielddata={SIGNUP_FRM.fields.email}
                        changed={signupChange}
                        onblur={this.handleIsEmailExist}
                        containerclassname="secondary"
                      />
                      <FormPasswordStrength
                        asterisk="true"
                        key="password"
                        name="password"
                        type="password"
                        minLength={8}
                        minScore={4}
                        iconDisplay
                        tooShortWord="Weak"
                        scoreWords={['Weak', 'Okay', 'Good', 'Strong', 'Stronger']}
                        inputProps={{
                          name: 'password', autoComplete: 'off', placeholder: 'Password',
                        }}
                        changed={signupChange}
                        fielddata={SIGNUP_FRM.fields.password}
                        showRequiredError
                        containerclassname="secondary"
                      />
                      <FormInput
                        asterisk="true"
                        key="verify"
                        name="verify"
                        type={pwdInputType}
                        fielddata={SIGNUP_FRM.fields.verify}
                        changed={signupChange}
                        containerclassname="secondary"
                      />
                      {errors &&
                        <Message error textAlign="left" className="mt-30">
                          <ListErrors errors={[customError]} />
                        </Message>
                      }
                      <Button fluid primary size="large" className="very relaxed" content="Register" loading={inProgress} disabled={!SIGNUP_FRM.meta.isValid || !currentScore} />
                    </Form>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </section>
        </Container>
        <Divider fitted as={Container} />
        <section>
          <Container className="mt-30">
            <Header as="h2" className={isMobile ? 'mb-30' : 'mb-80'} textAlign="center">Investing, simplified.</Header>
            <div className="how-it-works-steps mb-30">
              <Grid stackable centered columns={3}>
                <Grid.Column>
                  <Header as="h5">Explore</Header>
                  <p>Browse approved businesses that have passed our strict screening process.</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h5">Invest</Header>
                  <p>
                Set up an investment account for free on NextSeed and invest in businesses directly.
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h5">Receive</Header>
                  <p>NextSeed collects and processes payments directly
                      into your investment account.
                  </p>
                </Grid.Column>
              </Grid>
            </div>
          </Container>
        </section>
        <section className="bg-offwhite">
          <Container textAlign={isMobile ? 'left' : 'center'} className="mt-30">
            <Header as="h2" className="mb-30">
            Build an investment portfolio{' '}
              <Responsive as={Aux} minWidth={1199}><br /></Responsive>
            you care about.
            </Header>
            <p className={isMobile ? 'mb-40' : 'mb-50'}>
            NextSeed offers the opportunity to invest in restaurants, fitness studios,
              {!isMobile && <br />}
            craft breweries and a variety of growing concepts.
            </p>
          </Container>
          {!isMobile ?
            <Container className="mb-30">
              <Grid centered stackable className="vertical-gutter">
                {businesses.map(b => (
                  <Grid.Column textAlign="center" width={5}>
                    <NSImage path={b.image} centered />
                    <Header as="h5">{b.title}</Header>
                    <p>{b.description}</p>
                  </Grid.Column>
                ))
              }
              </Grid>
            </Container>
        :
            <Aux>
              <Container className="mb-30">
                <NsCarousel {...settings}>
                  {businesses.map(b => (
                    <Grid.Row>
                      <Grid.Column className="center-align">
                        <NSImage path={b.image} centered />
                        <Header as="h5">{b.title}</Header>
                        <p>{b.description}</p>
                      </Grid.Column>
                    </Grid.Row>
                  ))
                }
                </NsCarousel>
              </Container>
            </Aux>
        }
        </section>
        <section>
          <Container>
            <Grid relaxed={!isTablet && 'very'} stackable centered className={!isMobile && 'mt-40 mb-40'}>
              <Grid.Row>
                <Grid.Column width={10} textAlign="center">
                  <Header as="h2">Start investing today</Header>
                  <Button.Group vertical={isMobile}>
                    <Button as={Link} to="/auth/register-investor" primary>Sign Up Free</Button>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </section>
      </Aux>
    );
  }
}

export default News;
