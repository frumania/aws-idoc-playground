var AWS = require("aws-sdk") 

exports.handler = (event, context, callback) => {
    
    try{
        
        //DEBUG
        if(!event.body){event.body = "<KUNNR>DEBUG</KUNNR>"};
        
        var bucket = "aws-idoc-debmas"; //<your bucket>
        var pattern = /<KUNNR>((.|\n)*?)<\/KUNNR>/;
        var mymatch = event.body.match( pattern );
        
        var id;
        if(mymatch && mymatch.length > 1)
        {
            id = mymatch[1]+".xml";
        }
        else
        {
            var err={};
            err.msg = "No KUNNR found! Abort!";
            throw err;
        }
        
        //DEBUG
        console.log(event.body);
        
        var params = {Bucket: bucket, Key: id, Body: event.body, ContentType:"text/xml"} 
        var options = {} 
        var s3 = new AWS.S3() 
        s3.upload(params, options, function(err, data) {
            if(err){
                console.log("Error uploading data to S3", err) 
                callback(returnResponse(400,JSON.stringify(err)));
            }else{
                console.log("Data successfully uploaded to S3", data)
                callback(null, returnResponse(200,JSON.stringify(data)));
            }
        }) 
        
    }catch(e){
        console.log("Lambda Execution Error", e) 
        callback(returnResponse(400,JSON.stringify(e)));
    }
}

function returnResponse(responseCode, responseBody){
    
    const response = {
        statusCode: responseCode,
        body: responseBody
    };
    
    //DEBUG
    console.log(responseBody);
    
    return response;
}