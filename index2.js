const express = require("express");
const app = express();
const aws = require('aws-sdk');


app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(8001, function(){
    console.log("Listening on port 8001...");
});

app.get("/s3-video", function(req, res){
    try{
        const range = req.headers.range;
        const start_time = req.headers['start-time'];

        if (!range) {
           res.status(400).send("Requires Range header");
        }

        // let perc = 100;
        // os.cpuUsage(function(v){
        //     console.log('CPU Usage (%): ' + v);
        // }.bind({v:perc}));

        aws.config.update({
            accessKeyId: "AKIA4HPG4QKMEOWBKUED",
            secretAccessKey: "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",
            region: "us-east-1"
        });

        const s3 = new aws.S3()

        // const videoSize = s3.getObjectAttributes({ Key: "bigbuck.mp4", Bucket: "c3learnet-videos" })

        const videoSize = 63614462

        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const options = {
            Key: "bigbuck.mp4",
            Bucket: "c3learnet-videos",
            Range: `bytes=${start}-${end}`
        }; 

        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };

        if(start_time){
            headers["Response-Time"] = Date.now() - Number(start_time);
        }

        res.writeHead(206, headers);

        const videoStream = s3.getObject(options).createReadStream();
        videoStream.pipe(res);

    } catch(err) {
        console.log('error:', err)
    }
});
