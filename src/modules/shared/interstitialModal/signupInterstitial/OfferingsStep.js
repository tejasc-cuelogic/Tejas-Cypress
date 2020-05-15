// import React from 'react';
// import { Grid, Modal, Card, Header } from 'semantic-ui-react';
// import HtmlEditor from '../../HtmlEditor';
// import NSImage from '../../NSImage';

// const OfferingStep = () => (
//   <Grid>
//     <Grid.Column computer={6}>
//       <Grid.Row>
//         <Modal.Header>{OfferingStepMeta.header}</Modal.Header>
//       </Grid.Row>
//       <Grid.Row>
//         <Modal.Content>{OfferingStepMeta.content}</Modal.Content>
//       </Grid.Row>
//     </Grid.Column>
//     <Grid.Column computer={10}>
//       <Card.Group itemsPerRow={isMobile ? 1 : 3}>
//         {offeringsToDisplay.map(offering => (
//           <Card className="bordered center-align">
//             <NSImage path={offering.imageUrl} centered />
//             <Card.Content>
//               <Header as="h5">{offering.title}</Header>
//               <Card.Meta>
//                 {offering.location}
//               </Card.Meta>
//               <Card.Description>
//                 <HtmlEditor readOnly content={offering.description} />
//               </Card.Description>
//               <p><b>{offering.meta1}</b></p>
//               <p><b>{offering.meta2}</b></p>
//               <p className="more-info">{offering.offeredBy}</p>
//             </Card.Content>
//           </Card>
//         ))}
//       </Card.Group>
//       <p>{OfferingStepMeta.note}</p>
//     </Grid.Column>
//   </Grid>
// );

// export default OfferingStep;
