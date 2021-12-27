# Expense_Tracker:

## Architecture:
![Expense Tracker Serverless Architecture](https://github.com/sriram-ponangi/expense_tracker/blob/develop/Serverless%20Application%20Architecture.jpg)




# To Do:
- Create Edit/Delete expense functionality in the All-Expenses Table.

# Commands:
- ng g c expense-tracker/home-page/expense-over-time-chart
- ng g c expense-tracker/common/cost-summary

---

# Release V1.0 - Features: http://expense--tracker.s3-website.us-east-2.amazonaws.com/
### Completed Features:
- Sign Up, Sign In, and Sign Out using Amazon Cognito.
- Inserting Expenses to DynamoDB
- Querying Expenses from DynamoDB by date range and displaying all expense details in:
  - Table.
  - Pie Chart
  - Summary Cards
- Querying Monthly Expense History from DynamoDB by month range and displaying all expense details in a stacked bar chart with a line chart showing the average expense during that period.
