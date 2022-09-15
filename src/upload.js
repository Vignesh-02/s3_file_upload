const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async(event) => {
    console.log(event);
    
    // we are making a lambda proxy integration
    const response = {
        isBase64Encoded: false,
        status: 200,
        body: JSON.stringify({message: 'Successfully uploaded file to S3'})
};

    try{
        const parsedBody = JSON.parse(event.body);
        const base64 = parsedBody.file;
        const decodedFile = Buffer.from(base64.replace(/^data:image\/\w+;base64/,""),"base64");
        const params = {
            Bucket: BUCKET_NAME,
            Key: `images/${new Date().toISOString()}.jpeg`,
            Body: decodedFile,
            ContentType: "image/jpeg"
        };

        const uploadResult = await s3.upload(params).promise();

        response.body = JSON.stringify({message: 'Successfully uploaded file to S3', uploadResult})
    } catch(err){
        console.log(err);
        response.body = JSON.stringify({message: 'File faied to upload to S3', errorMessage: err})
        response.statusCode = 500;       
    }
        return response;
}