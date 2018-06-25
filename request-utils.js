/** @memberof global */
const Request = require('request');

(function () {
    Request.getAsync = async function (url, options) {
        return new Promise(function (resolve, reject) {
            Request.get(url, options, function (error, response, body) {
                if (!error) {
                    resolve(response)
                }
                else {
                    reject(error)
                }
            })
        });
    };

    Request.postAsync = async function (url, options) {
        return new Promise(function (resolve, reject) {
            Request.post(url, options, function (error, response, body) {
                if (!error) {
                    resolve(response);
                } else {
                    reject(error)
                }
            })
        });
    };

    Request.postJsonAsync = async function (url, json) {
        return Request.postAsync(url, {
            body: json,
            json: true,
        })
    };

    Request.getJsonAsync = async function (url, options) {
        const response = await Request.getAsync(url, options);
        response.body = JSON.parse(response.body);
        return response;
    };
})();

module.exports = Request;

