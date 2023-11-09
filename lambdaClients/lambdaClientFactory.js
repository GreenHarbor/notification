const AWS = require('aws-sdk')
const workshopWithdrawnLambdaClient = require("./workshopWithdrawnLambdaClient");
const foodRescueParticipationLambdaClient = require("./foodRescueParticipationLambdaClient");
const workshopReminderLambda = require("./workshopReminderLambdaClient");

// const credentials = {
//     accessKeyId: 'AKIAZVA7NPEFIN7EDGDD',
//     secretAccessKey: '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',
//     region: 'ap-southeast-1'
// };

// Create an AWS Secrets Manager client
const secretsManager = new AWS.SecretsManager({ region: 'ap-southeast-1' });

// Function to retrieve the secret
async function getAWSCredentials() {
    try {
        const secretData = await secretsManager.getSecretValue({ SecretId: 'credentials' }).promise();

        if ('SecretString' in secretData) {
            const secrets = JSON.parse(secretData.SecretString);
            return secrets;
        } else {
            // Handle binary secret
            const buff = new Buffer(secretData.SecretBinary, 'base64');
            return buff.toString('ascii');
        }
    } catch (error) {
        console.error('Error retrieving AWS credentials from Secrets Manager:', error);
        throw error;
    }
}

const lambdaMap = new Map();

async function createLambda(queueName) {

    const credentials = await getAWSCredentials();

    console.log(`credentials are ${credentials}`)

    const lambdaClient = new AWS.Lambda(credentials);
    const snsClient = new AWS.SNS(credentials);
    const eventBridgeClient = new AWS.EventBridge(credentials);

    if (queueName === 'Workshop_Withdrawal_Notification') {

        if(!lambdaMap.has('Workshop_Withdrawal_Notification')){
            console.log(`Lambda client factory creates from [${queueName}]`);

            lambdaMap.set('Workshop_Withdrawal_Notification', new workshopWithdrawnLambdaClient(lambdaClient));
        }
        return lambdaMap.get('Workshop_Withdrawal_Notification')
    } else if (queueName === 'Foodrescue_Notification') {

        if(!lambdaMap.has('Foodrescue_Notification')){
            console.log(`Lambda client factory creates from [${queueName}]`);

            lambdaMap.set('Foodrescue_Notification', new foodRescueParticipationLambdaClient(lambdaClient));
        }
        return lambdaMap.get('Foodrescue_Notification');
    } else if(queueName === 'Workshop_Registration_Notification') {

        if(!lambdaMap.has('Workshop_Registration_Notification')){
            console.log(`Lambda client factory creates from [${queueName}]`);

            lambdaMap.set('Workshop_Registration_Notification', new workshopReminderLambda(lambdaClient, snsClient, eventBridgeClient));
        }
        return lambdaMap.get('Workshop_Registration_Notification');
    }else {
        console.log('Invalid input. Input queueName should be either "Workshop_Withdrawal_Notification" or "foodRescueParticipation" or "Workshop_Registration_Notification".');
    }
}

module.exports = { createLambda };
