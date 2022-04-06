const express = require("express");
const fs = require("fs");
const app = express();
const aws = require('aws-sdk');

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(8000, function(){
    console.log("Listening on port 8000...");
});

app.get("/s3-video", function(req, res){
    try{
        aws.config.update({
            accessKeyId: "AKIA4HPG4QKMEOWBKUED",
            secretAccessKey: "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",
            region: "us-east-1"
        });

        const s3 = new aws.S3()
        const options = {
            Key: "Smack.mp4",
            Bucket: "c3learnet-videos"
        };

        res.attachment("Smack.mp4")
        const videoStream = s3.getObject(options).createReadStream();
        videoStream.pipe(res);

    } catch(err) {
        console.log('aws error:', err)
    }
});


// app.get("/mongo-video", function(req, res){
//     mongodb.MongoClient.connect(url, function(error, client){
//         if(error){
//             res.status(500).json(error);
//             return;
//         }

//         const range = req.headers.range;
//         if(!range){
//             res.status(400).send("Missing required range header");
//         }

//         const db = client.db('videos');

//         // GridFS Collection
//         db.collection("fs.files").findOne({}, (err, video) => {
//             if(!video){
//                 res.status(404).send("No uploaded video...");
//                 return;
//             }

//             // Response headers
//             const videoSize = video.length;
//             const start = Number(range.replace(/\D/g, ""));
//             const end = videoSize - 1;

//             const headers = {
//                 "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//                 "Accept-Ranges": "bytes",
//                 "Content-Length": (end - start + 1),
//                 "Content-Type": "video/mp4",
//             };

//             res.writeHead(206, headers);
            
//             const bucket = new mongodb.GridFSBucket(db);
//             const downloadStream = bucket.openDownloadStreamByName('bigbuck', {start});

//             downloadStream.pipe(res);
//         });
//     });
// });

// app.get("/video", function(req, res){
//     const range = req.headers.range;
//     if(!range){
//         res.status(400).send("Last request missing range header")
//     }

//     const videoPath = "bigbuck.mp4"
//     const videoSize = fs.statSync("bigbuck.mp4").size;
    
//     //Parsing range here

//     const CHUNK_SIZE = 10 ** 6; // 1MB chunk
//     const start = Number(range.replace(/\D/g, ""));
//     const end = Math.min(start+CHUNK_SIZE, videoSize-1);

//     const headers = {
//         "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//         "Accept-Ranges": "bytes",
//         "Content-Length": end - start + 1,
//         "Content-Type": "video/mp4",
//     };

//     res.writeHead(206, headers);

//     const videoStream = fs.createReadStream(videoPath, {start, end});
//     videoStream.pipe(res);
// });
