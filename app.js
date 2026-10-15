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

// TODO tarkista 
const { route } = require('express/lib/application'); 


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
        maxAge: 1800000 // Max lifetime for the cookie in ms, 30 minutes
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

// Route to home page: login
app.get('/', (req, res) => {
    res.render('index')     
});

// Route to welcome page: compare credentials given at login to against the database
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
            userRole = userData.user_role; 
            userPassword = userData.password;
             
            // Check if given password matches stored password
            if (inputPassword == userPassword) {

                // Success update session data and render welcome page
                // Session data contains property user and has onlu userRole as value
                // It is possible to store more user data by defining more key-value-pairs
                sessionData.user= {role:userRole}
                res.render('welcome',{user: inputEmail, role: userRole});

            } else {
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
    if (userRole) {
        pgtools.getVehicleData().then((resultset) => {
            let vehicleData = resultset.rows;
           
        // Lets give a key for the resultset and render it to the page
        res.render('vehiclelist', {vehicleList: resultset.rows});
    })  
    } else {
        res.render('notAuthorized');
    }
});

// Route to indivisual vehicle page: select vehicle by register number
app.get('/vehicleDetail', (req, res) => {
    let user = req.session.user;
    let register = req.query.register;
    if (user.role) {
        if (user.role == 'opettaja' || user.role == 'hallinto') {        
            pgtools.getVehicleDetails([register]).then((resultset) => {

        // Render it to the page
        res.render('vehicleDetail', resultset.rows[0]);  
        }) 
        } else {
            res.render('notAuthorized')
        }
    } else {
        res.render('notSignedIn')
    }  
});

// Route to diary of single vehicle by register number
app.get('/vehicleDiary', (req, res) => {
    let user = req.session.user;
    let register = req.query.register;
    if (user) {
        if (user.role == 'opettaja' || user.role == 'hallinto') {       
            pgtools.getVehicleDiary([register]).then((resultset) => {
            res.render('vehicleDiary', {diaryData: resultset.rows})}) 
        } else {
            res.render('notAuthorized');
        }    

    } else {
        res.render('notSignedIn');
    }

});

// Route to diary containing all vehicles
app.get('/diary', (req, res) => {
    let user = req.session.user;
    //let register = req.query.register;
    if (user) {
        if (user.role == 'opettaja' || user.role == 'hallinto') {
            pgtools.getDiary().then((resultset) => {
            res.render('diary', {diaryData: resultset.rows});
        })
        } else {
            res.render('notAuthorized')
        }
    } else {
        res.render('notSignedIn')
    }    
});

app.get('/filterDiary', (req, res) => {
    
    if (req.session.user) {
        let userRole = req.session.user.role
        if (userRole == 'opettaja' || userRole == 'hallinto') {
           // Set query parameters
            let options = {}
            let registerList = []
            let driverList = []
            let reasonList = []     
            
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
            // console.log(options)
                res.render('filterDiary', options)

            })
            })                     
            }) 

        } else {
            res.render('notAuthorized')
        }      

    }
    else {
        res.render('notSignedIn')
    }                              
   
});

app.get('/filteredDiary', (req, res) => {

    console.log("=== FILTERED DIARY REITTIIN TULTU ===");
    console.log(req.query);

    if (req.session.user) {
        userRole = req.session.user.role;
        if (userRole == 'opettaja' || userRole == 'hallinto') {
        
            console.log("=== FILTERED DIARY EHTO LÄPI ");
            console.log(req.query);

            let registerFilter = req.query.rekisterinumero
            let registerFilterValid = req.query.rekisterisuodatus
            let reasonFilter = req.query.tarkoitus
            let reasonFilterValid = req.query.tarkoitussuodatus
            let driverFilter = req.query.nimi
            let driverFilterValid = req.query.kuljettajasuodatus       
            let startFilter = req.query.alkaa
            let startFilterString = startFilter.toString()
            console.log(startFilterString)
            console.log(req.query.alkaa)
            let endFilter = req.query.loppuu
            let dateFiltersValid = req.query.ottosuodatus
        

            let conditions = [];

            if (registerFilterValid == 'on') {
                conditions.push(`rekisterinumero = '${registerFilter}'`);
            }

            if (reasonFilterValid == 'on') {
                conditions.push(`tarkoitus = '${reasonFilter}'`);
            }

            if (driverFilterValid == 'on') {
                conditions.push(`nimi = '${driverFilter}'`);
            }

            if (dateFiltersValid == 'on') {
                conditions.push(`otettu BETWEEN '${startFilter}' AND '${endFilter}'`);
            }

            let whereClause = '';

            if (conditions.length > 0) {
                whereClause = ' WHERE ' + conditions.join(' AND ');
            }

            console.log(whereClause);

            let sqlstatement =
                'SELECT * FROM public.webajopaivakirja' + whereClause;

            pgtools.selectQuery(sqlstatement).then((resultset) => {
                res.render('filteredDiary', {
                    diaryData: resultset.rows
                });
            });

        } else {
            res.render('notAuthorized')
        }

    } else {
    res.render('notSignedIn')
    }    
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

// Route to menu bar
app.get('/menu', (req,res) => {
    res.render('menu');
});

// Route to diary containing all vehicle data for tax administration
app.get('/diaryTax', (req, res) => {
    let user = req.session.user;
    if (user) {
        if (user.role == 'hallinto') {
            pgtools.getDiaryTax().then((resultset) => {
            res.render('diaryTax', {diaryData: resultset.rows});
        })
        } else {
            res.render('notAuthorized')
        }

    } else {
        res.render('notSignedIn')
    }
});

// Route to sign out page
app.get('/signOut', (req,res) => {
    req.session.destroy((err) => {
        if (err) {
            res.render('signOutError');
        } else {
            res.render('signOutSuccess');
        }
    })
});

app.get('/api/testDeviceId', async (req, res) => {
    try {
        const register = req.query.register;

        console.log("Haetaan deviceId rekisterillä:", register);

        const deviceId = await pgtools.getDeviceId(register);

        console.log("Löytynyt deviceId:", deviceId);

        res.json({
            register: register,
            deviceId: deviceId
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Database error',
            details: err.message
        });
    }
});

// Vehicle position from Paikannin.com
app.get('/api/vehiclePositionData', async (req, res) => {
    try {
        console.log(req.query);

        const register = req.query.register;


        // Haetaan auton Paikannin-laitetunnus tietokannasta
        const deviceId = await pgtools.getDeviceId(register);

            if (!deviceId) {
                return res.status(404).json({
                    error: 'Vehicle not found',
                    details: `No deviceId found for register ${register}`
                });
            }

        // Haetaan Paikannin API-avain tietokannasta
        const apiKey = (await pgtools.getSetting('API_KEY'))?.trim();

            if (!apiKey) {
                return res.status(500).json({
                    error: 'API key not found'
                });
            }

        // Paikannin.com API URL
        const url = 'https://app.paikannin.com/public/api/devices/location/allpublic';

        // HTTP-pyyntö Paikannin API:in
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'API_KEY': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();

            console.error('Paikannin API error:', errorText);

            return res.status(response.status).json({
                error: 'Paikannin API failed',
                details: errorText
            });
        }

        // JSON-data API:lta
        const apiData = await response.json();

        // Etsitään oikea auto deviceId:n perusteella
        const vehicle = apiData.find(device =>
            Number(device.deviceId) === Number(deviceId)
        );

        if (!vehicle) {
            return res.status(404).json({
                error: 'Vehicle location not found',
                register: register,
                deviceId: deviceId
            });
        }

        // Lähetetään frontendille tarvittavat tiedot
        res.json({
            lat: vehicle.lat,
            lon: vehicle.lon,
            register: register,
            deviceId: vehicle.deviceId,
            timestamp: vehicle.timestamp,
            time: vehicle.time,
            deviceName: vehicle.deviceName,
            speed: vehicle.speed,
            heading: vehicle.heading
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Server error',
            details: err.message
        });
    }
});

// TODO: Route to vehicle's tracking page: location by register number
app.get('/vehiclePosition', (req, res) => {
    let vehicleData = {register: req.query.register}
    res.render('vehiclePosition', vehicleData)
});

// SERVER START
// ------------
app.listen(PORT);
console.log(`Server started on port ${PORT}`);