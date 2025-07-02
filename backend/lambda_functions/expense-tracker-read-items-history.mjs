import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1"
});
const docClient = DynamoDBDocumentClient.from(client);

//----------------------------------------------------------------------------------------------------------------
// Main Block
//----------------------------------------------------------------------------------------------------------------
export const handler = async (event, context, callback) => {
    let request = {
        "startDate": event.queryStringParameters.startDate,
        "endDate": event.queryStringParameters.endDate,
        "userId": event?.requestContext?.authorizer?.claims?.sub, // '4bb06de7-5d55-4c40-8c78-ae1d2c17eeb9',
    }
    
    let errorMessages = expenseRequestValidator(request);
    if (errorMessages.length > 0) {
        const finalResponse = new FinalResponse('Error: Bad Request', errorMessages, undefined);
        return {
            statusCode: 400,
            body: JSON.stringify(finalResponse),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    }

    try {
        const data = await queryItems(request);
        let response = computeMontlyExpenseHistoryResponse(data);
        
        const finalResponse = new FinalResponse('SUCCESS', undefined, response);

        return {
            statusCode: 200,
            body: JSON.stringify(finalResponse),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                // 'Access-Control-Allow-Headers': 'Accept, Authorization, Referer, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform, User-Agent',
                // 'Access-Control-Allow-Credentials': true
                
            }
        };
    } catch (err) {
        const finalResponse = new FinalResponse('ERROR', [err.message], undefined);
        return {
            statusCode: 500,
            body: JSON.stringify(finalResponse),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
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
        return errorMessages;
    }

    if ( data.startDate.length===7) {
        let sdate = new Date();
        sdate.setFullYear(parseInt(data.startDate.substring(0,4)));
        sdate.setMonth(parseInt(data.startDate.substring(5,7))-1);
        sdate.setDate(1);

        let isvalidDate = data.startDate && sdate.toString() !== 'Invalid Date';
        if (!isvalidDate) {
            errorMessages.push('Invalid Start Date. The date must be in "YYYY-MM" format or an empty string with "" ');
        }else {
            data.startDate = sdate.toISOString().slice(0, 10);
        }
    }else{
        errorMessages.push('Invalid Start Date. The date must be in "YYYY-MM" format');
    }

    if (data.endDate.length===7) {
        let edate = new Date();
        edate.setFullYear(parseInt(data.endDate.substring(0,4)));
        edate.setMonth(parseInt(data.endDate.substring(5,7)));
        edate.setDate(0);

        let isvalidDate = data.endDate && edate.toString() !== 'Invalid Date';
        if (!isvalidDate) {
            errorMessages.push('Invalid End Date. The date must be in "YYYY-MM" format or an empty string with "" ');
        }else {
            data.endDate = edate.toISOString().slice(0, 10);
        }
    } else{
        errorMessages.push('Invalid End Date. The date must be in "YYYY-MM" format');
    }
    
    return errorMessages;

}
//----------------------------------------------------------------------------------------------------------------
// Query data from DynamoDB
//----------------------------------------------------------------------------------------------------------------
async function queryItems(request) {
    const command = new QueryCommand({
        TableName: 'expense-tracker',
        KeyConditionExpression: '#name = :value and #date_alias BETWEEN :startDate AND :endDate',
        ExpressionAttributeValues: { ':value': request.userId, ':startDate': request.startDate, ':endDate': request.endDate },
        ExpressionAttributeNames: { '#name': 'user_id', '#date_alias': 'date' },
        ProjectionExpression: '#date_alias, expenses'
    });
    
    try {
        const data = await docClient.send(command);
        
        return data;
    } catch (err) {
        return err;
    }
}
//----------------------------------------------------------------------------------------------------------------
// Calculate the Aggregate of costs in the given data
//----------------------------------------------------------------------------------------------------------------
function getMonthNameKey(dateStr){
    let date = new Date(dateStr);
    return date.toLocaleString('default', { month: 'short'}) + "-" +date.getFullYear().toString().substr(-2);

}
function computeMontlyExpenseHistoryResponse(data) {
    let newResponse = new Map();
    
    data?.Items?.forEach((item, index) => {
        // console.log("Item: "+ index);
        // console.log(JSON.stringify(item)); // {"expenses":[{"category":"Vehicle","reason":"Auto Insurance","cost":1234}],"date":"2025-06-03"}

        let key = getMonthNameKey(item.date);
        let value;
        if(newResponse[key]){
            value = newResponse[key]; 
        }else {
            value = {
                futile: 0,
                home: 0,
                uncommon: 0,
                groceries: 0,
                vehicle: 0
            };
        }
        
        item.expenses.forEach((expense, index) => {
            if (expense.category === "Futile") {
                value.futile = Number(value.futile) + Number(expense.cost);
                value.futile = Number(value.futile.toFixed(2));
            }
            else if (expense.category === "Home") {
                value.home = Number(value.home) + Number(expense.cost);
                value.home = Number(value.home.toFixed(2));
            }
            else if (expense.category === "Groceries") {
                value.groceries = Number(value.groceries) + Number(expense.cost);
                value.groceries = Number(value.groceries.toFixed(2));
            }
            else if (expense.category === "Uncommon") {
                value.uncommon = Number(value.uncommon) + Number(expense.cost);
                value.uncommon = Number(value.uncommon.toFixed(2));
            }
            else if (expense.category === "Vehicle") {
                value.vehicle = Number(value.vehicle) + Number(expense.cost);
                value.vehicle = Number(value.vehicle.toFixed(2));
            }
        });
        
        newResponse[key] = value;

        
    });
    
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