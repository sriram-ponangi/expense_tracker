const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
//----------------------------------------------------------------------------------------------------------------
// Main Block
//----------------------------------------------------------------------------------------------------------------
exports.handler = async (event, context) => {
    console.log(event);
    let expenseData = JSON.parse(event.body); // event.body;
    
    let errorMessages = expenseDataValidator(expenseData);
    if (errorMessages.length > 0) {
        const finalResponse = new FinalResponse('Error: Bad Request', errorMessages, undefined);
        return {
            statusCode: '400',
            body: JSON.stringify(finalResponse),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    }

    let insertItem = {
        "user_id":  event?.requestContext?.authorizer?.claims?.sub, // '1e952ad7-b87e-41cf-8d36-7d99b54813c9',
        "date": expenseData.date,
        "expenses": [
            {
                "category": expenseData.category,
                "cost": expenseData.cost,
                "reason": expenseData.reason
            }
        ]

    };
    console.log(insertItem);
    
    try {

        const data = await createItem(insertItem);

        const response = {
            "message": "Inserted '"+ expenseData.reason + "' at " + expenseData.date
        }
        
        const finalResponse = new FinalResponse('SUCCESS', undefined, response);
        return {
            statusCode: '200',
            body: JSON.stringify(finalResponse),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
        
        
        
    } catch (err) {
        const finalResponse = new FinalResponse('ERROR', [err.message], undefined);
        return {
            statusCode: '500',
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
function expenseDataValidator(data) {
    let errorMessages = [];
    if (!data) {
        errorMessages.push("Invalid Data. Please correct your request body and try again.");
    }

    let date = new Date(data.date);
    let isvalidDate = data.date && date.toString() !== 'Invalid Date';
    if(!isvalidDate) {
        errorMessages.push("Invalid Date. The date must be in 'YYYY-MM-DD' format");
    } 

    let isValidCategory = ['Home', 'Futile', 'Groceries', 'Uncommon', 'Vehicle'].includes(data.category);
    if(!isValidCategory) {
        errorMessages.push("Invalid Category. The category must be one of ['Home', 'Futile', 'Groceries', 'Uncommon', 'Vehicle']");
    } 

    let isValidReason = data.reason && data.reason.length > 0 ;
    if(!isValidReason) {
        errorMessages.push("Invalid Reason. It must be a valid string");
    } 

    let isValidCost = data.cost && (Math.round((data.cost + Number.EPSILON) * 100) / 100)  > 0;
    if(!isValidCost) {
        errorMessages.push("Invalid Cost. It must be a positive number");
    } 

    return errorMessages;
 
}

async function createItem(insertItem) {

    try {
        let existingData = await queryItems(insertItem.user_id, insertItem.date);
        console.log("querying existing expense Items", existingData);
        if (existingData?.Items && existingData?.Items.length == 1) {
            console.log("Existing expense list", existingData.Items[0].expenses);
            insertItem.expenses = existingData.Items[0].expenses.concat(insertItem.expenses);
        }
    } catch (err) {
        console.log("Error while fetching existing expense list", err);
    }

    console.log("New expense List...", insertItem);
    var params = {
        TableName: 'expense-tracker',
        Item: insertItem
    };
    try {
        const data = await docClient.put(params).promise();
        return data;
    } catch (err) {
        return err;
    }
}


async function queryItems(userIdKey, dateKey) {
    var params = {
        TableName: 'expense-tracker',
        KeyConditionExpression: '#userId_alias = :value1 and #date_alias = :value2',
        ExpressionAttributeValues: { ':value1': userIdKey, ':value2': dateKey },
        ExpressionAttributeNames: { '#userId_alias': 'user_id', '#date_alias': 'date' },
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
// Response Object
//----------------------------------------------------------------------------------------------------------------
class FinalResponse {

    constructor(responseType, errorMessages, data) {
        this.responseType = responseType;
        this.errorMessages = errorMessages;
        this.data = data;
    }

}










