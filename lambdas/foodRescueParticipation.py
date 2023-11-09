import boto3
from datetime import datetime
from botocore.exceptions import ClientError

def send_direct_food_rescue_participation_with_subject(target_endpoint, message, subject):
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

    emails = event['TargetArns']
    subject = f"Come join food rescue!"
    current_date = datetime.now().date().strftime('%Y-%m-%d')  # Get the current date in 'YYYY-MM-DD' format
    message = (
        f"Hi Sir/Mam,\n\n"
        f"A new food rescue that you may be interested in has been published on {current_date}.\n\n"
        "Sincerely,\n"
        "GreenHarbour Team"
    )

    for email in emails:
        send_direct_food_rescue_participation_with_subject(email, message, subject)



