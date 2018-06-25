const createError = require('http-errors');
const Express = require('express');
const Logger = require('morgan');
const CryptoJS = require('crypto-js');
const CommonUtils = require('./common-utils');
const RequestUtils = require('./request-utils');
const TimeInMilli = require('./time-in-milli');
const DeveloperKeys = require('./developer-keys');

const app = Express();

app.use(Logger('dev'));
app.use(Express.json());

app.post("/addOrder", CommonUtils.asyncMiddlewareWrapper(async function (req, res, next) {
    const bodyParams = req.body;

    const createCustomerData = signRequest({
        company_id: DeveloperKeys.COMPANY_ID,
        name: bodyParams.name,
        phone: bodyParams.cellNumber,
        address: bodyParams.address,
    });

    const bringResponse = await RequestUtils.postJsonAsync("https://developer-api.bringg.com/partner_api/customers", createCustomerData);

    const responseBody = ensureOkResponse(bringResponse);

    const customer = responseBody.customer;

    if (customer) {
        const customerId = customer.id;

        const createTaskData = signRequest({
            customer_id: customerId,
            company_id: DeveloperKeys.COMPANY_ID,
            title: bodyParams.orderTitle,
            address: bodyParams.orderAddress,
        });

        const createTaskResponse = await RequestUtils.postJsonAsync("https://developer-api.bringg.com/partner_api/tasks", createTaskData);

        const responseBody = ensureOkResponse(createTaskResponse);

        const task = responseBody.task;

        if (task) {
            res.json({
                customer: customer,
                task: task,
            });
        } else {
            return next(new Error(`Failed Creating Task for customer id = ${customerId}`));
        }
    } else {
        return next(new Error("Failed Creating Customer"));
    }

}));

app.get("/orders/:cellNumber", CommonUtils.asyncMiddlewareWrapper(async function(req, res, next) {
    const cellNumber = req.params.cellNumber;
    const customerOrders = [];

    const lastWeek = Date.now() - TimeInMilli.Week;
    let currentPage = 1;
    let shouldFetchNextPage = true;

    while (shouldFetchNextPage) {
        const getTasksRequest = signRequest({
            company_id: DeveloperKeys.COMPANY_ID,
            page: currentPage
        });

        const bringResponse = await RequestUtils.getAsync("https://developer-api.bringg.com/partner_api/tasks", {
            json: true,
            body: getTasksRequest,
        });

        const orders = bringResponse.body;

        if (orders.length > 0) {
            ++currentPage;

            for (let order of orders) {
                const createdAt = order.created_at;
                const customerPhone = order.customer.phone;

                // As agreed with Alex, i am assuming that the orders list are sorted by the create_at descending,
                // so instead of continue fetching more pages, i stop here when i reach a time that is older then the past week.
                if (new Date(createdAt) < lastWeek) {
                    shouldFetchNextPage = false;
                    break;
                } else {
                    if (customerPhone === cellNumber) {
                        customerOrders.push(order);
                    }
                }
            }
        } else {
            shouldFetchNextPage = false;
        }
    }

    // As agreed with Alex, i only return here the customer orders in the past week and not "recreates" it as written in the assignment
    res.json(customerOrders);
}));

// 404 Handler (Page Not Found)
app.use(function (req, res, next) {
    next(createError(404));
});

// Basic Error handler
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send("error occurred");
});

function signRequest(params) {
    if (params !== undefined) {
        params.access_token = DeveloperKeys.ACCESS_TOKEN;
        params.timestamp = Date.now();
    }

    const query_params = CommonUtils.encodeParamsAsQuery(params);
    params.signature = CryptoJS.HmacSHA1(query_params, DeveloperKeys.SECRET_KEY).toString();

    return params;
}

function ensureOkResponse(response) {
    const responseBody = response.body;
    const statusCode = response.statusCode;

    if (statusCode < 200 || statusCode > 300) {
        throw new Error(`Got bad status code from bringg ${statusCode}`);
    }

    if (!responseBody || !responseBody.success) {
        throw new Error(`success=false returned from bring`);
    }

    return responseBody;
}

module.exports = app;
