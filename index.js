const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/video", function(req, res){
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Last request missing range header")
    }

    const videoPath = "bigbuck.mp4"
    const videoSize = fs.statSync("bigbuck.mp4").size;
    
    //Parsing range here

    const CHUNK_SIZE = 10 ** 6; // 1MB chunk
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start+CHUNK_SIZE, videoSize-1);

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, {start, end});
    videoStream.pipe(res);
});

app.listen(8000, function(){
    console.log("Listening on port 8000...");
});
