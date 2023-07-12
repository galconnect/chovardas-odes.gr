//// ConnectLineConnector.common
function initializeResponse(hasDataList) {
    var response = {};
    response.success = true;
    response.error = "";
    if (hasDataList == true) {
        response.totalcount = 0;
        response.data = [];
    }
    else
        response.id = null;

    return response;
}

function checkRequest(obj) {
    try {
        //return (obj.CLIENTID && obj.CLIENTID != "" && obj.APPID && obj.APPID != "" && obj.APPID == "1001");
        return (obj.clientid && obj.clientid != "" && obj.appid && obj.appid != "");
    }
    catch (e) {
        return false;
    }
}

function checkRequestCommon(obj, appid) {
    try {
        //return (obj.CLIENTID && obj.CLIENTID != "" && obj.APPID && obj.APPID != "" && obj.APPID == "1001");
        return (obj.clientid && obj.clientid != "" && obj.appid && obj.appid != "" && obj.appid == appid);
    }
    catch (e) {
        return false;
    }
}

function responseError(message) {
    return responseError(message, null);
}

function responseError(message, hasDataList) {
    var resp = {};
    if (hasDataList != null)
        resp = initializeResponse(hasDataList);
    resp.success = false;
    if (message)
        resp.error = message;
    else
        resp.error = "Authenticate failed due to invalid credentials!";

    return resp;
}

function fieldHasValue(fieldValue) {
    return (fieldValue != null && fieldValue != undefined && fieldValue != "");
}

function convertKeysToLowerCase(obj) {
    var vjsonString = JSON.stringify(obj);
    vjsonString = vjsonString.replace(/"([^"]+)":/g, function ($0, $1) { return ('"' + $1.toLowerCase() + '":'); });

    return JSON.parse(vjsonString);
}