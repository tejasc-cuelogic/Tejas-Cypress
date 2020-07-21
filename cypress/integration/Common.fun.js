export const otpcode = () =>
{
    for(let i=0;i<6;i++)
    {
       cy.get('[data-id=${i}]').type(1);
    }
}