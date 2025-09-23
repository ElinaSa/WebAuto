// MODULE FOR HANDLING POSTGRESQL DATABASE QUERIES
// ===============================================

// LIBRARIES AND MODULES
// ---------------------

// EXTERNAL LIBRARIES

// Pg-pool 
const Pool = require('pg').Pool;

// LOCAL LIBRARIES AND MODULES

// DEFINITIONS
// -----------

// Connection settings
const connection = {host: '127.0.0.1',
    port: '5432',
    database: 'autolainaus',
    user: 'websovellus',
    password: 'Q2werty7'
};

// Create pool object for transactions
const pool = new Pool(connection);

// CRUD FUNCTIONS

// Create data with SQL statement and get results
const insertQuery = async (sqlstatement, values) => {
    let resultset = await pool.query(sqlstatement, values);
    return resultset;
} 

// Read data with SQL statement
const selectQuery = async (sqlstatement) => {
    let resultset = await pool.query(sqlstatement);
    return resultset;
}
// Update data with SQL statement

// Delete data with SQL statement

// APP SPECIFIC QUERIES

// Home page

// Vehicle list page - list of vehicles free and in use
const getFreeVehicles = async () => {
    let sqlstatement = 'SELECT * FROM public.vapaana';
    let resultset = await pool.query(sqlstatement);
    return resultset;
}

const getVehiclesInUse = async () => {
    let sqlstatement = 'SELECT * FROM public.ajossa';
    let resultset = await pool.query(sqlstatement);
    return resultset;
}
// Vehicle details page - vehicle in use by register number: embedded SQL
const getVehicleDetails = async () => {
    let sqlstatement = "SELECT * FROM public.ajopaivakirja WHERE rekisterinumero = 'XYZ-123'";
    let resultset = await pool.query(sqlstatement);
    return resultset;
}

// Vehicle details page - vehicle in use by register number: SQL + value
const getVehicleDetails2 = async (values) => {
    let sqlstatement = 'SELECT * FROM public.ajopaivakirja WHERE rekisterinumero = $1';
    let resultset = await pool.query(sqlstatement, values);
    return resultset;
}

// Vehicle details page - vehicle in use by register number: SQL + value 2nd method
const query = {
    text: 'SELECT * FROM public.ajopaivakirja WHERE rekisterinumero = $1',
    values: ['XYZ-123']
}
const getVehicleDetails3 = async (query) => {
    let resultset = await pool.query(query);
    return resultset;
}

// Diary page - all vehicles
const getDiary = async () => { 
    let sqlstatement = 'SELECT * from public.ajopaivakirja';
    let resultset = await pool.query(sqlstatement);
    return resultset;
}
// Location page - location by register number

getVehicleDetails2(['XYZ-123'])
// EXPORT FUNCTIONS
// ----------------
module.exports = {}