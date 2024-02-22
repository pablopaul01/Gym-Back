const multer = require ("multer");
const path = require("path");
const fs = require('fs');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => { 
        const fileTypes = /mp3|MP3|mpeg/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
        console.log("mimeType: " + file.mimetype)
        console.log("extname: " + extname)
        if (mimeType && extname) {
            return cb(null, true)
        }
        cb("Error: el tipo de archivo no esta permitido -" + fileTypes)
     }
})
