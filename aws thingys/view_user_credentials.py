import boto3
import json
import requests
import os

ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID")
SECRET_ACCESS_KEY = os.getenv("SECRET_ACCESS_KEY")

# Define the region of your table & the table name
REGION = "eu-west-1"
TABLE_NAME = "Users"

# Initialize session
session = boto3.session.Session(
    aws_access_key_id=ACCESS_KEY_ID,
    aws_secret_access_key=SECRET_ACCESS_KEY,
    region_name=REGION,
)

# Create DynamoDB client
dynamodb = session.client('dynamodb')

response = dynamodb.get_item(
    TableName=TABLE_NAME, 
    Key={"ID": {"S": "001"}}
)

# What does the response look like?
print(json.dumps(response, indent=4))

if response['ResponseMetadata']['HTTPStatusCode'] == 200:
    # Get the username object and retrieve the string value
    username = response["Item"]["Username"].get("S")
    user_id = response["Item"]["ID"].get("S")
    password = response["Item"]["Password"].get("S")

    # Print out the data you just fetched
    print("Heres the users information:\n")
    print(f"User ID: {user_id}")
    print(f"Username: {username}")
    print(f"Password: {password}")
