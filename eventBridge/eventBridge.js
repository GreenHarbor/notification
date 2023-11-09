const AWS = require('aws-sdk');

//Set rule in aws eventBridge
const lambdaTarget = {
  Arn: '',
  Id: 'workshopReminder',
};

//Input date will be of the format "2023-10-20-01:47:36:472"
//Convert format to 'cron(0 12 31 12 ? 2023)' which refers to December 31st, 2023, at 12:00 PM UTC
const parseDateToCron = (inputDate) => {
  const dateParts = inputDate.split('-');

  // Extract year, month, and day from the dateParts
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  //Return cron expression
  return `cron(0 12 ${day} ${month} ? ${year})`;
  // return `cron(10 5 5 11 ? 2023)`
};

//req will be in the form of
// {
// “email” : ”email@email”,
// ”title” : “title”,
// “date” : ”startdate”
// }
const putRuleset = async (eventBridgeClient, req, topicArn) => {
  const title = req['title'].split(' ').join('');
  const date = req['date'];

  const ruleParams = {
    Name: `Scheduled_rule_for_${title}`,
    ScheduleExpression: parseDateToCron(date), // Triggers on December 31st, 2023, at 12:00 PM UTC
    State: 'ENABLED',
    Description: `Setting ruleset for ${title}`,
    EventBusName: 'default', // The event bus where the rule is created (default or custom bus name)
  };

  //In the ruleset here, we need to set the eventBridge and also the payload
  try {
    eventBridgeClient.putRule(ruleParams, (err, data) => {
      if (err) {
        console.error('Error creating EventBridge rule:', err);
      } else {
        console.error('EventBridge rule created, linking to lambda:');

        const ruleName = `Scheduled_rule_for_${title}`;
        const params = {
          Rule: ruleName,
          Targets: [
            {
              Id: lambdaTarget.Id,
              Arn: lambdaTarget.Arn,
              Input: JSON.stringify({
                topicArn: topicArn,
                title: title,
                date: date,
              }), // Payload to be sent to the Lambda function
            },
          ],
        };
        //Target is the action or resource that is triggered when a rule within EventBridge matches an incoming event
        eventBridgeClient.putTargets(params, (targetErr, targetData) => {
          if (targetErr) {
            console.error(
              'Error adding target to EventBridge rule:',
              targetErr
            );
          } else {
            console.log('Target added to EventBridge rule:', targetData);
          }
        });
      }
    });
  } catch (e) {
    console.error('Error in creating EventBridge rule:', e);
  }
};

module.exports = { putRuleset };
