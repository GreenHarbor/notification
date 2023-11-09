const {putRuleset} = require("../eventBridge/eventBridge");

//WorkshopReminderLambdaClient creates ARNTopic and set rules in eventbridge
class workshopReminderLambdaClient {
    constructor(lambdaClient, snsClient, eventBridgeClient) {
        this.lambdaClient = lambdaClient;
        this.snsClient = snsClient;
        this.eventBridgeClient = eventBridgeClient;
        this.params = {
            FunctionName: 'workshopReminder'
        };
    };


    createSNSTopic(topicName) {
        return new Promise((resolve, reject) => {
            this.snsClient.createTopic({ Name: topicName }, (err, data) => {
                if (err) {
                    console.error('Error creating SNS topic:', err);
                    reject(err); // Reject the promise with the error
                } else {
                    resolve(data.TopicArn); // Resolve the promise with the topic ARN
                }
            });
        });
    }

    snsClientSubscribeHelper (email, topicArn) {
        this.snsClient.subscribe({
            Protocol: 'email',
            TopicArn: topicArn, //params.Payload.title
            Endpoint: email //params.Payload.email
        }, (err, data) => {
            if (err) {
                console.log("Error subscribing email to SNS topic:", err);
                throw err;
            } else {
                console.log(`Email ${email} subscribed to topic ${topicArn}. Subscription ARN: ${data.SubscriptionArn}`);
            }
        })
    }

    invokeTwo(){
        console.log("workshopReminderLambdaClient called");
    }

    //dataToSend payload will be in the form of
    // {
    // “email” : ”email@email”,
    // ”title” : “title”,
    // “date” : ”startdate”
    // }
    invoke(dataToSend) {
        console.log(`dataToSend is ${dataToSend}`)

        const dataToSendJson = JSON.parse(dataToSend)

        // const params = {
        //     FunctionName: this.params.FunctionName,
        //     InvocationType: 'RequestResponse',
        //     Payload: JSON.stringify({
        //         title: dataToSendJson["title"],
        //         date: dataToSendJson["date"]
        //     })
        // };

        //Check if workshop ARN has been created
        //If the workshop ARN has been created then we will just subscribe the current user
        //If not we will create the ARN subscribe the current user and invoke putRuleset
        // console.log(params.Payload)

        const userEmail = dataToSendJson["email"];
        const topicName = dataToSendJson["title"].split(' ').join('');

        console.log(`userEmail is [${userEmail}]`)
        console.log(`topicName is [${topicName}]`)
        console.log(`date is [${topicName}]`)

        try{
            this.snsClient.listTopics({}, async(err, data) => {
                if (err) {
                    console.log("Error listing SNS topics:", err);
                    throw err;
                } else {
                    // Check if the topic with the specified name exists in the list
                    const topicExists =  data.Topics.some(topic => topic.TopicArn.includes(topicName));

                    if(topicExists){
                        const existingTopicArn = data.Topics.find(topic => topic.TopicArn.includes(topicName)).TopicArn;
                        console.log(`Topic exists and ExitstingTopicArn is [${existingTopicArn}]`)

                        //subscribe user to topicArn
                        this.snsClientSubscribeHelper(userEmail, existingTopicArn);
                    }else{

                        const newTopicArn = await this.createSNSTopic(topicName)
                            .then(topicArn => {
                                console.log('Retrieved Topic ARN:', topicArn);
                                return topicArn;
                                // Use the topic ARN as needed
                            })
                            .catch(error => {
                                console.error('Failed to create SNS topic:', error);
                                // Handle the error
                                throw error;
                            });

                        console.log(`Topic does not exists and newTopicArn is [${newTopicArn}]`)

                        //subscribe user to topicArn
                        this.snsClientSubscribeHelper(userEmail, newTopicArn);

                        //When the time comes the lambda containing the topic will be triggered
                        await putRuleset(this.eventBridgeClient, dataToSendJson, newTopicArn)

                        console.log("WorkshopReminderLambda successfully invoked. Response:", data.Payload);
                    }
                }
            });

        }catch(error){
            console.log(error)
        }

    }

    testLambdaClient(){
        console.log("workshopReminderLambdaClient called");
    }
}

module.exports = workshopReminderLambdaClient;
