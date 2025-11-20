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
const { on } = require('pg-pool');

// INITIALIZATION
// --------------

// Create an express app
const app = express();

// Define a TCP-port to listen: read env or use 8080 in undefined
const PORT = process.env.PORT || 8080;

// Set a folder for static files like CSS or images
// app.use(express.static('public'));
app.use(express.static('public'));
app.use('/css', express.static('public/css'));
app.use('/images', express.static('public/images'));
app.use('/icons', express.static('public/icons'));

// Setup templating (ylimpänä kokeiltu Stackoverflown mallia)
app.engine('handlebars', engine({
    layoutsDir:__dirname + '/views/layouts',
}));
// app.engine('handlebars', engine());

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

app.get('/welcome', (req, res) => {
    // console.log(req)
    let user = req.query.user
    res.render('welcome', {user:user})
})

// Route to vehicle listing page: free vehicles and vehicles in use as a table
app.get('/vehicles', (req, res) => {
    pgtools.getVehicleData().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        res.render('vehicles', {vehicleList: resultset.rows});       
    })
});

// Route to vehicle listing page: free vehicles and vehicles in use using cards
app.get('/vehiclelist', (req, res) => {
    pgtools.getVehicleData().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        res.render('vehiclelist', {vehicleList: resultset.rows});
    })
});

// Route to indivisual vehicle page: select vehicle by register number
// TODO: Tarkista toimivuus! (onko otto määritelty jossain muussa sivussa)
app.get('/vehicleDetail', (req, res) => {
    let register = req.query.register;
    pgtools.getVehicleDetails([register]).then((resultset) => {
        // console.log(resultset.rows[0]);
        // console.log(resultset.rows[0].otto);
    // 
        // Converts timestamp to user friendly string NÄMÄ RIVIT HUKKAAVAT IKONIT VÄLILLÄ, EIKÄ AIKA NÄY JÄRKEVÄSTI
        let userFriendlyTimestamp = pgtools.convertToDateTimeObject(resultset.rows[0].otto);
        let dateTimeValue = userFriendlyTimestamp.date + ' kello ' + userFriendlyTimestamp.time

        // Change original timestamp to string value
        resultset.rows[0].otto = dateTimeValue;
        // 
        // Render it to the page
        res.render('vehicleDetail', resultset.rows[0]);  

        // console.log(pgtools.convertToISODateTime(resultset.rows[otto]));
    });             
});

// Toinen vaihtoehto, jostain syystö mulla ei hae auton kuvaa tällä
// app.get('/vehicleDetail', (req, res) => {
    // let register = req.query.register;
    // pgtools.getVehicleDetails2([register]).then((resultset) => {
        
        // res.render('vehicleDetail', resultset.rows[0]);
    // })

// Route to diary containing all vehicles
app.get('/diary', (req, res) => {
    pgtools.getDiary().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        // console.log(resultset.rows[0])
        let rows = resultset.rows
        let row = 0
        let formattedTake = {};
        let formattedReturn = {};
        for (row in rows) {
            if (rows[row].otto == null) {
                formattedTake.date = '-';
                formattedTake.time = '-';
            }
            else {
                formattedTake = pgtools.convertToDateTimeObject(rows[row].otto);
            }
            
            if (rows[row].palautus == null) {
                formattedReturn.date = '-';
                formattedReturn.time = '-';
            }

            else {
            formattedReturn = pgtools.convertToDateTimeObject(rows[row].palautus);
            }
            
            rows[row].otto = formattedTake.date + ' kello ' + formattedTake.time;
            rows[row].palautus = formattedReturn.date + ' kello ' + formattedReturn.time;
            console.log(rows[row].otto);
            console.log(rows[row].palautus);
        }

        res.render('diary', {diaryData: rows});
    })
});

app.get('/filterDiary', (req, res) => {
    let options = {}
    let registerList = []
    let driverList = []
    let reasonList = []

    pgtools.selectQuery('SELECT * FROM public.webrekisterit;').then((resultset) => {
        // console.log(resultset.rows)
        registerList = resultset.rows;

        pgtools.selectQuery('SELECT * FROM public.webtarkoitukset;').then((resultset) => {
            // console.log(resultset.rows)
            reasonList = resultset.rows; 

            pgtools.selectQuery('SELECT * FROM public.webkuljettajat;').then((resultset) => {
                // console.log(resultset.rows)
                driverList = resultset.rows;

                    options = {registers: registerList,
                    reasons: reasonList,
                    drivers: driverList
                };
            // console.log(options)
            res.render('filterDiary', options)
            })
        })      
               
    })
    // pgtools.selectQuery('SELECT * FROM public.webtarkoitukset;').then((resultset) => {
        // console.log(resultset.rows)
        // reasonList = resultset.rows       
    // })
    // pgtools.selectQuery('SELECT * FROM public.webkuljettajat;').then((resultset) => {
        // console.log(resultset.rows)
        // driverNames = resultset.rows       
    // })
    // options = {registers: registerNumbers,
        // reasons: reasonList,
        // drivers: driverNames
    // }
    // console.log(options)
    // res.render('filterDiary', options);
});

app.get('/filteredDiary', (req, res) => {
    let registerFilter = req.query.rekisterinumero
    let registerFilterValid = req.query.rekisterisuodatus
    let reasonFilter = req.query.tarkoitus
    let reasonFilterValid = req.query.tarkoitussuodatus
    let driverFilter = req.query.nimi
    let driverFilterValid = req.query.kuljettajasuodatus
    let startFilter = req.query.alkaa
    let endFilter = req.query.loppuu
    let dateFiltersValid = req.query.ottosuodatus
    
    let conditions = ''
    if (registerFilterValid == 'on') {
        conditions = conditions + 'rekisterinumero = '+ registerFilter + ' AND ';
    }
    if (reasonFilterValid == 'on') {
        conditions = conditions + 'tarkoitus  =' + reasonFilter + ' AND ';
    }
    if (driverFilterValid == 'on') {
        conditions = conditions + 'nimi =' + driverFilter + ' AND ';
    }
    if (dateFiltersValid == 'on') {
        conditions = conditions +  'otto BETWEEN ' + startFilter +  ' AND ' + endFilter;
    }    

    // TODO:Tämä lauseen pitäisi siivota and pois näkyvistä, mutta ei toimi
    let whereClause = 'WHERE' + conditions
    let cleanwhereClause = ''
    console.log(whereClause.endsWith(' AND '))
    if (whereClause.endsWith(' AND ')) {
        let position = whereClause.lastIndexOf(' AND ')
        cleanwhereClause = whereClause.substring(0, position)
        console.log(position)
    }

    console.log(registerFilter)
    console.log(registerFilterValid)
    console.log(cleanwhereClause)
    
    // res.render('filteredDiary');
})

// TODO: Route to vehicle's diary page: all entries for individual vehicle by register number
// kokeilu
app.get('/diary', (req, res) => {
    let register = req.query.register;
    pgtools.getVehicleDiary(['FNK-129']).then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        res.render('diary', resultset.rows[0]);
    })               
});

// TODO: Route to vehicle's tracking page: location by register number


// Different kind of tests
// -----------------------

app.get('/vlistFlex', (req, res)=> {
    res.render('vlistFlex');
})

app.get('/icontest', (req, res)=> {
    res.render('icontest');
})

app.get('/svgtest', (req, res)=> {
    res.render('svgtest');
})

app.get('/vlistColums', (req, res)=> {
    res.render('vlistColumns');
})

app.get('/vlistFlex', (req, res) => {
        res.render('vlistFlex');
    })

app.get('vlistColumns', (reg, res) => {
    res.render('vlistColumns');
})

app.get('/iconList', (req, res) => {
    res.render('iconList');
})

// TODO: POISTETAAN/MUOKATAAN TÄMÄ PÄTKÄ KUN KAIKKI ON VALMISTA
// URL-reitti About-sivulle
app.get('/about',(req, res) => {
    // Simuloidaan dynaamista dataa   
    let aboutData = {
        'team': 'Elina, Kata, Heikki, Nikki ja Jonna.'
    };
    res.render('about', aboutData);
});

// A test route to test.handlebars page
// TODO: muokkaa handlebars sivu! 
app.get('/test', (req, res) => {
    testData ={'testKey': 'Hippopotamus is virtahepo in Finnish'};
    pgtools.selectQuery('SELECT * FROM public.vapaana').then((resultset) => {
        console.log(resultset.rows)
    })
    res.render('test', testData)
});

app.get('/formTest', (req, res) => {
    res.render('formtest');
})

// SERVER START
// ------------

app.listen(PORT);
console.log(`Server started on port ${PORT}`);
