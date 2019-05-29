import React, { Component } from 'react';
import Aux from 'react-aux';
import { Container, Header, List, Button, Divider, Responsive } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
export default class Partners extends Component {
  render() {
    return (
      <Aux>
        <Container>
          <section className="center-align">
            <Header as="h2">Partners</Header>
            <p>Looking for additional business services or creative help for your
              company and campaign?<br />We have a network of preferred vendors and referrals.
            </p>
          </section>
          <Header as="h3">Accounting</Header>
          <List celled relaxed="very" className="partners-list">
            <List.Item>
              <Responsive minWidth={768}>
                <List.Content floated="right">
                  <Button compact inverted color="green" onClick={() => window.open('http://dbbmckennon.com/', '_blank')}>Visit</Button>
                </List.Content>
              </Responsive>
              <List.Content>
                <List.Header>DBBMcKennon</List.Header>
                A full-service, PCAPB Registered Certified Public Accounting firm,
                providing audit, tax and consulting services to individuals and businesses.
                Based out of Newport Beach, CA.
                <Responsive maxWidth={767}>
                  <Button className="mt-20" fluid compact inverted color="green" onClick={() => window.open('http://dbbmckennon.com/', '_blank')}>Visit</Button>
                </Responsive>
              </List.Content>
            </List.Item>
            <List.Item>
              <Responsive minWidth={768}>
                <List.Content floated="right">
                  <Button compact inverted color="green" onClick={() => window.open('https://bvccpa.com/', '_blank')}>Visit</Button>
                </List.Content>
              </Responsive>
              <List.Content>
                <List.Header>Briggs &amp; Veselka Co</List.Header>
                Full-service CPA firm offering audit, tax, business valuations, and various
                financial consulting services. Serves many clients in the hospitality and
                retail business. Based out of Houston, TX.
                <Responsive maxWidth={767}>
                  <Button className="mt-20" fluid compact inverted color="green" onClick={() => window.open('https://bvccpa.com/', '_blank')}>Visit</Button>
                </Responsive>
              </List.Content>
            </List.Item>
            <List.Item>
              <Responsive minWidth={768}>
                <List.Content floated="right">
                  <Button compact inverted color="green" onClick={() => window.open('http://www.bauerandcompany.com/', '_blank')}>Visit</Button>
                </List.Content>
              </Responsive>
              <List.Content>
                <List.Header>Bauer &amp; Company</List.Header>
                Providing audit and accounting services for technology companies, lending,
                not-for-profit entities and broker-dealers. Based out of Austin, TX.
                <Responsive maxWidth={767}>
                  <Button className="mt-20" fluid compact inverted color="green" onClick={() => window.open('http://www.bauerandcompany.com/', '_blank')}>Visit</Button>
                </Responsive>
              </List.Content>
            </List.Item>
            <List.Item>
              <Responsive minWidth={768}>
                <List.Content floated="right">
                  <Button compact inverted color="green" onClick={() => window.open('https://www.fruci.com', '_blank')}>Visit</Button>
                </List.Content>
              </Responsive>
              <List.Content>
                <List.Header>Fruci &amp; Associates II, PLLC</List.Header>
                A CPA firm that offers services ranging from tax services, management
                consulting, M&amp;A support, service organization controls, as well financial
                statement preparation, reviews and audits. Based out of Spokane, WA.
                <Responsive maxWidth={767}>
                  <Button className="mt-20" fluid compact inverted color="green" onClick={() => window.open('https://www.fruci.com', '_blank')}>Visit</Button>
                </Responsive>
              </List.Content>
            </List.Item>
          </List>
          <Divider section hidden />
          <Header as="h3">Legal Services</Header>
          <List celled relaxed="very" className="partners-list">
            <List.Item>
              <Responsive minWidth={768}>
                <List.Content floated="right">
                  <Button compact inverted color="green" onClick={() => window.open('https://www.polsinelli.com', '_blank')}>Visit</Button>
                </List.Content>
              </Responsive>
              <List.Content>
                <List.Header>Polsinelli</List.Header>
                Polsinelli is an Am Law 100 firm with more than 825 attorneys in 21 offices.
                <Responsive maxWidth={767}>
                  <Button className="mt-20" fluid compact inverted color="green" onClick={() => window.open('https://www.polsinelli.com', '_blank')}>Visit</Button>
                </Responsive>
              </List.Content>
            </List.Item>
            <List.Item>
              <Responsive minWidth={768}>
                <List.Content floated="right">
                  <Button compact inverted color="green" onClick={() => window.open('https://www.crowdcheck.com/', '_blank')}>Visit</Button>
                </List.Content>
              </Responsive>
              <List.Content>
                <List.Header>CrowdCheck</List.Header>
                Get help with the legal requirements and documentation with investment crowdfunding.
                <Responsive maxWidth={767}>
                  <Button className="mt-20" fluid compact inverted color="green" onClick={() => window.open('https://www.crowdcheck.com/', '_blank')}>Visit</Button>
                </Responsive>
              </List.Content>
            </List.Item>
            <List.Item>
              <Responsive minWidth={768}>
                <List.Content floated="right">
                  <Button compact inverted color="green" onClick={() => window.open('http://nextseed.legalzoom.com/', '_blank')}>Visit</Button>
                </List.Content>
              </Responsive>
              <List.Content>
                <List.Header>LegalZoom</List.Header>
                Get the legal help you need to start and grow your business. NextSeed
                Members get 20% off your LegalZoom order.
                <Responsive maxWidth={767}>
                  <Button className="mt-20" fluid compact inverted color="green" onClick={() => window.open('http://nextseed.legalzoom.com/', '_blank')}>Visit</Button>
                </Responsive>
              </List.Content>
            </List.Item>
          </List>
          <Divider section={!isMobile} hidden />
          <Header as="h3">Business Analytics</Header>
          <List celled relaxed="very" className="partners-list">
            <List.Item>
              <Responsive minWidth={768}>
                <List.Content floated="right">
                  <Button compact inverted color="green" onClick={() => window.open('https://tabulate.com/', '_blank')}>Visit</Button>
                </List.Content>
              </Responsive>
              <List.Content>
                <List.Header>Tabulate</List.Header>
                A service and software exclusively for restaurants and bars, helping you
                manage your bookkeeping, payroll, and data all in one place.
                <Responsive maxWidth={767}>
                  <Button className="mt-20" fluid compact inverted color="green" onClick={() => window.open('https://tabulate.com/', '_blank')}>Visit</Button>
                </Responsive>
              </List.Content>
            </List.Item>
          </List>
          <Divider section={!isMobile} hidden />
          <Header as="h3">Business Insurance</Header>
          <List celled relaxed="very" className="partners-list">
            <List.Item>
              <Responsive minWidth={768}>
                <List.Content floated="right">
                  <Button compact inverted color="green" onClick={() => window.open('https://nextseed.sureapp.com', '_blank')}>Visit</Button>
                </List.Content>
              </Responsive>
              <List.Content>
                <List.Header>Sure</List.Header>
                Purchase and manage the insurance policies that best suit your business.
                <Responsive maxWidth={767}>
                  <Button className="mt-20" fluid compact inverted color="green" onClick={() => window.open('https://nextseed.sureapp.com', '_blank')}>Visit</Button>
                </Responsive>
              </List.Content>
            </List.Item>
          </List>
          <Divider section={!isMobile} hidden />
          <Header as="h3">Architecture Firms</Header>
          <List celled relaxed="very" className="partners-list">
            <List.Item>
              <Responsive minWidth={768}>
                <List.Content floated="right">
                  <Button compact inverted color="green" onClick={() => window.open('http://www.methodarchitecture.com/', '_blank')}>Visit</Button>
                </List.Content>
              </Responsive>
              <List.Content>
                <List.Header>Method Architecture</List.Header>
                Full-service architecture firm specializing in tenant finish and ground-up
                projects encompassing industrial, corporate interiors, healthcare, hospitality,
                breweries, retail and more.
                <Responsive maxWidth={767}>
                  <Button className="mt-20" fluid compact inverted color="green" onClick={() => window.open('http://www.methodarchitecture.com/', '_blank')}>Visit</Button>
                </Responsive>
              </List.Content>
            </List.Item>
          </List>
          <Divider section hidden />
          <p className="more-info center-align">
            Please note that, in some instances, our partners may provide NextSeed with a
            referral fee if you use their services.
          </p>
          <Divider section hidden />
        </Container>
      </Aux>
    );
  }
}
