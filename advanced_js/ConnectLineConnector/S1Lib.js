//// ConnectLineB2BConnector.S1Lib
lib.include("ConnectLineConnector.common");
lib.include("ConnectLineConnector.getMasterData");

function ApiServices(obj) {
    requestObj = convertKeysToLowerCase(obj);

    if (!checkRequest(requestObj)) {
        return responseError("Authentication failed!");
    }

    try {
        requestObj.upddate = null;

        var responseObj = null;
        if (requestObj.service == 'getSalesman')
            responseObj = getSalesman(requestObj)
        else
            responseObj = responseError("Undefined job!");

        return responseObj;
    }
    catch (ex) {
        return responseError("Failed to process service!");
    }
}