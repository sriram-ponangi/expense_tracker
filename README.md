# Expense Tracker

This is a full-stack serverless application that allows users to track their expenses. The frontend is built with Angular and the backend is powered by a serverless architecture using AWS Lambda, API Gateway, Cognito, and DynamoDB.

## Architecture

![Expense Tracker Serverless Architecture](docs/Serverless%20Application%20Architecture.jpg)

The application follows a classic serverless pattern:

*   **Frontend**: An Angular single-page application (SPA) provides the user interface. Deployable to an S3 bucket, Cloudflare Pages, or GitHub Pages (see [Deployment](#deployment) for the specifics).
*   **Backend**:
    *   **Amazon Cognito**: Handles user authentication and authorization, including sign-up, sign-in, and user management.
    *   **Amazon API Gateway**: Provides a secure and scalable entry point for the application's API. It routes requests to the appropriate Lambda functions.
    *   **AWS Lambda**: Contains the core business logic for creating, reading, and deleting expenses. The Lambda functions are written in Node.js.
    *   **Amazon DynamoDB**: A NoSQL database used to store expense data. Provisioned throughput with application auto-scaling enabled.
*   **Infrastructure as Code**: The entire AWS backend (Cognito, API Gateway, Lambda, IAM, DynamoDB, and its auto-scaling) is managed by **Terraform**. State lives in S3 with native locking. See [`iac/README.md`](iac/README.md).
*   **Data backup & restore**: Bash scripts export the DynamoDB table to S3 and rebuild a fresh table from the export via `import-table`. See [`backend/dynamoDB/README.md`](backend/dynamoDB/README.md).

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

The backend is provisioned end-to-end by Terraform. Follow [`iac/README.md`](iac/README.md) — a single `terraform apply` creates/updates Cognito, DynamoDB (with auto-scaling), Lambda functions and IAM roles, and API Gateway wired to Cognito.

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

The backend is deployed to AWS via **Terraform** — the full stack (Cognito, API Gateway, Lambda code + config, IAM, DynamoDB, auto-scaling) is defined in [`iac/`](iac/) and applied with `terraform apply`. See [`iac/README.md`](iac/README.md) for first-time setup and the day-to-day workflow.

### Frontend

The frontend can be deployed to any of the three targets below. Cloudflare Pages is the currently-live deployment: <https://expense-tracker.ponangi.workers.dev/>.

#### Option A — Cloudflare Pages (current live deployment)

1.  Build:
    ```bash
    ng build --optimization=false --base-href /
    ```
2.  Upload `ui/dist/ui/` to `Workers & Pages > <app-name> > Deployments`.

#### Option B — GitHub Pages

1.  Build with the repo-scoped base href (trailing slash required):
    ```bash
    ng build --optimization=false --base-href https://<your-github-username>.github.io/<your-repo-name>/

    # Example:
    ng build --optimization=false --base-href https://sriram-ponangi.github.io/expense_tracker/
    ```
2.  Commit `ui/dist/ui/` to the `app` branch.

#### Option C — S3 bucket

Upload the built `ui/dist/ui/` directory to an S3 bucket configured for static website hosting (or fronted by CloudFront). Set `--base-href` to the bucket's serving path.

 
## To-Do

*   Implement "edit expense" functionality.
*   Add more detailed filtering options for expenses.
*   Improve the UI/UX of the application.
