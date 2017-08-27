var excelToJson = require("xlsx-to-json");
var db = require('../database/database.js');

exports.importDataFromExcel = function(month, callback){
    var data;
    try{
        excelToJson({
        input: "MS048276-6-2017 (1) (2).xlsx",
        output: null,
        sheet: "MS048276-6-2017 (1)",  // specific sheetname inside excel file (if you have multiple sheets)
        lowerCaseHeaders:true //to convert all excel headers to lowr case in json
        }, function(err, result) {
            if(err) {
                console.log(err);
            } 
            else {
                //result will contain the overted json data
                data = result;
                data.forEach(function(element) {
                    delete element.null;
                    element.month = month;
                }, this);
                db.insertBulkData(false, data,function(data){
                    callback(data);
                });            
            }
        });
    } catch(e){
        console.log(e);
    }
    return data;
}

exports.fetchDates = function(callback){
    db.fetchDropdownData(function(data){
        var i=1;
        data.forEach(function(item){
            item.Seq = i;
            i++;
        })
        callback(data);
    });
}

exports.saveData = function(data, callback){
    db.insertBulkData(true, data, function(result){
        callback(result);
    })
}