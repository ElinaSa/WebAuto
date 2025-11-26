// WEB APPLICATION FOR SERVING RASEKO'S VEHICLE LENDING DATABASE
// ===============================================================

// LIBRARIES
// ---------

// External libraries
// ------------------

// Express Web Server
const express = require('express');

// Handlebars templating engine for Express
const {engine} = require('express-handlebars');

// Session handler to store login information
const session = require('express-session');

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
app.use(express.static('public'));
app.use('/css', express.static('public/css'));
app.use('/images', express.static('public/images'));
app.use('/icons', express.static('public/icons'));

// Setup session handler
app.use(session({
    secret: 'hippopotamus', // Signing passphrase for cookies
    resave: false, // Unmodified sessions will not be saved
    saveUninitialized: false, // Unmodified new sessions will not be saved
    cookie: {
        maxAge: 600000 // Max lifetime for the cookie in ms, 10 minutes
    }
}));

// Setup templating 
app.engine('handlebars', engine());
app.set('view engine','handlebars');
app.set('views', './views');

// Setup URL parser to use extended option
app.use(express.urlencoded({extended: true}));

// URL ROUTES
// ----------

// Route to home page
app.get('/', (req, res) => {
    res.render('index')     
});

app.post('/welcome', (req, res) => {

    // Collect login data from body
    let inputEmail = req.body.user;
    let inputPassword = req.body.password;

    // Get session data
    let sessionData = req.session;
    console.log(sessionData)

    // Define variables for users Role and stored password
    let userRole = '';
    let userPassword = '';

    // Get user data from database using given email address
    pgtools.getWebUserData([inputEmail]).then((resultset) => {
        let userData = resultset.rows[0]; 

        // Check if query returns anything
        if (userData) {

            // Parse user information from resultset
            userEmail = userData.email;
            userRole = userData.userRole;       // kuuluuko tässä olla user_role?
            userPassword = userData.password;
             
            // Check if given password matches stored password
            if (inputPassword == userPassword) {

                // Success update session data and render welcome page
                sessionData.user= {role:userRole}
                res.render('welcome',{user: inputEmail, role: userRole});
            }
            else {
                 res.render('invalidPassword');
            }

        } else {
            res.render('invalidUserName', {user: inputEmail})
        }                
    });
    
});

// Route to vehicle listing page: free vehicles and vehicles in use 
app.get('/vehiclelist', (req, res) => {
    userRole = req.session.user;
    console.log(userRole);
    if (userRole) {
        pgtools.getVehicleData().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        res.render('vehiclelist', {vehicleList: resultset.rows});
    })  
    }
    else {
        res.render('notAuthorized');
    }
});

// TODO: TARKISTA NÄIDEN KOHTALO?
// 
// Route to vehicle listing page: free vehicles and vehicles in use as a table
// app.get('/vehicles', (req, res) => {
    // pgtools.getVehicleData().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        // res.render('vehicles', {vehicleList: resultset.rows});       
    // })
// });
// 
// Route to vehicle listing page: free vehicles and vehicles in use using cards
// app.get('/vehiclelist', (req, res) => {
    // pgtools.getVehicleData().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        // res.render('vehiclelist', {vehicleList: resultset.rows});
    // })
// });
// 
// Route to indivisual vehicle page: select vehicle by register number
// TODO: Tarkista toimivuus! (onko otto määritelty jossain muussa sivussa)
app.get('/vehicleDetail', (req, res) => {
    let register = req.query.register;
    pgtools.getVehicleDetails([register]).then((resultset) => {

        // Converts timestamp to user friendly string
        let userFriendlyTimestamp = pgtools.convertToDateTimeObject(resultset.rows[0].otto);
        let dateTimeValue = userFriendlyTimestamp.date + ' kello ' + userFriendlyTimestamp.time

        // Change original timestamp to string value
        resultset.rows[0].otto = dateTimeValue;
        // 
        // Render it to the page
        res.render('vehicleDetail', resultset.rows[0]);  
    })             
});

// Route to diary containing all vehicles
app.get('/diary', (req, res) => {
    pgtools.getDiary().then((resultset) => {
        // Lets give a key for the resultset and render it to the page
        let rows = resultset.rows;
        let row = 0;
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

    // Set user role to none
    let userRole = 'none'

    // Read session data
    console.log(req.session)    
    if (req.session.user) {
        userRole = req.session.user.role

        if(userRole = 'none') {
            res.render('notAuthorized');
        } else {
            // Set query parameters
            let options = {};
            let registerList = [];
            let driverList = [];
            let reasonList = [];

            pgtools.selectQuery('SELECT * FROM public.webrekisterit;').then((resultset) => {
                registerList = resultset.rows;

                pgtools.selectQuery('SELECT * FROM public.webtarkoitukset;').then((resultset) => {
                    reasonList = resultset.rows; 

                    pgtools.selectQuery('SELECT * FROM public.webkuljettajat;').then((resultset) => {
                        driverList = resultset.rows;

                        options = {registers: registerList,
                            reasons: reasonList,
                            drivers: driverList
                        };
                        res.render('filterDiary', options)
                    })
                })                     
            }) 
        }
    }
// TODO: Tästä if else kesken
    if (userRole == 'opettaja' || userRole == 'hallinto') {
        // Set query parameters
        let options = {}
        let registerList = []
        let driverList = []
        let reasonList = []
    } else {
        res.render('notAuthorized')
    }   

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
    });

app.get('/filteredDiary', (req, res) => {
    let registerFilter = req.query.rekisterinumero
    let registerFilterValid = req.query.rekisterisuodatus
    let reasonFilter = req.query.tarkoitus
    let reasonFilterValid = req.query.tarkoitussuodatus
    let driverFilter = req.query.nimi
    let driverFilterValid = req.query.kuljettajasuodatus       
    let startFilter = req.query.alkaa
    let startFilterString = startFilter.toString()
    console.log(startFilterString)

    let endFilter = req.query.loppuu
    let dateFiltersValid = req.query.ottosuodatus
    
    let conditions = ''
    if (registerFilterValid == 'on') {
        conditions = conditions + `rekisterinumero = '${registerFilter}'  AND `;
    }
    if (reasonFilterValid == 'on') {
        conditions = conditions + `tarkoitus  = '${reasonFilter}' AND `;
    }
    if (driverFilterValid == 'on') {
        conditions = conditions + `nimi =' '${driverFilter}' AND `;
    }
    if (dateFiltersValid == 'on') {
        conditions = conditions +  `otto BETWEEN '${startFilter} ' AND ' ${endFilter}`;
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
    else {
        cleanwhereClause = whereClause
    }
    console.log(registerFilter)
    console.log(registerFilterValid)
    console.log(cleanwhereClause)
    console.log(startFilter)
    console.log(endFilter)
    console.log(req.query)
    console.log('Where clause is:', cleanwhereClause);
    
});

// TODO: Route to vehicle's diary page: all entries for individual vehicle by register number

// TODO: Route to vehicle's tracking page: location by register number


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            res.render('logoutError');
        }
        else {
            res.render('logout');
        }
    })
});

// Different kind of tests
// -----------------------
app.get('/cookieTest', (req, res) => {
    console.log('Istuntotiedot cookieTest-sivu:', req.session)
    res.render('cookieTest', {sessionUser: req.session.user.username, //vai .role?
        sessionEnds: req.session.cookie_expires
    })
});

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
