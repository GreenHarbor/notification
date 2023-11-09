import boto3
from datetime import datetime
from botocore.exceptions import ClientError

def send_direct_workshop_cancellation_with_subject(target_endpoint, message, subject):
    # Create an SNS client
    ses_client = boto3.client('ses')  # Replace 'your_region' with your AWS region

    sender_email = 'greenharbour21@gmail.com'
    recipient_email = target_endpoint

    # Publish a message directly to the target endpoint with a subject
    try:
        response = ses_client.send_email(
            Destination={
                'ToAddresses': [recipient_email]
            },
            Message={
                'Body': {
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': message
                    }
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': subject
                }
            },
            Source=sender_email
        )
        print(f"Email sent! Message ID: {response['MessageId']}")
    except ClientError as e:
        print(f"Email sending failed: {e.response['Error']['Message']}")


def lambda_handler(event, context):

    email = event['TargetArn']
    subject = f"Cancellation of {event['Subject']} workshop!"
    cancellation_date = datetime.now().date().strftime('%Y-%m-%d')  # Get the current date in 'YYYY-MM-DD' format
    message = (
        "Hi Sir/Mam,\n\n"
        f"You have successfully cancelled your participation for {event['Subject']} workshop on {cancellation_date}\n\n"
        "Sincerely,\n"
        "Organiser"
    )

    SNSResult = send_direct_workshop_cancellation_with_subject(email, message, subject)
    if SNSResult :
        print("Notification Sent..")
        return SNSResult
    else:
        return False