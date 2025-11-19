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



// Route to home page
app.get('/',(req, res) => {
    res.render('index')
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
    let register = req.query.register;
    pgtools.getVehicleDetails([register]).then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        let userFriendlyTimestamp = pgtools.convertToDateTimeObject(resultset.rows[0].otto);
        let dateTimeValue = userFriendlyTimestamp.date + ' kello ' + userFriendlyTimestamp.time
        resultset.rows[0].otto = dateTimeValue
        res.render('vehicleDetail', resultset.rows[0]);
    })               
});

app.get('/welcome', (req, res) => {
    let user = req.query.user
    res.render('welcome', {user: user})
});

app.get('/vehiclelist', (req, res) => {
    pgtools.getVehicleData().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        res.render('vehiclelist', {vehicleList: resultset.rows});
    })
});

// Route to diary containing all vehicles
app.get('/diary', (req, res) => {
    pgtools.getDiary().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        //console.log(resultset.rows[1])
        let rows = resultset.rows
        console.log(rows[0])
        let row = 0
        let formattedTake = {}
        let formattedReturn = {}
        for (row in rows) {
            if (rows[row].otto == null) {
                formattedTake.date = '-'
                formattedTake.time = '-'
            }
            else {
            formattedTake = pgtools.convertToDateTimeObject(rows[row].otto);
            }
             if (rows[row].palautus == null) {
                formattedReturn.date = '-'
                formattedReturn.time = '-'
            }
            else {
            formattedReturn = pgtools.convertToDateTimeObject(rows[row].palautus);
            }
            rows[row].otto = formattedTake.date + ' klo: ' + formattedTake.time;
            rows[row].palautus = formattedReturn.date + ' klo:' + formattedReturn.time;
            console.log(rows[row].otto)
            console.log(rows[row].palautus)
        }
        res.render('diary', {diaryData: rows});
    })
    
});

app.get('/filterDiary', (req, res) => {
        pgtools.selectQuery('SELECT rekisterinumero FROM auto;').then((resultset) => {
            console.log(resultset.rows)
            let options = {registers: resultset.rows}
            res.render('filterDiary', options);
        })
    });
// TODO: Route to vehicle's tracking page: location by register number

app.get('/vlistFlex', (req, res) => {
        res.render('vlistFlex');
    })

app.get('vlistColumns', (reg, res) => {
    res.render('vlistColumns');
})



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