import requests
import json

# Define the URL for the API endpoint
url = 'http://localhost:8000/demo_register/'

# Create a list of user data with unique first and last names
user_data = [
    {
        "first_name": "John",
        "last_name": "Doe",
        "username": "john.doe",
        "password": "demopassword"
    },
    {
        "first_name": "Jane",
        "last_name": "Smith",
        "username": "jane.smith",
        "password": "demopassword"
    },
    {
        "first_name": "Michael",
        "last_name": "Johnson",
        "username": "michael.johnson",
        "password": "demopassword"
    },
    {
        "first_name": "Emily",
        "last_name": "Brown",
        "username": "emily.brown",
        "password": "demopassword"
    },
    {
        "first_name": "William",
        "last_name": "Jones",
        "username": "william.jones",
        "password": "demopassword"
    },
    {
        "first_name": "Olivia",
        "last_name": "Miller",
        "username": "olivia.miller",
        "password": "demopassword"
    },
    {
        "first_name": "David",
        "last_name": "Wilson",
        "username": "david.wilson",
        "password": "demopassword"
    },
    {
        "first_name": "Ava",
        "last_name": "Davis",
        "username": "ava.davis",
        "password": "demopassword"
    },
    {
        "first_name": "James",
        "last_name": "Martinez",
        "username": "james.martinez",
        "password": "demopassword"
    },
    {
        "first_name": "Sophia",
        "last_name": "Lee",
        "username": "sophia.lee",
        "password": "demopassword"
    }
]

def register_demo_users():
    # Loop through the user data and send POST requests
    for user in user_data:
        headers = {'Content-Type': 'application/json'}
        data = json.dumps(user)

        # Send the POST request
        response = requests.post(url, data=data, headers=headers)

        # Check the response status
        if response.status_code == 201:
            print(f"User '{user['username']}' registered successfully.")
        else:
            print(f"Failed to register user '{user['username']}' with status code: {response.status_code}")


### ----------------- Execution ------------------- ###


register_demo_users()

