const commonUtils = {
    encodeParamsAsQuery: function(params) {
        let query_params = "";
        for (let key in params) {
            const value = params[key];

            if (value !== undefined) {
                if (query_params.length > 0) {
                    query_params += '&';
                }

                try {
                    query_params += `${key}=${encodeURIComponent(value)}`;
                } catch (e) {
                    // Ignore param if somehow is not valid and cannot be encoded
                }
            }
        }

        return query_params;
    },
    encodeParams: function(params) {
        if (params !== undefined) {
            for (let paramKey in params) {
                const value = params[paramKey];

                if (value !== undefined) {
                    try {
                        params[paramKey] = encodeURIComponent(value);
                    } catch (e) {
                        // If somehow param is not valid and cannot be encoded, we remove it
                        delete params[paramKey];
                    }
                }
            }
        }

        return params;
    },
    asyncMiddlewareWrapper: function(middleware) {
        return function (req, res, next) {
            middleware(req, res, next)
                .catch(next);
        }
    }
};

module.exports = commonUtils;