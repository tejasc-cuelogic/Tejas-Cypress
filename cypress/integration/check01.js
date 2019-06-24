function add (a, b) {
    return a + b
  }
  
  function subtract (a, b) {
    return a - b
  }
  
  function divide (a, b) {
    return a / b
  }
  
  function multiply (a, b) {
    return a * b
  }
  
  const data01 = {
      name: 'Pratik T',
      profession: 'Engineer',
      address: {
          area: 'Balewadi',
          city: 'Pune',
          pincode: 411045
      }
  };

  const data02 = {
    name: 'Pratik T',
    profession: 'Engineer',
    address: {
        area: 'Balewadi',
        city: 'Pune',
        pincode: 411015
    }
};

describe('Unit test our math functions', function() {
    before(() => {
        cy.server();
    })
    describe('case with http 500', () => {
        before(() => {
            cy.route('https://jsonplaceholder.typicode.com/todos/1').as('d1');
        })
    
        it('test n1', () => {
            cy.wait(['@d1']).then((xhrs) => {
                console.log(xhrs);
                expect(add(1, 2)).to.eq(3);
                console.log(2);
            });
        })
    
        it('test nr 2', () => {
            expect(divide(27, 9)).to.eq(3)
            console.log(`2`);
        })
      })
    
  })
  // -- End: Our Application Code --

//   cy.wait(['@d1']).then((xhrs) => {
    
//   });
  // -- Start: Our Cypress Tests --
//   describe('Unit test our math functions', function() {
//     Object.keys(data01).forEach(dataKey => {
//         specify(`data01 > ${dataKey} is identical to data02 > ${dataKey}`, function() {
//             expect(data01[dataKey]).to.deep.equal(data02[dataKey]);
//         })
//     })
//     context('math', function() {
//         it('can add numbers', function() {
//               cy.wait(['@d1']).then((xhrs) => {
//                   expect(add(1, 2)).to.eq(3)
//               });
//         })

//         it('can subtract numbers', function() {
//             expect(subtract(5, 12)).to.eq(-17)
//         })

//         specify('can divide numbers', function() {
//             expect(divide(27, 9)).to.eq(3)
//         })

//         specify('can multiply numbers', function() {
//             expect(multiply(5, 4)).to.eq(20)
//         })
//     })
//   })