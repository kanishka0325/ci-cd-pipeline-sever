const express = require('express');
const cors = require('cors');
const swaggerDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const {mongoose} = require('mongoose');
const Type = require('./models/Type');
const Joke = require('./models/Joke');
require ('dotenv').config({path: __dirname+'/.env'})


const app = express();
app.use(express.json());
app.use(cors({credentials: true, origin: process.env.CLIENT_SEVER}));
const MONGO_DB = process.env.MONGO_SECRET_KEY;
const HOST_SEVER = process.env.HOST_SERVER;

// Mongo Configuration
mongoose.connect(MONGO_DB);

// Swagger Configuration 
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'API Documentation of Minimal Architecture of Joke Deliver Microservice',
            version: '1.0.0',
            servers: [HOST_SEVER],
        }
    },
    apis: ['index.js'],
}

const swaggerDocs = swaggerDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));



// Routes 

/**
 * @swagger
 * /:
 *   get:
 *     description: Testing API Server Configuration
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/',(req, res)=>{
    res.send('Tested API Server Configuration');
});

/**
 * @swagger
 * /types:
 *   post:
 *     description: Posting a type to the server
 *     responses:
 *       200:
 *         description: {msg: 'Success'}
 *       400:
 *         description: {msg: error message}   
 */
app.post('/types', async(req, res)=>{
    const {type} = req.body;
    try{    
        const typeDoc = await Type.create({type});
        res.json({msg: 'Success'});

    }catch(err){
        res.status(400).json({msg: err});
    }
})

/**
 * @swagger
 * /types:
 *   get:
 *     description: Get All Available Types
 *     responses:
 *       200:
 *         description: [{"_id":"6424094c9da7c05ed7e24c5e","type":"General","__v":0},{"_id":"64240a6f70b6c1e831570b57","type":"Programming","__v":0},{"_id":"64240a7770b6c1e831570b59","type":"Adult","__v":0},{"_id":"64240a9670b6c1e831570b5b","type":"Politics","__v":0}]
 */
app.get('/types', async(req, res)=>{
    res.json(await Type.find());
})


/**
 * @swagger
 * /jokes:
 *   post:
 *     description: Post a New Joke to the Database
 *     responses:
 *      200:
 *        description: {msg: 'Success'}
 *      400:
 *        description: {msg: error message}   
 */
app.post('/jokes', async(req, res)=>{
    const {type, joke} = req.body;
    try{
        const jokeDoc = await Joke.create({type, joke, status: 'Pending'});
        res.json({msg: 'Success'});
    }catch(err){
        res.status(400).json({msg: err});
    }
})


/**
 * @swagger
 * /random:
 *   post:
 *     description: Get a random Joke Regarding to the Requested Joke Type
 *     responses:
 *      200:
 *        description: if there are any responses returned Object of Joke and if not returned null 
 *      400:
 *        description: {msg: error message}   
 */
app.post('/random', async(req, res)=>{
    const {type} = req.body;
    const jokes = await Joke.find({type: type});
    const randomIndex = Math.floor(Math.random() * jokes.length);

    if(jokes.length > 0){
        res.json(jokes[randomIndex]);
    }
    else{
        res.json(null);
    }
    
})

app.listen(4040, ()=> console.log(`Server Start on: 4040`));
