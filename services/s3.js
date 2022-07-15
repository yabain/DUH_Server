/**
 * S3 actions over our dev/prod bucket
 * @author dassiorleando
 */
 const AWS = require("aws-sdk");
 const config = require("../config");
 
 // Setting up the AWS credentials into the SDK
 AWS.config.update({
   region: "us-east-2",
   accessKeyId: config.AWS_ACCESS_KEY,
   secretAccessKey: config.AWS_SECRET_KEY,
 });
 
 const S3 = new AWS.S3();
 
 // Bucket to use for all media
 const bucket =
   config.ENV === "prod" ? "douhave-upload-prod" : "douhave-upload-dev";
 
 /**
  * Generating presigned URL for uploads
  * @param {string} fileName The file's name
  * @param {string} fileType The file's mime type
  * @param {boolean} space  Uploading for itempics (item images) or other spaces/purposes
  * @see [Create Presigned URL](https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/s3-example-presigned-urls.html)
  * @returns {Promise<string>} Promise that resolves to the presigned url
  */
 exports.getPreSignedURL = function (fileName, fileType, space = "itempics") {
   return new Promise((resolve, reject) => {
     // Getting presigned URL
     const signedUrlExpireSeconds = 1 * 60 * 60; // 1 hour (60 minutes)
     const params = {
       Bucket: bucket,
       Key: `${space}/${fileName}`,
       Expires: signedUrlExpireSeconds,
       ACL: "public-read", // Make this object public
       ContentType: fileType,
       // Conditions: [["content-length-range", 100, 10000000]], // 100Byte - 10MB
     };
 
     const url = S3.getSignedUrl("putObject", params);
     return resolve(url);
   });
 };
 
 /**
  * Gets a folder files
  * @param {string} folderName The folder name/key (eg: itempics)
  * @param {Object} nextListParams The new list params/query if we're going deeply
  * @param {{Object}}[] data Final array of objects to send back
  * @returns {Promise<string>} Promise that resolves to the list of files/folders present into the initial folder
  */
 async function getFolderFiles(
   folderName,
   nextListParams = undefined,
   data = []
 ) {
   // Specifying it's a folder
   const dir = folderName + "/";
 
   let listParams = nextListParams || {
     Bucket: bucket,
     Prefix: dir,
   };
 
   if (!nextListParams && !folderName) delete listParams.Prefix;
 
   var result = await S3.listObjectsV2(listParams).promise();
 
   // Format the current contents
   var contents = result.Contents;
   contents.forEach((object) => {
     data.push({
       key: object.Key,
       lastModified: object.LastModified,
       size: object.Size,
     });
   });
 
   if (!result.IsTruncated) {
     return Promise.resolve(data);
   }
   listParams.Marker = contents[contents.length - 1].Key;
   return getFolderFiles(null, listParams, data);
 }
 exports.getFolderFiles = getFolderFiles;
 
 /**
  * Creates a folder
  * @param {string} folderName The folder's name/key to create
  * @returns {Promise<string>} Promise that resolves to the created folder
  */
 exports.createFolder = function (folderName) {
   let params = {
     Bucket: bucket,
     Key: folderName + "/",
     ContentLength: 0,
     ACL: "public-read", // Make this object public
   };
 
   return S3.putObject(params).promise();
 };
 
 /**
  * Deleting a folder from S3, we first emptying it
  * @param {string} folderName The folder name/key
  * @returns {Promise<string>} Promise that resolves to the deleted folder
  */
 exports.deleteFolder = async function (folderName) {
   // Specifying it's a folder
   folderName = folderName + "/";
 
   // Cleaning the folder content
   await emptyS3Directory(folderName);
 
   // Deleting the folder
   const deleteParam = {
     Bucket: bucket,
     Key: folderName,
   };
   return S3.deleteObject(deleteParam).promise();
 };
 
 /**
  * Removing anything into a folder
  * @param {string} dir The directory/folder to erase
  * @returns {boolean} true of false
  */
 async function emptyS3Directory(dir) {
   const listParams = {
     Bucket: bucket,
     Prefix: dir,
   };
 
   const listedObjects = await S3.listObjectsV2(listParams).promise();
 
   if (listedObjects.Contents.length === 0) return Promise.resolve(true);
 
   const deleteParams = {
     Bucket: bucket,
     Delete: { Objects: [] },
   };
 
   listedObjects.Contents.forEach(({ Key }) => {
     deleteParams.Delete.Objects.push({ Key });
   });
 
   await S3.deleteObjects(deleteParams).promise();
   if (listedObjects.IsTruncated) return await emptyS3Directory(dir);
 
   return Promise.resolve(true);
 }
 