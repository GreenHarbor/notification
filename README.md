# Notification Microservice

## Introduction

Welcome to the Notification Microservice repository. This application is built with both JavaScript and Python and serves as a crucial component in a microservices architecture. It listens for messages from RabbitMQ sent by other microservices. Upon detection of a message, it schedules an EventBridge CRON event to invoke an AWS Lambda function. This function is responsible for sending notifications via Amazon Simple Notification Service (SNS) and Amazon Simple Email Service (SES).

Repository: [notification](https://github.com/GreenHarbor/notification.git)

## Features

- **RabbitMQ Listener**: Monitors messages from RabbitMQ queues.
- **EventBridge CRON Scheduling**: Writes CRON events to AWS EventBridge.
- **AWS Lambda Integration**: Triggers a Lambda function to process notifications.
- **Amazon SNS and SES**: Utilizes SNS for notifications and SES for email delivery.
- **Multi-Language Codebase**: Combines JavaScript and Python for a versatile application setup.

## Getting Started

These instructions will guide you through the process of setting up the Notification Microservice on your local machine for development and testing purposes.

### Prerequisites

- Node.js (for JavaScript execution)
- Python 3.8+ (for Python execution)
- AWS CLI (configured with the necessary permissions)
- RabbitMQ (accessible for the microservice to connect)
- AWS Lambda, Amazon SNS, and Amazon SES (set up and configured)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/GreenHarbor/notification.git
   ```
2. Navigate to the project directory:
   ```
   cd notification
   ```
3. Install JavaScript dependencies:
   ```
   npm install
   ```
4. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

### Configuration

- Configure your environment variables to include your AWS credentials, RabbitMQ settings, and other necessary configurations.
- Ensure that the AWS services (Lambda, SNS, SES) are properly set up with the correct permissions and configurations.

### Running the Application

1. Start the listener script to begin monitoring RabbitMQ messages:
2. When a message is received, the application will schedule an EventBridge CRON event.
3. The CRON event triggers the AWS Lambda function, which then sends out notifications via SNS and emails via SES.

## Usage

The service operates automatically once configured. Ensure that all connections to RabbitMQ and AWS services are correctly established.
