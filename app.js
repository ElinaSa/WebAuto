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
const {route} = require('express/lib/application'); 


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
    let userDepartment = '';

    // Get user data from database using given email address
    pgtools.getWebUserData([inputEmail]).then((resultset) => {
        let userData = resultset.rows[0]; 

        // Check if query returns anything
        if (userData) {

            // Parse user information from resultset
            userEmail = userData.email;
            userRole = userData.user_role; 
            userPassword = userData.password;
            userDepartment = userData.department;
             
            // Check if given password matches stored password
            if (inputPassword == userPassword) {

                // Success update session data and render welcome page
                // Session data contains property user and has onlu userRole as value
                // It is possible to store more user data by defining more key-value-pairs
                sessionData.user = {
                    email: userEmail, 
                    role: userRole, 
                    department: userDepartment
                };
                res.render('welcome',{
                    user: inputEmail, 
                    role: userRole, 
                    department: userDepartment
                });

            } else {
                 res.render('invalidPassword');
            }

        } else {
            res.render('invalidUserName', {user: inputEmail})
        }                
    });
});

// Route to vehicle listing page: free vehicles and vehicles in use 
// Hallinto näkee kaikki autot, opettaja näkee vain oman osastonsa autot
app.get('/vehiclelist', async (req, res) => {
    // tarkistetaan kirjautuminen
    const user = req.session.user;

        if (!user) {
        return res.render('notSignedIn');
    }

    const userRole = user.role;
    const userDepartment = user.department;

    try {
        let resultset;

        // Hallinto näkee kaikki autot
        if (userRole === 'hallinto') {

            resultset = await pgtools.getVehicleData();

        }

        // Opettaja tai opiseklija näkevät vain oman osastonsa autot
        else if (userRole === 'opettaja' || userRole === 'opiskelija') {

            if (!userDepartment) {
                return res.render('notAuthorized');
            }

            resultset = await pgtools.getVehicleDataByDepartment(
                userDepartment
            );

        }

        // Muilla ei käyttöoikeutta
        else {
            return res.render('notAuthorized');
        }

        // Näytetään ajoneuvolista
        return res.render('vehiclelist', {
            vehicleList: resultset.rows
        });

    } catch (error) {
        console.error('Virhe ajoneuvolistan haussa:', error);
        return res.status(500).send('Ajoneuvojen haku epäonnistui.');
    }

    
    // if (userRole) {
    //     if (user.role == 'hallinto') {
    //         pgtools.getVehicleData().then((resultset) => {
         
    //         // Lets give a key for the resultset and render it to the page
    //         res.render('vehiclelist', {vehicleList: resultset.rows});
    //     })  
    //     } else {
    //         res.render('notAuthorized');
    //     }

    //     if (user.role == 'opettaja' && webuser.department == vehicle.department) {
    //         pgtools.getVehicleData().then((resultset) => {
         
    //         // Lets give a key for the resultset and render it to the page
    //         res.render('vehiclelist', {vehicleList: resultset.rows});
    //     })  
    //     } else {
    //         res.render('notAuthorized');
    //     }
    // }
});

// Route to indivisual vehicle page: select vehicle by register number
app.get('/vehicleDetail', async (req, res) => {
    const user = req.session.user;
    
    const register = req.query.register;

    const userRole = user.role;
    const userDepartment = user.department;

        if (!user) {
        return res.render('notSignedIn');
    }

    console.log('Kirjautunut käyttäjä:', user);
    console.log('Haettava rekisterinumero:', register);
    console.log('Käyttäjän osasto:', user.department);

    try {
        let resultset;

        // Hallinto saa nähdä kaikkien autojen tiedot
        if (userRole === 'hallinto') {

            resultset = await pgtools.getVehicleDetails([register]);

        }

        // Opettaja saa nähdä vain oman osastonsa auton tiedot
        else if (userRole === 'opettaja') {

            if (!userDepartment) {
                return res.render('notAuthorized');
            }

            resultset = await pgtools.getVehicleDetailsByDepartment([
                register, 
                user.department
            ]);

        }

        // Muilla käyttäjillä ei ole käyttöoikeutta
        else {
            return res.render('notAuthorized');
        }

        // Tarkistetaan löytyikö auto
        if (resultset.rows.length === 0) {
            return res.render('notAuthorized');
        }

        return res.render('vehicleDetail', resultset.rows[0]);

        

    } catch (error) {
        console.error('Virhe ajoneuvon tietojen haussa:', error);
        console.error('Virheen viesti:', error.message);
        return res.status(500).send('Ajoneuvon tietojen haku epäonnistui.');
    }

    

    
    // if (user.role) {
    //     if (user.role == 'hallinto' || user.role == 'opettaja') {        
    //         pgtools.getVehicleDetails([register]).then((resultset) => {

    //     // Render it to the page
    //     res.render('vehicleDetail', resultset.rows[0]);  
    //     }) 
    //     } else {
    //         res.render('notAuthorized')
    //     }

    //         if (user.role == 'opettaja') {     
    //             const resultset =await pgtools.getVehicleDetailsByDepartment([
    //                 register,
    //                 user.department
    //             ]); 
    //             pgtools.getVehicleDetails([register]).then((resultset) => {

    //     // Render it to the page
    //     res.render('vehicleDetail', resultset.rows[0]);  
    //     }) 
    //     } else {
    //         res.render('notAuthorized')
    //     }
    // } else {
    //     res.render('notSignedIn')
    // }  
   
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
// app.get('/diary', (req, res) => {
//     let user = req.session.user;
//     //let register = req.query.register;
//     if (user) {
//         if (user.role == 'opettaja' || user.role == 'hallinto') {
//             pgtools.getDiary().then((resultset) => {
//             res.render('diary', {diaryData: resultset.rows});
//         })
//         } else {
//             res.render('notAuthorized')
//         }
//     } else {
//         res.render('notSignedIn')
//     }    
// });

// Route to diary containing vehicle journeys
app.get('/diary', async (req, res) => {

    const user = req.session.user;

    // Tarkistetaan kirjautuminen
    if (!user) {
        return res.render('notSignedIn');
    }

    try {
        let resultset;

        // Hallinto näkee kaikkien osastojen päiväkirjamerkinnät
        if (user.role === 'hallinto') {

            resultset = await pgtools.getDiary();

        }

        // Opettaja näkee vain oman osastonsa merkinnät
        else if (user.role === 'opettaja') {

            if (!user.department) {
                return res.render('notAuthorized');
            }

            resultset = await pgtools.getDiaryByDepartment(
                user.department
            );

        }

        // Muut käyttäjäroolit eivät pääse sivulle
        else {
            return res.render('notAuthorized');
        }

        return res.render('diary', {
            diaryData: resultset.rows
        });

    } catch (error) {
        console.error('Virhe ajopäiväkirjan haussa:', error);

        return res.status(500).send(
            'Ajopäiväkirjan tietojen haku epäonnistui.'
        );
    }
});

// Route to filter diary page
app.get('/filterDiary', async (req, res) => {

    const user = req.session.user;

    if (!user) {
        return res.render('notSignedIn');
    }

    if (user.role !== 'opettaja' && user.role !== 'hallinto') {
        return res.render('notAuthorized');
    }

    if (user.role === 'opettaja' && !user.department) {
        return res.render('notAuthorized');
    }

    try {
        let registerList;
        let reasonList;
        let driverList;

        if (user.role === 'hallinto') {

            // Hallinto näkee kaikki vaihtoehdot
            const registers = await pgtools.selectQuery(
                'SELECT * FROM public.webrekisterit;'
            );

            const reasons = await pgtools.selectQuery(
                'SELECT * FROM public.webtarkoitukset;'
            );

            const drivers = await pgtools.selectQuery(
                'SELECT * FROM public.webkuljettajat;'
            );

            registerList = registers.rows;
            reasonList = reasons.rows;
            driverList = drivers.rows;

        } else {

            // Opettaja näkee vain oman osastonsa vaihtoehdot
            const registers = await pgtools.selectQuery(`
                SELECT DISTINCT rekisterinumero
                FROM public.webajopaivakirja
                WHERE osasto = $1
                ORDER BY rekisterinumero;
            `, [user.department]);

            const reasons = await pgtools.selectQuery(`
                SELECT DISTINCT tarkoitus
                FROM public.webajopaivakirja
                WHERE osasto = $1
                ORDER BY tarkoitus;
            `, [user.department]);

            const drivers = await pgtools.selectQuery(`
                SELECT DISTINCT nimi
                FROM public.webajopaivakirja
                WHERE osasto = $1
                ORDER BY nimi;
            `, [user.department]);

            registerList = registers.rows;
            reasonList = reasons.rows;
            driverList = drivers.rows;
        }

        return res.render('filterDiary', {
            registers: registerList,
            reasons: reasonList,
            drivers: driverList
        });

    } catch (error) {
        console.error('Virhe suodatusvalintojen haussa:', error);

        return res.status(500).send(
            'Suodatusvalintojen haku epäonnistui.'
        );
    }  
});

// Route to filter vehicle diaries
app.get('/filteredDiary', async(req, res) => {

    console.log("=== FILTERED DIARY REITTIIN TULTU ===");
    console.log(req.query);

        const user = req.session.user;

    // Tarkistetaan kirjautuminen
    if (!user) {
        return res.render('notSignedIn');
    }

    // Tarkistetaan käyttäjärooli
    if (user.role !== 'opettaja' && user.role !== 'hallinto') {
        return res.render('notAuthorized');
    }

    // Opettajalta täytyy löytyä osastotieto
    if (user.role === 'opettaja' && !user.department) {
        return res.render('notAuthorized');
    }

    try {
        const conditions = [];
        const values = [];

        // Opettajan osasto lisätään aina pakolliseksi ehdoksi
        if (user.role === 'opettaja') {
            values.push(user.department);
            conditions.push(`osasto = $${values.length}`);
        }

        // Rekisterinumerosuodatus
        if (req.query.rekisterisuodatus === 'on' &&
            req.query.rekisterinumero) {

            values.push(req.query.rekisterinumero);
            conditions.push(`rekisterinumero = $${values.length}`);
        }

        // Käyttötarkoitussuodatus
        if (req.query.tarkoitussuodatus === 'on' &&
            req.query.tarkoitus) {

            values.push(req.query.tarkoitus);
            conditions.push(`tarkoitus = $${values.length}`);
        }

        // Kuljettajasuodatus
        if (req.query.kuljettajasuodatus === 'on' &&
            req.query.nimi) {

            values.push(req.query.nimi);
            conditions.push(`nimi = $${values.length}`);
        }

        // Päivämääräsuodatus
        if (req.query.ottosuodatus === 'on' &&
            req.query.alkaa &&
            req.query.loppuu) {

            values.push(req.query.alkaa);
            const startParameter = values.length;

            values.push(req.query.loppuu);
            const endParameter = values.length;

            conditions.push(
                `otettu BETWEEN $${startParameter} AND $${endParameter}`
            );
        }

        // Muodostetaan WHERE-ehto
        const whereClause = conditions.length > 0
            ? ' WHERE ' + conditions.join(' AND ')
            : '';

        const sqlstatement = `
            SELECT *
            FROM public.webajopaivakirja
            ${whereClause}
            ORDER BY rekisterinumero, otettu DESC;
        `;

        console.log('SQL-kysely:', sqlstatement);
        console.log('SQL-parametrit:', values);

        const resultset = await pgtools.selectQuery(
            sqlstatement,
            values
        );

        return res.render('filteredDiary', {
            diaryData: resultset.rows
        });

    } catch (error) {
        console.error('Virhe suodatetun ajopäiväkirjan haussa:', error);

        return res.status(500).send(
            'Ajopäiväkirjan suodatus epäonnistui.'
        );
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

// TODO nyt hyvin suppeasti testidatasta, saako kuinka helposti kattavammaksi
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

        // Tarkistetaan että Paikannin.com palauttauttama tieto on API:ssa samalla nimellä
        console.log("Vehicle data:", JSON.stringify(vehicle, null, 2));

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
            heading: vehicle.heading,
            namedLocations: vehicle.namedLocations
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Server error',
            details: err.message
        });
    }
});

// Route to vehicle's tracking page: location by register number
app.get('/vehiclePosition', (req, res) => {
    let vehicleData = {register: req.query.register}
    res.render('vehiclePosition', vehicleData)
});

// TODO 19.11.2026 kokeilu, routeData vai vehicleData, toimiiko role tässä näin
// Vehicle routes from Paikannin.com for tax administration
// app.get('/api/vehicleRouteTax', async (req, res) => {
//     let user = req.session.user;
//     if (user) {
//         if (user.role == 'hallinto') {
//             pgtools.getvehicleRouteTax().then((resultset) => {
//             res.render('vehicleRouteTax', {routeData: resultset.rows});
//         })
//         } else {
//             res.render('notAuthorized')
//         }

//     } else {
//         res.render('notSignedIn')
//     }

//     try {
//         console.log(req.query);

//         const register = req.query.register;

//         // TODO nämä kopioitu vehicle positionista, voi vaatiia jumppaa enemmänkin
//         // Haetaan auton Paikannin-laitetunnus tietokannasta
//         const deviceId = await pgtools.getDeviceId(register);

//             if (!deviceId) {
//                 return res.status(404).json({
//                     error: 'Vehicle not found',
//                     details: `No deviceId found for register ${register}`
//                 });
//             }

//         // Haetaan Paikannin API-avain tietokannasta
//         const apiKey = (await pgtools.getSetting('API_KEY'))?.trim();

//             if (!apiKey) {
//                 return res.status(500).json({
//                     error: 'API key not found'
//                 });
//             }

        // Paikannin.com API URL
        // TODO KyselyyN päivitetty HUOM! devices NYT routes
    //     const url = 'https://app.paikannin.com/public/api/devices/routes/nopoints/{deviceId}/{startTime}/{endTime}';

    //     // HTTP-pyyntö Paikannin API:in
    //     const response = await fetch(url, {
    //         method: 'GET',
    //         headers: {
    //             'API_KEY': apiKey,
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         }
    //     });

    //     if (!response.ok) {
    //         const errorText = await response.text();

    //         console.error('Paikannin API error:', errorText);

    //         return res.status(response.status).json({
    //             error: 'Paikannin API failed',
    //             details: errorText
    //         });
    //     }

    //     // JSON-data API:lta
    //     const apiData = await response.json();

    //     // Etsitään oikea auto deviceId:n perusteella
    //     const vehicle = apiData.find(device =>
    //         Number(device.deviceId) === Number(deviceId)
    //     );

    //     if (!vehicle) {
    //         return res.status(404).json({
    //             error: 'Vehicle location not found',
    //             register: register,
    //             deviceId: deviceId
    //         });
    //     }

    //     // Tarkistetaan että Paikannin.com palauttauttama tieto on API:ssa samalla nimellä
    //     console.log("Vehicle data:", JSON.stringify(vehicle, null, 2));

    //     // Lähetetään frontendille tarvittavat tiedot
    //     res.json({
    //         lat: vehicle.lat,
    //         lon: vehicle.lon,
    //         register: register,
    //         deviceId: vehicle.deviceId,
    //         timestamp: vehicle.timestamp,
    //         time: vehicle.time,
    //         deviceName: vehicle.deviceName,
    //         speed: vehicle.speed,
    //         heading: vehicle.heading,
    //         namedLocations: vehicle.namedLocations
    //     });

    // } catch (err) {
    //     console.error(err);

    //     res.status(500).json({
    //         error: 'Server error',
    //         details: err.message
    //     });
    // }
// });

// TODO testaaa ja tarkista tämän toimivuus
// API:sta haettujen ajotapahtumien tallentaminen tietokantaan
// for (const route of routes) {
//     await pgtools.insertWebAjopaivakirja(route);
// }

// SERVER START
// ------------
app.listen(PORT);
console.log(`Server started on port ${PORT}`);