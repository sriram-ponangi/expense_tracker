/*
* Lambda Funtion to read expense items from dynamoDB
*/


const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
//----------------------------------------------------------------------------------------------------------------
// Main Block
//----------------------------------------------------------------------------------------------------------------
exports.handler = async (event, context, callback) => {
    let request = {
        "startDate": event.queryStringParameters.startDate,
        "endDate": event.queryStringParameters.endDate,
        "userId": '1e952ad7-b87e-41cf-8d36-7d99b54813c9', // event?.requestContext?.authorizer?.claims?.sub
        "responseData": event.queryStringParameters.responseData
    }


    let errorMessages = expenseRequestValidator(request);
    if (errorMessages.length > 0) {
        const finalResponse = new FinalResponse('Error: Bad Request', errorMessages, undefined);
        return {
            statusCode: '400',
            body: JSON.stringify(finalResponse),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    }

    try {
        const data = await queryItems(request);
        let response = data;
        if (request.responseData === "AGGREGATE") {
            response = computeAggregateResponse(response);
        }
        const finalResponse = new FinalResponse('SUCCESS', undefined, response);
        return {
            statusCode: '200',
            body: JSON.stringify(finalResponse),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    } catch (err) {
        const finalResponse = new FinalResponse('ERROR', [err.message], undefined);
        return {
            statusCode: '500',
            body: JSON.stringify(finalResponse),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    }
}
//----------------------------------------------------------------------------------------------------------------
// Request Validations
//----------------------------------------------------------------------------------------------------------------
function expenseRequestValidator(data) {
    let errorMessages = [];
    if (!data) {
        errorMessages.push("Invalid Data. Please correct your request body and try again.");
    }

    if (data.startDate !== "") {
        let date = new Date(data.startDate);
        let isvalidDate = data.startDate && date.toString() !== 'Invalid Date';
        if (!isvalidDate) {
            errorMessages.push('Invalid Start Date. The date must be in "YYYY-MM-DD" format or an empty string with "" ');
        }
    }

    if (data.endDate !== "") {
        let date = new Date(data.endDate);
        let isvalidDate = data.endDate && date.toString() !== 'Invalid Date';
        if (!isvalidDate) {
            errorMessages.push('Invalid End Date. The date must be in "YYYY-MM-DD" format or an empty string with "" ');
        }
    }


    if (!(data.responseData === "AGGREGATE" || data.responseData === "DETAILED")) {
        errorMessages.push('Invalid Response Data. The value of responseData must either be "AGGREGATE" or "DETAILED" ');
    }

    return errorMessages;

}
//----------------------------------------------------------------------------------------------------------------
// Query data from DynamoDB
//----------------------------------------------------------------------------------------------------------------
async function queryItems(request) {
    var params = {
        TableName: 'expense-tracker',
        KeyConditionExpression: '#name = :value and #date_alias BETWEEN :startDate AND :endDate',
        ExpressionAttributeValues: { ':value': request.userId, ':startDate': request.startDate, ':endDate': request.endDate },
        ExpressionAttributeNames: { '#name': 'user_id', '#date_alias': 'date' },
        ProjectionExpression: '#date_alias, expenses'
    }
    try {
        const data = await docClient.query(params).promise();
        return data;
    } catch (err) {
        return err;
    }
}
//----------------------------------------------------------------------------------------------------------------
// Calculate the Aggregate of costs in the given data
//----------------------------------------------------------------------------------------------------------------
function computeAggregateResponse(response) {
    let newResponse = {
        futile: 0,
        home: 0,
        uncommon: 0,
        groceries: 0
    }

    response?.Items?.forEach((item, index) => {
        item.expenses.forEach((expense, index) => {
            console.log(expense.category, expense.cost);
            if (expense.category === "Futile") {
                newResponse.futile = Number(newResponse.futile) + Number(expense.cost);
            }
            else if (expense.category === "Home") {
                newResponse.home = Number(newResponse.home) + Number(expense.cost);
            }
            else if (expense.category === "Groceries") {
                newResponse.groceries = Number(newResponse.groceries) + Number(expense.cost);
            }
            else if (expense.category === "Uncommon") {
                newResponse.uncommon = Number(newResponse.uncommon) + Number(expense.cost);
            }
        });
    });


    newResponse.futile = Number(newResponse.futile.toFixed(2));
    newResponse.home = Number(newResponse.home.toFixed(2));
    newResponse.groceries = Number(newResponse.groceries.toFixed(2));
    newResponse.uncommon = Number(newResponse.uncommon.toFixed(2));

    return newResponse;
}
//----------------------------------------------------------------------------------------------------------------
// Response Object
//----------------------------------------------------------------------------------------------------------------
class FinalResponse {

    constructor(responseType, errorMessages, data) {
        this.responseType = responseType;
        this.errorMessages = errorMessages;
        this.data = data;
    }

}