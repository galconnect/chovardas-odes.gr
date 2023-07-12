//// ConnectLineConnector.getMasterData
lib.include("ConnectLineConnector.common");

function getSalesman(obj) {
    // Initialize response array
    var response = initializeResponse(true);

    dsSql = "SELECT A.PRSN,A.CODE,A.NAME,A.NAME2,A.ISACTIVE,A.TPRSN FROM PRSN A WHERE A.COMPANY=1001 AND A.SODTYPE=20 AND A.TPRSN=0 ORDER BY A.CODE,A.PRSN";

    dsData = X.GETSQLDATASET(dsSql, X.SYS.COMPANY);

    response.totalcount = dsData.RECORDCOUNT;

    dsData.FIRST;
    while (!dsData.EOF()) {
        salesman = {};
        salesman.ID = dsData.PRSN;
        salesman.CODE = dsData.CODE;
        salesman.NAME = dsData.NAME + " " + dsData.NAME2;
        salesman.ISACTIVE = dsData.ISACTIVE;
        response.data.push(salesman);
        dsData.NEXT;
    }

    return response;
}

