class foodRescueParticipationLambdaClient {
    constructor(lambdaClient) {
        this.lambdaClient = lambdaClient;
        this.params = {
            FunctionName: 'foodRescueParticipation'
        };
    }

    //  {
    //  “emails” : [”emailOne@email”,”emailTwo@email”]
    //  }
    invoke(dataToSend) {
        console.log(`dataToSend is ${dataToSend}`)

        const dataToSendJson = JSON.parse(dataToSend)

        const params = {
            FunctionName: this.params.FunctionName,
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify({
                TargetArns: dataToSendJson["emails"]
            })
        };

        this.lambdaClient.invoke(params, function(err, data) {
            if (err) {
                console.error("Error invoking FoodRescueParticipationLambda", err, err.stack);
            } else {
                console.log("FoodRescueParticipationLambda invoked. Response:", data.Payload);
            }
        });
    }

    testLambdaClient(){
        console.log("foodRescueParticipationLambdaClient called");
    }
}

module.exports = foodRescueParticipationLambdaClient;