const express = require('express');
const app = express();
const dotEnv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// configure cors
app.use(cors());

// configure dotEnv
dotEnv.config({path : './.env'});

// configure for static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// configure express to receive form data
app.use(express.json());

const port = process.env.PORT || 5000;

// connect  to mongodb database
mongoose.connect(process.env.MONGO_DB_CLOUD_URL, {
    useCreateIndex : true,
    useFindAndModify : false,
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then((response) => {
    console.log('Connected to MongoDB Successful...........')
}).catch((error) => {
    console.error(error);
    process.exit(1); // stop the process if unable to connect to mongodb
});

// default path
// configure the static files path
if(process.env.NODE_ENV === "production"){
    //app.use(express.static('client/dist/client'));
    app.use(express.static(path.join(__dirname, 'client', 'dist' , 'client')));
    app.get('/', (request , response) => {
        response.sendFile(path.join(__dirname , 'client' , 'dist' , 'client' , 'index.html'));
    });
}

// router configuration
app.use('/user', require('./router/userRouter'));
app.use('/product', require('./router/productRouter'));
app.use('/order', require('./router/orderRouter'));
app.use('/payment', require('./router/paymentRouter'));

// listen to port
app.listen(port, () => {
    console.log(`Express Server is started.......`);
});






