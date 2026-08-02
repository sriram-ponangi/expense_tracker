# Expense Tracker

This is a full-stack serverless application that allows users to track their expenses. The frontend is built with Angular and the backend is powered by a serverless architecture using AWS Lambda, API Gateway, Cognito, and DynamoDB.

## Architecture

![Expense Tracker Serverless Architecture](docs/Serverless%20Application%20Architecture.jpg)

The application follows a classic serverless pattern:

*   **Frontend**: An Angular single-page application (SPA) provides the user interface. It is hosted on GitHub Pages or S3 Bucket.
*   **Backend**:
    *   **Amazon Cognito**: Handles user authentication and authorization, including sign-up, sign-in, and user management.
    *   **Amazon API Gateway**: Provides a secure and scalable entry point for the application's API. It routes requests to the appropriate Lambda functions.
    *   **AWS Lambda**: Contains the core business logic for creating, reading, and deleting expenses. The Lambda functions are written in Node.js.
    *   **Amazon DynamoDB**: A NoSQL database used to store expense data.

## Features

*   User sign-up, sign-in, and sign-out functionality.
*   Securely create, read, and delete expenses.
*   View expenses in a table, with the ability to filter by date range.
*   Visualize expense data with a pie chart and a monthly summary bar chart.
*   Summary cards for a quick overview of expenses.

## Getting Started

### Prerequisites

*   [Node.js and npm](https://nodejs.org/en/)
*   [Angular CLI](https://angular.io/cli)
*   [AWS CLI](https://aws.amazon.com/cli/), configured with your AWS credentials.

### Backend Setup

1.  **Cognito User Pool**: Create a Cognito User Pool to manage user authentication. Note the User Pool ID and Client ID.
2.  **DynamoDB Table**: Create a DynamoDB table to store the expense data. Define the primary key and any necessary secondary indexes.
3.  **Lambda Functions**: Deploy the Lambda functions located in the `backend/lambda_functions` directory. You will need to configure the environment variables for each function with the Cognito User Pool ID, Client ID, and DynamoDB table name.
4.  **API Gateway**: Create an API Gateway and configure it to trigger the appropriate Lambda functions for each endpoint. Secure the endpoints using a Cognito authorizer.

### Frontend Setup

1.  Navigate to the `ui` directory:
    ```bash
    cd ui
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Update the environment variables in `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your Cognito and API Gateway details.
4.  To run the application locally, use the Angular CLI's development server:
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/` in your browser.

## Deployment

### Backend

The backend is deployed to AWS using the services mentioned above. You can use the AWS Management Console, AWS CLI, or an infrastructure-as-code tool like AWS CloudFormation or Terraform to automate the deployment process.

### Frontend

The frontend is deployed to GitHub Pages.

1.  Build the application with the correct `--base-href`:
    ```bash
    ng build --optimization=false --base-href https://<your-github-username>.github.io/<your-repo-name>/

    # Example:
    # NOTE: The slash at the end of base-href is required do not exclude it.
    ng build --optimization=false --base-href https://sriram-ponangi.github.io/expense_tracker/
    ```
    
2.  The contents of the build output i.e., `ui/dist/ui` directory are committed to the `app` branch of this repository.

The frontend is deployed to Cloudflare Pages.
1.  Build the application with the correct `--base-href`:
    ```bash
    ng build --optimization=false --base-href /
    ```
2. The contents of the build output i.e., `ui/dist/ui` directory are uploaded to `Workers & Pages > app-name(ex: Workers & Pages
expense-tracker) > Deployments`

 
## To-Do

*   Implement "edit expense" functionality.
*   Add more detailed filtering options for expenses.
*   Improve the UI/UX of the application.
