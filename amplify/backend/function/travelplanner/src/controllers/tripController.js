const asyncHandler = require('express-async-handler');
const {graphQLQuery} = require('../helpers/graphQLQuery');

const executeQuery = async (query, dataObject, variables, req, res) => {
    const response = await graphQLQuery(
        query, variables,
        );

    if (response.data.errors) {
        console.log(response.data.errors);

        return res.json({
            errors: response.data.errors
        })
    }
    console.log(response.data.data)
    res.json({
        data: response.data.data[dataObject],
        body: req.body
    });
}

exports.trip_detail = asyncHandler(async (req, res, next) => {
    await executeQuery(
        `query GetUserTrip($id: ID!) {
                    getUserTrip(id: $id) {
                        date
                        description
                        id
                        image
                        location
                        name
                    }   
        }`,
        "getUserTrip",
        {id: req.params.id},
        req, res);
});

// Handle trip create on POST.
exports.trip_create = asyncHandler(async (req, res, next   ) => {
    console.log(req.body);
    res.json({
        body: req.body
    });
});

exports.trip_list = asyncHandler(async (req, res,next) => {
    await executeQuery(
        `query MyQuery($location: String){
                 listUserTrips(filter: {location: {contains: $location}}) {
                   items {
                     id
                     date
                     description
                     image
                     location
                     name
                   }
                 }
        }          
    `, "listUserTrips", {location: req.query.location}, req, res)
})

exports.trip_update = asyncHandler(async (req, res) => {
    res.json({});
})

exports.trip_delete = asyncHandler(async (req, res) => {
    res.json({});
})
