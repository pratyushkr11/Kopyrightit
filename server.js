require('dotenv').config();
const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const { s3Uploadv3 } = require('./s3Service');
const PORT = process.env.PORT || 3500;

//Connect to mongoDB
connectDB();

// custom middleware logger
app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:  
// ‘content-type: application/x-www-form-urlencoded’
app.use(bodyParser.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));

// app.use('/subdir', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/literaryData', require('./routes/literaryData'));
app.use('/artisticData', require('./routes/artisticData'));
app.use('/musicalData', require('./routes/musicalData'));
app.use('/soundrecording', require('./routes/soundData'));
app.use('/computerData', require('./routes/computerData'));
app.use('/videographyData', require('./routes/videographyData'));

const fileStorage = multer.memoryStorage()

const docFileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === 'image' || file.mimetype.split("/")[0] === 'application') {
        cb(null, true);
    }
    else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
}

const docUpload = multer({ fileStorage, docFileFilter });

app.post('/docupload', docUpload.single("file"), async (req, res) => {
    const file = req.file;
    const result = await s3Uploadv3(file);
    console.log(file);
    res.json({ status: "success", result });
});

const signStorage = multer.memoryStorage()

const signFileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === 'image') {
        cb(null, true);
    }
    else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
}

const signUpload = multer({ signStorage, signFileFilter });

app.post('/signupload', signUpload.single("file"), async (req, res) => {
    const file = req.file;
    const result = await s3Uploadv3(file);
    console.log(file);
    res.json({ status: "success", result });
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File size exceeds limit"
            });
        }
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "File must be an image or pdf"
            })
        }
    }
})

app.use(verifyJWT);

// app.use('/employees', require('./routes/api/employees'));

/*app.use('/subdir', require('./routes/subdir'));


Route handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next()
}, (req, res) => {
    res.send('Hello World!');
});


// chaining route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

app.get('/chain(.html)?', [one, two, three]);*/

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});