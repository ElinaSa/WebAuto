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

// INITIALIZATION
// --------------
// Create an express app
const app = express();

// Define a TCP-port to listen: read env or use 8080 in undefined
const PORT = process.env.PORT || 8080;

// Set a folder for static files like CSS or images


// Setup templating

// URL ROUTES
// ----------

// SERVER START
// ------------


// TÄHÄN ASTI TEHTY MUOKKAUKSIA MIKAN MUKANA


// NÄMÄ ALLA OVAT VANHASTA KOPIOITUJA, JOTKA TÄYTYY MUOKATA
// KIELI ENGLANNIKSI JA RYHMITTELY JÄRKEVÄKSI
// Luodaan palvelin
const app = express();

// Määritellään TCP-portti, jota palvelin kuuntelee
// Se luetaan ympärisömuuttujasta PORT tai jos sitä ei ole käytetään porttia 8080
const PORT = process.env.PORT || 8080;

// Määritellään polut kansioihin
// Defining paths to folders
// Määritellään polku staattisten tiedostojen kansioon
// Specifying the path to the static files folder
app.use(express.static('public'));

// Määritellään polku sivujen näkymiin
// Defining the path to page views
app.set('views', './views');

// Tehdään palvelimen express-asetukset
// Creating server express-settings
app.engine('handlebars', engine());
app.set('view engine','handlebars');

// MÄÄRITELLÄÄN URL-REITIT
// -----------------------

// Kotisivu, so. URL pelkästään palvelimen osoite
// Homepage, so.URL just the server adress
app.get('/',(req, res) => {

    // Tämä on leikisti dynaamista dataa, joka on tullut tietokannasta
    // Dynamic data from the Database
    let today = 'tiistai';
    

    // Mudostetaan JSON-objekti, joka voidaan lähettää sivulle korvaamaan {{}}-muuttujat
    // Creating a JSON object that can be sent to the page to replace {{}} variables
    let dataToSend = {
    'dayName': today,    
    };

    // Renderöidään kotisivu lähettämällä sinne data
    // Render the homepage by sending data to it
    res.render('index', dataToSend);
});

// URL-reitti About-sivulle
app.get('/about',(req, res) => {
    // Simuloidaan dynaamista dataa
    
    let aboutData = {
        'team': 'Elina, Kata, Heikki ja Jonna. Keskiviikkona mukaan liittyi Nikki.'
    };
    res.render('about', aboutData);

});

// Käynnistetään palvelin
app.listen(PORT);
console.log('Palvelin käynnistetty portissa', PORT);
