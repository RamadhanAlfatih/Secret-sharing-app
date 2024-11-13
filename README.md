Secret Sharing App

A simple and secure secret-sharing application that allows users to share confidential information through a one-time URL. The secret will expire once it has been viewed or after a specified time period.

Features

Secure Secret Sharing: Secrets are encrypted and stored in Redis for a limited time.

Ephemeral Links: Generate one-time use links that will expire after being accessed or after the expiration time.

Simple UI: User-friendly interface for entering secrets and generating URLs.

Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: Redis for in-memory storage of secrets

Encryption: AES-256 to ensure secrets are securely stored

Installation

To set up this project locally, follow the steps below:

Prerequisites

Node.js: Download and install Node.js

Redis: Install Redis on your local machine or use a cloud Redis provider.

Steps

Clone the Repository:

git clone https://github.com/yourusername/secret-sharing-app.git
cd secret-sharing-app

Install Dependencies:

npm install

Start Redis Server:

Windows: Run redis-server.exe from the folder where you installed Redis.

Mac/Linux: Run redis-server.

Run the Application:

node server.js

Access the App:

Open your browser and go to http://localhost:3000.

Usage

Enter the secret you want to share.

Select the expiration time.

Click Generate Secret to get a one-time URL.

Share the generated URL with your intended recipient.

Screenshots



Project Structure

secret-sharing-app/
  ├── node_modules/
  ├── public/
  │    └── index.html
  ├── package.json
  ├── server.js
  ├── .gitignore
  └── README.md

Future Enhancements

HTTPS Integration for better security during data transmission.

Authentication: Adding user accounts for more personalized secret sharing.

Expiration Notifications: Notify users when their secrets expire.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments

Redis for fast in-memory data storage.

Express.js for the backend web server.

Font Awesome for any icons used in the UI.

Feel free to fork the repository, open issues, or contribute to make this project better!