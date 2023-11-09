class workshopWithdrawnLambdaClient {
    constructor(lambdaClient) {
        this.lambdaClient = lambdaClient;
        this.params = {
            FunctionName: 'workshopWithdrawn'
        };
    }

    //  {
    //  ”title” : “title”,
    //  “email” : ”email@email”
    //  }
    invoke(dataToSend) {
        console.log(`dataToSend is ${dataToSend}`)

        const dataToSendJson = JSON.parse(dataToSend)

        const params = {
            FunctionName: this.params.FunctionName,
            InvocationType: 'RequestResponse',
            //This will be passed as event in the lambda_handler function
            Payload: JSON.stringify({
                Subject: dataToSendJson["title"],
                TargetArn: dataToSendJson["email"]
            })
        };

        this.lambdaClient.invoke(params, function(err, data) {
            if (err) {
                console.error("Error invoking WorkshopWithdrawnLambda:", err, err.stack);
            } else {
                console.log("WorkshopWithdrawnLambda invoked. Response:", data.Payload);
            }
        });
    }

    testLambdaClient(){
        console.log("workshopWithdrawnLambdaClient called");
    }
}

module.exports = workshopWithdrawnLambdaClient;
