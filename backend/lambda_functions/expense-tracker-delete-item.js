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
export const handler = async (event, context) => {
    console.log(event);
    let expenseData = JSON.parse(event.body); //event.body; 

    let errorMessages = expenseDataValidator(expenseData);
    if (errorMessages.length > 0) {
        const finalResponse = new FinalResponse('Error: Bad Request', errorMessages, undefined);
        return {
            statusCode: 400,
            body: JSON.stringify(finalResponse),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Max-Age': '86400'
            }
        };
    }

    let deleteItem = {
        "user_id": event?.requestContext?.authorizer?.claims?.sub, // "121434a-5d55-34-8c78-23332445",
        "date": expenseData.date,
        "expenses": [
            {
                "category": expenseData.category,
                "cost": expenseData.cost,
                "reason": expenseData.reason
            }
        ]
    };
    console.log(deleteItem);

    try {
        const data = await removeItem(deleteItem);

        const response = {
            "message": "Removed '" + expenseData.reason + "' from " + expenseData.date
        };

        const finalResponse = new FinalResponse('SUCCESS', undefined, response);
        return {
            statusCode: 200,
            body: JSON.stringify(finalResponse),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

    } catch (err) {
        console.error("Error in handler:", err);
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
};

//----------------------------------------------------------------------------------------------------------------
// Request Validations
//----------------------------------------------------------------------------------------------------------------
function expenseDataValidator(data) {
    let errorMessages = [];
    if (!data) {
        errorMessages.push("Invalid Data. Please correct your request body and try again.");
        return errorMessages;
    }

    let date = new Date(data.date);
    let isvalidDate = data.date && date.toString() !== 'Invalid Date';
    if (!isvalidDate) {
        errorMessages.push("Invalid Date. The date must be in 'YYYY-MM-DD' format");
    }

    let isValidCategory = ['Home', 'Futile', 'Groceries', 'Uncommon', 'Vehicle'].includes(data.category);
    if (!isValidCategory) {
        errorMessages.push("Invalid Category. The category must be one of ['Home', 'Futile', 'Groceries', 'Uncommon', 'Vehicle']");
    }

    let isValidReason = data.reason && data.reason.length > 0;
    if (!isValidReason) {
        errorMessages.push("Invalid Reason. It must be a valid string");
    }

    let isValidCost = data.cost && (Math.round((data.cost + Number.EPSILON) * 100) / 100) > 0;
    if (!isValidCost) {
        errorMessages.push("Invalid Cost. It must be a positive number");
    }

    return errorMessages;
}

async function removeItem(deleteItem) {
    try {
        let existingData = await queryItems(deleteItem.user_id, deleteItem.date);
        console.log("Querying existing expense Items", existingData);
        
        if (existingData?.Items && existingData?.Items.length === 1) {
            console.log("Existing expense list", existingData.Items[0].expenses);
            
            // Find and remove the matching expense item
            for (let i = 0; i < existingData.Items[0].expenses.length; i++) {
                let expenseItem = existingData.Items[0].expenses[i];
                if (expenseItem.reason === deleteItem.expenses[0].reason &&
                    expenseItem.cost === deleteItem.expenses[0].cost &&
                    expenseItem.category === deleteItem.expenses[0].category) {
                    console.log("Found the item to be deleted", expenseItem);
                    existingData.Items[0].expenses.splice(i, 1);
                    break;
                }
            }
            
            // Update deleteItem with the modified expenses array
            deleteItem.expenses = existingData.Items[0].expenses;
        }
    } catch (err) {
        console.error("Error while querying existing expense list", err);
        throw err;
    }

    console.log("Updated expense List...", deleteItem);
    
    const command = new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME || 'expense-tracker',
        Item: deleteItem
    });

    try {
        const data = await docClient.send(command);
        return data;
    } catch (err) {
        console.error("Error putting item:", err);
        throw err;
    }
}

async function queryItems(userIdKey, dateKey) {
    const command = new QueryCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME || 'expense-tracker',
        KeyConditionExpression: '#userId_alias = :value1 and #date_alias = :value2',
        ExpressionAttributeValues: { 
            ':value1': userIdKey, 
            ':value2': dateKey 
        },
        ExpressionAttributeNames: { 
            '#userId_alias': 'user_id', 
            '#date_alias': 'date' 
        },
        ProjectionExpression: '#date_alias, expenses'
    });

    try {
        const data = await docClient.send(command);
        return data;
    } catch (err) {
        console.error("Error querying items:", err);
        throw err;
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