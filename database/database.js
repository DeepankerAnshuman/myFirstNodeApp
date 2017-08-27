var MongoClient = require('mongodb').MongoClient;

exports.insertBulkData= function(isSave, data, callback){
    MongoClient.connect("mongodb://localhost:27017/archanaapp", function(err, db) {
    // Get the collection
    var collection= db.collection('doctors');
    try {
            if(isSave)
                {
                    collection.remove({}, function(err, count){
                        if(err) console.log(err);
                        collection.insertMany(data, {ordered: false}, function(err, result){
                            db.close();
                            callback(result);
                        });
                    });
                }
            else{
                collection.insertMany( data, { ordered: false }, function(err, result){
                    db.close();
                    callback(result);
                });
            }    
        } catch (e) {
        console.log(e)
    }
});
}

exports.fetchDropdownData= function(callback){
    var data = [];
    MongoClient.connect("mongodb://localhost:27017/archanaapp", function(err, db) {
    //Get the collection
    var collection = db.collection('doctors');
    try {
            collection.find().toArray(function(err, result) {
                if(err)
                    console.log(err);
                else
                    {
                        db.close();
                        data = result;
                        callback(data);
                    }
            });
        } catch (e) {
        console.log(e)
    }
});


}

