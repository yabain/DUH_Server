/**
 * Dynamo CRUD utilities
 * @author dassiorleando
 */
const AWS = require('aws-sdk');
const config = require('../config');

// Setting up the AWS credentials into the SDK
AWS.config.update({ region: 'us-east-2', accessKeyId: config.AWS_ACCESS_KEY, secretAccessKey: config.AWS_SECRET_KEY });
const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {

    /**
     * Fetching data by id
     * @param {*} ID 
     * @param {*} TableName 
     */
    async get (ID, TableName) {
        const params = {
            TableName,
            Key: {
                ID,
            },
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was an error fetching the data for ID of ${ID} from ${TableName}`);
        }

        return data.Item;
    },

    /**
     * Writing data
     * @param {*} data 
     * @param {*} TableName 
     */
    async write (data, TableName) {
        if (!data.ID) {
            throw Error('no ID on the data');
        }

        const params = {
            TableName,
            Item: data,
        };

        const res = await documentClient.put(params).promise();

        if (!res) {
            throw Error(`There was an error inserting ID of ${data.ID} in table ${TableName}`);
        }

        return data;
    },

    /**
     * Delete by id
     * @param {*} ID 
     * @param {*} TableName 
     */
    async delete (ID, TableName) {
        const params = {
            TableName,
            Key: {
                ID,
            },
        };

        return documentClient.delete(params).promise();
    },

    /**
     * Scaning the messages, getting the next page by using thelast evaluated key field
     * @param {*} TableName The table name
     * @param {*} roomId The room id
     * @param {*} lastEvaluatedKey The last evaluated key (optional)
     */
    async scanMessages (TableName, roomId, lastEvaluatedKey) {
        var params = {
            TableName : TableName,
            FilterExpression: "#roomId = :roomParam",
            ExpressionAttributeNames: {
                "#roomId": "roomId"
            },
            ExpressionAttributeValues: {
                ":roomParam": roomId
            }
        };

        if (lastEvaluatedKey) {
            params.ExclusiveStartKey = lastEvaluatedKey;
        }

        return documentClient.scan(params).promise();
    }

};
module.exports = Dynamo;
