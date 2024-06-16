const axios = require('axios');

exports.graphQLQuery = (query, variables) =>
    axios({
        url: 'https://atchxmyconashcnvndusei4inu.appsync-api.us-east-1.amazonaws.com/graphql',
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            "x-api-key": 'da2-la2gwbqqc5bvbh7s5w4fntghyu',
        },
        data: {
            query, variables
        },
    });