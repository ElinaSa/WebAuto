// WEB APPLICATION FOR SERVING RASEKO'S VEHICLE LENDING DATABASE
// ===============================================================

// LIBRARIES
// ---------

// External libraries
// ------------------
const express = require('express');
const {engine} = require('express-handlebars');

// Local libraries and modules
// ---------------------------
const pgtools = require('./postgres-tools');

// INITIALIZATION
// --------------

// Create an express app
const app = express();

// Define a TCP-port to listen: read env or use 8080 in undefined
const PORT = process.env.PORT || 8080;

// Set a folder for static files like CSS or images
app.use(express.static('public'));
app.use('/images', express.static('public/images'));

// Setup templating
app.engine('handlebars', engine());
app.set('view engine','handlebars');
app.set('views', './views');

// Setup URL parser to use extended option
app.use(express.urlencoded({extended: true}));

// URL ROUTES
// ----------

// A test route to test.handlebars page
// TODO: muokkaa handlebars sivu! 
app.get('/test', (req, res) => {
    testData ={'testKey': 'Hippopotamus is virtahepo in Finnish'};
    pgtools.selectQuery('SELECT * FROM public.vapaana').then((resultset) => {
        console.log(resultset.rows)
    })
    res.render('test', testData)
});

// Route to home page
app.get('/',(req, res) => {
    res.send('This text will be replace by a handlebars homepage. Navigate to /test to see dynamic data in action')      
});

// Route to vehicle listing page: free vehicles and vehicles in use
app.get('/vehicles', (req, res) => {
    pgtools.getVehicleData().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        res.render('vehicles', {vehicleList: resultset.rows});       
    })
});

// Route to indivisual vehicle page: select vehicle by register number
app.get('/vehicleDetail', (req, res) => {
    pgtools.getVehicleDetails2(['FNK-129']).then((resultset) => {
        // Lets give a key for the resultset and render it to the page
           res.render('vehicleDetail', resultset.rows[0]);
    })               
});

// TODO: Route to diary containing all vehicles
app.get('/diary', (req, res) => {
    pgtools.getDiary().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        res.render('diary', {diaryData: resultset.rows});
    })

})
// TODO: Route to vehicle's diary page: all entries for individual vehicle by register number
app.get('/diary', (req, res) => {
        pgtools.getDiary().then((resultset) => {
            res.render('diary', diaryData, resultset.rows[0]
            )
        })        
        
});


// TODO: Route to vehicle's tracking page: location by register number


// TODO: POISTETAAN TÄMÄ PÄTKÄ KUN KAIKKI ON VALMISTA
// URL-reitti About-sivulle
app.get('/about',(req, res) => {
    // Simuloidaan dynaamista dataa   
    let aboutData = {
        'team': 'Elina, Kata, Heikki ja Jonna. Keskiviikkona mukaan liittyi Nikki.'
    };
    res.render('about', aboutData);
});


// SERVER START
// ------------

app.listen(PORT);
console.log('Server started on port, ${PORT}');
