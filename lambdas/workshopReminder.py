import boto3
from datetime import datetime

#Workshop registration lambda to remind participants to participate 1 day before the actual workshop
def send_sns(topic_arn, message, subject):
    try:
        client = boto3.client("sns")
        result = client.publish(TopicArn=topic_arn, Message=message, Subject=subject)
        if result['ResponseMetadata']['HTTPStatusCode'] == 200:
            print(result)
            print("Notification send successfully..!!!")
            return True
    except Exception as e:
        print("Error occured while publish notifications and error is : ", e)
        return True

#Input date will be of the format "2023-10-20-01:47:36:472"
#Need to convert to December 31st, 2023 format
def convert_date(date_string):
    datetime_obj = datetime.strptime(date_string, "%Y-%m-%d-%H:%M:%S:%f")

    month_names = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    year = datetime_obj.year
    month = month_names[datetime_obj.month - 1]
    day = datetime_obj.day

    formatted_date = f"{month} {day}st, {year}"

    return formatted_date


def lambda_handler(event, context):

    #Ideally have the
    subject = f"Reminder to attend {event['title']} workshop!"
    startDate = convert_date(event['date'])
    message = (
        "Hi Sir/Mam,\n\n"
        f"The workshop that you have registered for will schedule for {startDate}\n"
        "Please remember to attend the workshop! \n\n"
        "Sincerely,\n"
        "Organiser"
    )

    SNSResult = send_sns(event['topicArn'], message, subject)
    if SNSResult :
        print("Notification Sent..")
        return SNSResult
    else:
        return False