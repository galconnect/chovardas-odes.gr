//// ConnectLineB2BConnector.S1Lib
/// -----------------------------------------------
/// LAST UPDATE -> 2023-10-26 18:12 - galex
/// -----------------------------------------------
lib.include("ConnectLineConnector.Params");
lib.include("ConnectLineConnector.common");
lib.include("ConnectLineConnector.getMasterData");
lib.include("ConnectLineConnector.getDocs");
lib.include("ConnectLineConnector.setDocs");

function ApiServices(obj) {
    requestObj = convertKeysToLowerCase(obj);

    if (!checkRequest(requestObj)) {
        return responseError("Authentication failed!");
    }

    try {
        requestObj.upddate = null;

        var responseObj = null;
        // ------- getMasterData -----------
        if (requestObj.service == 'getSalesman')
            responseObj = getSalesman(requestObj)
        else if (requestObj.service == 'getItems')
            responseObj = getItems(requestObj)
        // ------- setDocs -------------------
        else if (requestObj.service == 'setItem')
            responseObj = setItem(requestObj)
        else
            responseObj = responseError("Undefined job!");

        return responseObj;
    }
    catch (ex) {
        return responseError("Failed to process service!");
    }
}