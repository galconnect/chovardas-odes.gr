//// ConnectLineConnector.getMasterData
/// -----------------------------------------------
/// LAST UPDATE -> 2023-11-03 15:18 - galex
/// -----------------------------------------------

lib.include("ConnectLineConnector.common");

function getSalesman(obj) {
    // Initialize response array
    var response = initializeResponse(true);

    dsSql = "SELECT A.PRSN,A.CODE,A.NAME,A.NAME2,A.ISACTIVE,A.TPRSN, A.EMAIL FROM PRSN A WHERE A.COMPANY=1001 AND A.SODTYPE=20 AND A.TPRSN=0 ORDER BY A.CODE,A.PRSN";

    dsData = X.GETSQLDATASET(dsSql, X.SYS.COMPANY);

    response.totalcount = dsData.RECORDCOUNT;

    dsData.FIRST;
    while (!dsData.EOF()) {
        salesman = {};
        salesman.ID = dsData.PRSN;
        salesman.CODE = dsData.CODE;
        salesman.NAME = dsData.NAME + " " + dsData.NAME2;
        salesman.EMAIL = dsData.EMAIL;
        salesman.ISACTIVE = dsData.ISACTIVE;
        response.data.push(salesman);
        dsData.NEXT;
    }

    return response;
}

function getItems(obj) {
    // debugger
    // return;
    // Initialize response array
    var response = initializeResponse(true);

    // Query Filters
    dsSqlWhere = " where A.COMPANY = " + X.SYS.COMPANY + " AND A.SODTYPE = 51 "; //  AND A.ISACTIVE = 1 ";
    if (fieldHasValue(obj.code))
        dsSqlWhere += "and A.CODE = '" + obj.code + "' ";
    if (fieldHasValue(obj.itemid))
        dsSqlWhere += "and A.MTRL = " + obj.itemid + " ";
    if (fieldHasValue(obj.udate)) {
        // dsSqlWhere += "and A.UPDDATE >= '" + obj.upddate + "' ";
        dsSqlWhere += "and A.UPDDATE >= DATEADD(hour,-2," + formatDateTime(obj.udate) + ") ";
    }
    // Query Order
    dsSqlOrder = " order by A.CODE, A.MTRL ";

    /*Main Query of master table*/
    dsSql = "SELECT A.MTRL AS ITEMID, A.CODE AS SKU, U.NAME AS UNIT, A.VAT AS VATID, V.NAME AS VAT, A.UPDDATE AS UPDDATE, " +
        " A.NAME AS NAME, " +
        " B01.UTBL01 AS CATEGORY01CODE, B01.NAME AS CATEGORY01NAME, B02.UTBL02 AS CATEGORY02CODE, B02.NAME AS CATEGORY02NAME,  " +
        " ISNULL(A.CODE1,0) AS BARCODE, A.ISACTIVE, C.VARCHAR03 AS  FCODE, A.CODE2 AS MPN, " +
        " ISNULL(A.PRICEW, 0) AS PRICE, ISNULL(A.PRICER, 0) AS LIANIKI, ISNULL(A.SODISCOUNT, 0) AS EKPTOSILIANIKIS,  ISNULL(A.GWEIGHT, 0) AS WEIGHT, A.MTRMANFCTR AS BRANDID, " +
        " convert(varchar, getdate(), 20) AS SQLDATE " +
        " , M.NAME AS BRAND " +
        " ,ISNULL((SELECT (-1) * ISNULL((SELECT SUM(ISNULL(Z1.QTY1,0)-ISNULL(Z1.QTY1COV,0)-ISNULL(Z1.QTY1CANC,0))  " +
        " FROM MTRLINES Z1, RESTMODE Z2  WHERE Z1.MTRL = A.MTRL   " +
        " AND Z1.PENDING   = 1 AND Z1.WHOUSE IN (" + whouses + ")  " +
        " AND Z2.COMPANY   =  " + X.SYS.COMPANY + " AND Z1.RESTMODE  = Z2.RESTMODE AND Z2.RESTCATEG = 2),0)),0) +" +
        " ISNULL((SELECT SUM(A1.IMPQTY1-A1.EXPQTY1) " +
        "          FROM   MTRBALSHEET A1 " +
        "          WHERE  A1.COMPANY= " + X.SYS.COMPANY + " AND A1.MTRL=A.MTRL AND A1.FISCPRD=YEAR(getdate()) AND A1.PERIOD <MONTH(GETDATE()) AND A1.WHOUSE IN (" + whouses + ") ),0) " +
        " +ISNULL((SELECT SUM(A2.QTY1*(B2.FLG01-B2.FLG04)) " +
        "          FROM   MTRTRN A2,TPRMS B2 " +
        "          WHERE  A2.COMPANY= " + X.SYS.COMPANY + " " +
        "          AND    A2.SODTYPE = 51 AND    A2.MTRL =A.MTRL  AND    A2.TRNDATE >=DATEADD(month, DATEDIFF(month, 0, getdate()), 0) AND    A2.TRNDATE <=GETDATE() AND A2.WHOUSE IN (" + whouses + ") " +
        "          AND    A2.COMPANY = B2.COMPANY  AND    A2.SODTYPE = B2.SODTYPE AND    A2.TPRMS = B2.TPRMS),0) AS STOCK  " +

        // " ISNULL((select SUM((L3.QTY1-L3.qty1cov-L3.qty1canc)*(B3.FLG04)) " +
        // " from mtrtrn A3, TPRMS B3, findoc F3, mtrlines L3 " +
        // " where A3.tprms=B3.tprms  " +
        // " and A3.sodtype=B3.sodtype and A3.sodtype=51 and A3.company=B3.company and F3.findoc=A3.findoc and F3.sosource=1351 and F3.series in (7101,7285,7786,7401) " +
        // " and A3.mtrl=a.mtrl and F3.fullytransf in (0,2) and F3.iscancel=0  and F3.shipkind in (1105,1114,1138,1000,1143) and L3.findoc=F3.findoc and L3.mtrl=A3.mtrl " +
        // " and L3.pending=1 and L3.findoc=A3.findoc and A3.mtrtrn=L3.mtrlines and A3.linenum=1 and A3.mtrtrn=L3.mtrlines and A3.linenum=1),0) AS PARAKATATHIKI " +

        " FROM MTRL A    " +
        " INNER JOIN MTREXTRA C ON C.MTRL = A.MTRL AND C.SODTYPE = A.SODTYPE AND C.COMPANY = A.COMPANY " +
        " LEFT JOIN MTRMANFCTR M ON M.MTRMANFCTR = A.MTRMANFCTR AND M.COMPANY = A.COMPANY " +
        " LEFT JOIN VAT V ON V.VAT = A.VAT " +
        " LEFT JOIN UTBL01 B01 ON B01.UTBL01 = C.UTBL01 " +
        " LEFT JOIN UTBL02 B02 ON B02.UTBL02 = C.UTBL02 " +
        " LEFT JOIN MTRUNIT U ON U.MTRUNIT = A.MTRUNIT1 AND U.COMPANY = A.COMPANY " +
        dsSqlWhere;
    //" and a.mtrl in (select distinct A.mtrl from mtrl A " + dsSqlWhere + " and A.CCCPARENTCODE <> '') " ;

    dsSql = dsSql + dsSqlOrder;//+ " offset 3272 rows "
    // return dsSql;
    dsData = X.GETSQLDATASET(dsSql, X.SYS.COMPANY, X.SYS.COMPANY, X.SYS.COMPANY);

    response.totalcount = dsData.RECORDCOUNT;
    currentPCode = '';
    dsData.FIRST;
    while (!dsData.EOF()) {

        response.data.push({
            "ITEMID": dsData.ITEMID,
            "CODE": dsData.SKU,
            "NAME": dsData.NAME,
            "MPN": dsData.MPN,
            // "FCODE": dsData.FCODE,
            // "BARCODE": dsData.BARCODE,
            // "PRICE": dsData.PRICE,
            "PRICER": dsData.LIANIKI,
            // "DISCOUNT": dsData.EKPTOSILIANIKIS,
            // "VATID": dsData.VATID,
            // "VAT": dsData.VAT,
            // "UNIT": dsData.UNIT,
            // "STOCK": dsData.STOCK,
            // "PARAKATATHIKI": dsData.PARAKATATHIKI,
            // "WEIGHT": dsData.WEIGHT,
            // "DIMENSION01": dsData.DIMENSION01,
            // "DIMENSION02": dsData.DIMENSION02,
            // "DIMENSION03": dsData.DIMENSION03,
            // "BRANDID": dsData.BRANDID,
            // "BRAND": dsData.BRAND,
            // "SQLDATE": dsData.SQLDATE,
            // "SQLDATE": dsData.UPDDATE,
            // "VISIBILITY": dsData.VISIBILITY,

            "eshopcategoryid01": dsData.CATEGORY01CODE,
            "eshopcategoryname01": dsData.CATEGORY01NAME,
            "eshopcategoryid02": dsData.CATEGORY02CODE,
            "eshopcategoryname02": dsData.CATEGORY02NAME,
            "ISACTIVE": dsData.ISACTIVE,
            // "CATEGORIES": [],
            // "VARIATIONS": [],
            // "ATTRIBUTES": []
        });
        dsData.NEXT;
    }

    // /*Categories*/
    // dsCategoriesSql = "SELECT c.mtrl as ITEMID, cat1.CCCCLWEBCATEGORIES as IDC1,  cat1.SODTYPE as TYPE1,  cat1.CODE  AS  CODEC1, cat1.NAME  AS  NAMEC1, " +
    //     "cat2.CCCCLWEBCATEGORIES as IDC2,  cat2.SODTYPE as TYPE2, cat2.CODE  AS  CODEC2, cat2.NAME  AS  NAMEC2, " +
    //     "cat3.CCCCLWEBCATEGORIES as IDC3,  cat3.SODTYPE as TYPE3, cat3.code  AS  CODEC3, cat3.NAME  AS  NAMEC3, " +
    //     "cat4.CCCCLWEBCATEGORIES as IDC4,  cat4.SODTYPE as TYPE4, cat4.CODE  AS  CODEC4, cat4.NAME  AS  NAMEC4, " +
    //     "cat5.CCCCLWEBCATEGORIES as IDC5,  cat5.SODTYPE as TYPE5, cat5.code  AS  CODEC5, cat5.NAME  AS  NAMEC5  " +
    //     " FROM CCCCLITEMCATEGORIES  c" +
    //     " left join  CCCCLWEBCATEGORIES cat1 on cat1.CCCCLWEBCATEGORIES = c.CCCCLCATEG1 AND cat1.sodtype=1  and cat1.COMPANY =  " + X.SYS.COMPANY +
    //     " left join  CCCCLWEBCATEGORIES cat2 on cat2.CCCCLWEBCATEGORIES = c.CCCCLCATEG2 AND cat2.sodtype=2  and cat2.COMPANY = " + X.SYS.COMPANY +
    //     " left join  CCCCLWEBCATEGORIES cat3 on cat3.CCCCLWEBCATEGORIES = c.CCCCLCATEG3 AND cat3.sodtype=3  and cat3.COMPANY =" + X.SYS.COMPANY +
    //     " left join  CCCCLWEBCATEGORIES cat4 on cat4.CCCCLWEBCATEGORIES = c.CCCCLCATEG2 AND cat4.sodtype=4  and cat4.COMPANY =" + X.SYS.COMPANY +
    //     " left join  CCCCLWEBCATEGORIES cat5 on cat5.CCCCLWEBCATEGORIES = c.CCCCLCATEG2 AND cat5.sodtype=5  and cat5.COMPANY = " + X.SYS.COMPANY;


    // dsCategoriesSql = dsCategoriesSql;
    // // return dsCategoriesSql;
    // dsCategories = X.GETSQLDATASET(dsCategoriesSql, X.SYS.COMPANY);

    // dsCategories.FIRST;
    // cat = [];
    // while (!dsCategories.EOF()) {
    //     vDataIndex = response.data.map(function (o) { return o.ITEMID; }).indexOf(dsCategories.ITEMID);
    //     if (vDataIndex == -1) {
    //         dsCategories.NEXT;
    //         continue;
    //     }

    //     if (dsCategories.IDC5 != "") {
    //         category_id = dsCategories.TYPE5 + "" + dsCategories.IDC5;
    //         category_name = dsCategories.NAMEC5;
    //     } else if (dsCategories.IDC4 != "") {
    //         category_id = dsCategories.TYPE4 + "" + dsCategories.IDC4;
    //         category_name = dsCategories.NAMEC4;
    //     } else if (dsCategories.IDC3 != "") {
    //         category_id = dsCategories.TYPE3 + "" + dsCategories.IDC3;
    //         category_name = dsCategories.NAMEC3;
    //     } else if (dsCategories.IDC2 != "") {
    //         category_id = dsCategories.TYPE2 + "" + dsCategories.IDC2;
    //         category_name = dsCategories.NAMEC2;
    //     } else if (dsCategories.IDC1 != "") {
    //         category_id = dsCategories.TYPE1 + "" + dsCategories.IDC1;
    //         category_name = dsCategories.NAMEC1;
    //     }

    //     // str_categories = "id , "; // `{ "CATEGORY_ID": ${category_id} },`;
    //     // cat.push({ "CATEGORY_ID": category_id });
    //     if (category_id) response.data[vDataIndex].CATEGORIES.push({
    //         "CATEGORY_ID": category_id,
    //         "CATEGORY_NAME": category_name
    //     });
    //     dsCategories.NEXT;
    // }



    /*Variations*
    dsVariationsSql = "select a.mtrl, a.code, a.name, a.pricew, a.pricew06, " +
        " a.ccccleshopshow as VISIBILITY  " +
        " from mtrl  a " +
        " where a.code is not null AND A.COMPANY = " + X.SYS.COMPANY + " AND A.SODTYPE = 51 AND A.ISACTIVE = 1 AND CCCCLESHOPSYNC = 1 " +
        " order by a.code asc";


    //dsVariationsSql = dsVariationsSql + dsSqlWhere + dsVariationsWhere + dsSqlOrder;

    dsVariations = X.GETSQLDATASET(dsVariationsSql, X.SYS.COMPANY);
    //
    dsVariations.FIRST;
    while (!dsVariations.EOF()) {
        vDataIndex = response.data.map(function (o) { return o.SKU; }).indexOf(dsVariations.CCCPARENTCODE);

        if (vDataIndex == -1) {
            dsVariations.NEXT;
            continue;
        }

        response.data[vDataIndex].VARIATION1 = 1000;
        response.data[vDataIndex].VARIATIONNAME1 = 'VARIATION';

        //if(dsVariations.CCCPARENTCODE == 'v-ualo')
        //	pname = dsVariations.PNAME.replace(",", ".");
        //else
        //	pname = dsVariations.PNAME;
        response.data[vDataIndex].VARIATIONS.push({
            "BARCODE": dsVariations.code,
            // "PHOTO": dsVariations.cccclimgcode,
            "VARIATIONOPTIONS": [{
                //"VALUE1": dsVariations.VARIATIONID1 > 0 ? dsVariations.VARIATIONID1 +'-'+ dsVariations.VARIATIONIDVALUE1 : "",
                //"VALUE2": dsVariations.VARIATIONID2 > 0 ? dsVariations.VARIATIONID2 +'-'+ dsVariations.VARIATIONIDVALUE2 : "",
                //"VALUE3": dsVariations.VARIATIONID3 > 0 ? dsVariations.VARIATIONID3 +'-'+ dsVariations.VARIATIONIDVALUE3 : "",
                "VALUE1": dsVariations.PNAME.replace(/,/g, '.'),
                //"VALUE1": dsVariations.VARIATIONID1 > 0 ? dsVariations.VARIATIONIDVALUE1 : "",
                //"VALUE2": dsVariations.VARIATIONID2 > 0 ? dsVariations.VARIATIONIDVALUE2 : "",
                //"VALUE3": dsVariations.VARIATIONID3 > 0 ? dsVariations.VARIATIONIDVALUE3 : "",
            }],
            "PRICE": dsVariations.pricew,
            "SALESPRICE": dsVariations.pricew06,
            "STOCK": 100,
            "VISIBILITY": dsVariations.VISIBILITY
            //"ISACTIVE": dsVariations.ISACTIVE,
        });

        dsVariations.NEXT;
    }
    */

    // ///*Attributes*/
    // dsAttributesSql = "select m.mtrl as ITEMID, m.CCCCLCHARTYPE as type_id, t.name as type_name,m.CCCCLCHARVALS as value_id,v.name as value_name,m.CCCCLCHARVALT as value_free_name " +
    //     " from CCCCLITEMCHARCTYPE m " +
    //     " left join CCCCLCHARTYPE t on m.CCCCLCHARTYPE = t.CCCCLCHARTYPE " +
    //     " left join CCCCLVCHARLIST v on m.CCCCLCHARVALS = v.CCCCLVCHARLIST AND t.CCCCLCHARTYPE = v.CCCCLCHARTYPE ";

    // dsAttributesSql = dsAttributesSql;
    // // return dsAttributesSql;
    // dsAttributes = X.GETSQLDATASET(dsAttributesSql, X.SYS.COMPANY);

    // dsAttributes.FIRST;
    // while (!dsAttributes.EOF()) {
    //     vDataIndex = response.data.map(function (o) { return o.ITEMID; }).indexOf(dsAttributes.ITEMID);

    //     if (vDataIndex == -1) {
    //         dsAttributes.NEXT;
    //         continue;
    //     }

    //     var attrValue;
    //     if (!dsAttributes.value_name || dsAttributes.value_name == '') { attrValue = dsAttributes.value_free_name } else { attrValue = dsAttributes.value_name }
    //     response.data[vDataIndex].ATTRIBUTES.push({
    //         "ATTRIBUTEID": dsAttributes.type_id,
    //         "ATTRIBUTENAME": dsAttributes.type_name,
    //         "ATTRIBUTENAMEVALUE": attrValue
    //         // "ATTRIBUTENAMEVALUE": dsAttributes.value_name
    //     });

    //     dsAttributes.NEXT;
    // }

    return response;
}


