import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Accordion, Table, Icon, Button } from 'semantic-ui-react';

const categories = [
  {
    title: 'Investor FAQ',
    questions: [],
  },
  {
    title: 'Issuer FAQ',
    questions: [
      {
        question: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
      },
      {
        question: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
      },
    ],
  },
  {
    title: 'Issuer Knowledge Base',
    questions: [],
  },
  {
    title: 'Investor Knowledge Base',
    questions: [],
  },
  {
    title: 'Offerings',
    questions: [],
  },
  {
    title: 'Insights',
    questions: [],
  },
];

@observer
export default class AllCategories extends Component {
  render() {
    return (
      <Aux>
        {categories && categories.map(category => (
          <Accordion fluid styled className="card-style">
            <Accordion.Title active={category.questions.length > 0} className="text-capitalize">
              <Icon className="ns-chevron-up" />
              {category.title} <small>{category.questions.length} elements</small>
              <Link to={this.props.match.url} className="link pull-right"><small>+ Add Category</small></Link>
            </Accordion.Title>
            <Accordion.Content active={category.questions.length > 0} className="categories-acc">
              <div className="table-wrapper">
                <Table unstackable basic className="form-table categories-table">
                  <Table.Body>
                    {
                      category.questions && category.questions.map(question => (
                        <Table.Row>
                          <Table.Cell>
                            <Icon className="ns-drag-holder-large mr-10" />
                            {question.question}
                          </Table.Cell>
                          <Table.Cell collapsing>
                            <Button className="link-button">
                              <Icon name="ns-pencil" />
                            </Button>
                            <Button className="link-button">
                              <Icon color="blue" name="ns-no-view" />
                            </Button>
                            <Button className="link-button">
                              <Icon name="ns-trash" />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    }
                  </Table.Body>
                </Table>
              </div>
            </Accordion.Content>
          </Accordion>
        ))}
      </Aux>
    );
  }
}
