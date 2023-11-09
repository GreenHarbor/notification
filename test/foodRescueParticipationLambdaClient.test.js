const { expect } = require('chai');
const sinon = require('sinon');
const foodRescueParticipationLambdaClient = require('../lambdaClients/foodRescueParticipationLambdaClient'); // Replace with your actual import path

describe('foodRescueParticipationLambdaClient', () => {
    let lambdaClient;

    beforeEach(() => {
        lambdaClient = {
            invoke: sinon.stub().callsFake((params, callback) => {
                callback(null, { Payload: 'Test payload' });
            }),
        };
    });

    it('should invoke the Lambda function with proper payload', () => {
        const client = new foodRescueParticipationLambdaClient(lambdaClient);

        const dataToSend = '{"emails": ["test@example.com"]}';
        client.invoke(dataToSend);

        // Check if the Lambda function is invoked with the expected payload
        expect(lambdaClient.invoke.calledOnce).to.be.true;
        expect(lambdaClient.invoke.firstCall.args[0]).to.deep.equal({
            FunctionName: 'foodRescueParticipation',
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify({
                TargetArns: ['test@example.com']
            })
        });
    });

    it('should handle errors when invoking Lambda', () => {

        const client = new foodRescueParticipationLambdaClient(lambdaClient);

        const dataToSend = '{"emails": ["test@example.com"]}';
        client.invoke(dataToSend);

        expect(lambdaClient.invoke.calledOnce).to.be.true;
    });
});
