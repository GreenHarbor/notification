const { expect } = require('chai');
const sinon = require('sinon');
const WorkshopWithdrawnLambdaClient = require('../lambdaClients/workshopWithdrawnLambdaClient');

describe('WorkshopWithdrawnLambdaClient', () => {
    it('should call lambdaClient.invoke with the correct payload', (done) => {
        const lambdaClientStub = {
            invoke: sinon.stub().callsArgWith(1, null, { Payload: 'Some response' })
        };

        const workshopWithdrawnClient = new WorkshopWithdrawnLambdaClient(lambdaClientStub);
        const dataToSend = '{"title": "MyTitle", "email": "example@email.com"}';

        workshopWithdrawnClient.invoke(dataToSend);

        setTimeout(() => {
            expect(lambdaClientStub.invoke.calledOnce).to.be.true;
            const invokedParams = lambdaClientStub.invoke.firstCall.args[0];

            expect(invokedParams.FunctionName).to.equal('workshopWithdrawn');

            done();
        }, 100);
    });

    it('should log a message when testLambdaClient is called', () => {
        const consoleLogSpy = sinon.spy(console, 'log');
        const workshopWithdrawnClient = new WorkshopWithdrawnLambdaClient();

        workshopWithdrawnClient.testLambdaClient();

        expect(consoleLogSpy.calledOnce).to.be.true;
        expect(consoleLogSpy.calledWith('workshopWithdrawnLambdaClient called')).to.be.true;

        consoleLogSpy.restore();
    });
});
