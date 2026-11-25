// MODULE FOR HANDLING POSTGRESQL DATABASE QUERIES
// ===============================================

// LIBRARIES AND MODULES
// ---------------------

// EXTERNAL LIBRARIES

// Pg-pool 
const Pool = require('pg').Pool;

// Environment variables handling
const dotenv =require('dotenv');

// LOCAL LIBRARIES AND MODULES

// DEFINITIONS
// -----------

// Initialize environment
dotenv.config();

// Read environment variables
const currentEnv = process.env

// Connection settings
const connection = {host: currentEnv.HOST,
    port: currentEnv.DB_PORT,
    database: currentEnv.DB,
    user: currentEnv.APP_USER,
    password: currentEnv.APP_PASSWORD
};

// Create pool object for transactions
const pool = new Pool(connection);
console.log("POOL CREATED");

// CRUD FUNCTIONS

/** 
* A function to insert data into database.
* @summary Allows you to insert data into database with SQL statement and values.
* @async
* @param {string} sqlstatement - SQL statement for inserting data. 
* @param {Array} values - Array of values to be inserted.
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const insertQuery = async (sqlstatement, values) => {
    let resultset = await pool.query(sqlstatement, values);
    return resultset;
} 

/** 
* Select data from database.
* @summary Runs a select query with given SQL statement.
* @async    
* @param {string} sqlstatement - SQL statement for selecting data.
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const selectQuery = async (sqlstatement) => {
    let resultset = await pool.query(sqlstatement);
    return resultset;
}

// TODO: Update data with SQL statement

// TODO:Delete data with SQL statement

// APP SPECIFIC QUERIES
// --------------------
/** 
* Returns web users data by email address.
* @param {string} values - Users email address
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const getWebUserData = async (values) => {
    let sqlstatement = `SELECT * FROM public.webuser WHERE email = $1`;
    let resultset = await pool.query(sqlstatement, values);
    return resultset;
}

/** 
* Get all current vehicles and their status.
* @summary Reads vehicle information from view web_autojen_tila (vehicle status).
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const getVehicleData = async () => {
    let sqlstatement = `Select * FROM public.web_autojen_tila`;
    let resultset = await pool.query(sqlstatement);
    return resultset;
}


// Get vehicles by department
const getVehicleDataByDepartment = async (department) => {
    const sqlstatement = `Select * FROM public.web_autojen_tila WHERE osasto = $1 ORDER BY rekisterinumero`;
    const resultset = await pool.query(sqlstatement, [department]);
    return resultset;
};

// Get vehicle details by register number and department
const getVehicleDetailsByDepartment = async (values) => {
    const sqlstatement = `Select * FROM public.webaktiivinen_ajo WHERE rekisterinumero = $1 AND osasto = $2`;
    const resultset = await pool.query(sqlstatement, values);
    return resultset;
};


/** 
* Get free vehicles from database.
* @summary Returns all rows from view vapaana (free vehicles).
* @async
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const getFreeVehicles = async () => {
    let sqlstatement = `SELECT * FROM public.vapaana`;
    let resultset = await pool.query(sqlstatement);
    return resultset;
}

/** 
* Get vehicles in use from database.
* @summary Returns all rows from view ajossa (vehicles in use).
* @async
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const getVehiclesInUse = async () => {
    let sqlstatement = 'SELECT * FROM public.ajossa';
    let resultset = await pool.query(sqlstatement);
    return resultset;
}

/** 
* Get vehicle details from database.
* @summary Returns details about a vehicle currently in use
* @async
* @param {Array} values - Array of register numbers to be used in the query.
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const getVehicleDetails = async (values) => {
    let sqlstatement = 'SELECT * FROM public.webaktiivinen_ajo WHERE rekisterinumero = $1';
    let resultset = await pool.query(sqlstatement, values);
    return resultset;
}

// Vehicle details page - vehicle in use by register number: SQL + value 2nd method
const query = {
    text: 'SELECT * FROM public.webaktiivinen_ajo WHERE rekisterinumero = $1',
    values: ['XYZ-123']
}
    
/** 
* A generic function to run a query with pre-structured statement and values.
* @summary Executes a SQL query with the provided parameters.
* @param {Object} query - The query object containing SQL clause as text and values as an array of values.
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const runQueryWithValues = async (query) => {
    let resultset = await pool.query(query);
    return resultset;
}
/** 
* Get vehicle diaries from database.
* @summary Returns all rows from view ajopaivakirja (diary).
* @async
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const getDiary = async () => { 
    let sqlstatement = 'SELECT * from public.webajopaivakirja ';
    let resultset = await pool.query(sqlstatement);
    return resultset;
}
/** 
* Get vehicle diaries from database.
* @summary Returns all rows from view ajopaivakirja (diary).
* @async
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const getTaxDiary = async () => { 
    let sqlstatement = 'SELECT * from public.ajopaivakirja_verottaja';
    let resultset = await pool.query(sqlstatement);
    return resultset;
}

/** 
* Get diary by register number.
* @summary Returns diary of a vehicle identified by it's register number.
* @param {Array} register - Register number in string array format.
* @return {Promise} Rows from ajopaivakirja view (diary).
*/

const getVehicleDiary = async (register) => {
    let sqlstatement = 'SELECT * from public.webajopaivakirja WHERE rekisterinumero = $1';
    let resultset = await pool.query(sqlstatement, register);
    return resultset;
}

/** 
* Get vehicle location from database.
* @summary Returns all rows from view sijainti (location).
* @async
* @param {Array} values - Array of register numbers to be used in the query.
* @return {Promise} Returns a promise that resolves to the result set of the query.
*/

const getLocationByReg = async (values) => {
    let sqlstatement = 'SELECT * FROM public.sijainti WHERE rekisterinumero = $1';
    let resultset = await pool.query(sqlstatement, values);
    return resultset;
}

/**
 * Converts PostgreSQL timestamp to user friendly string format.
 * @param {timestamp} timestamp - Timestamp to be converted to string
 * @return {object} Object containing date and time as string.
 */

const convertToDateTimeObject = (timestamp) => {
    let isoTimestamp = timestamp.toISOString();
    let splittedISOTimestamp = isoTimestamp.split('T');
    let splittedTime = splittedISOTimestamp[1].split('.');
    let result = {date: splittedISOTimestamp[0],
        time: splittedTime[0]
    };
    return result;
}

const getDeviceId = async (register) => {
    const sqlstatement = 
        `SELECT deviceid
        FROM public.auto
        WHERE rekisterinumero = $1`
    ;
    const resultset = await pool.query(sqlstatement, [register]);
    return resultset.rows[0]?.deviceid;
};

const getSetting = async (settingName) => {
    const sqlstatement = `
        SELECT arvo
        FROM public.asetus
        WHERE avain = $1
    `;
    const resultset = await pool.query(sqlstatement, [settingName]);
    return resultset.rows[0]?.arvo;
};

const getDiaryTax = async () => {
    let sqlstatement = `SELECT * FROM public.ajopaivakirja_verottaja`;
    let resultset = await pool.query(sqlstatement);
    return resultset;
};

//TODO 19.11.2026 kokeilu testaa ja tarkista headerista saadun datan toimivuus
// Testataan Headerilla APIsta haetun datan tallentamista tietokantaan uusi taulu web_ajapaivakirja

// async function insertWebAjopaivakirja(route) {
//     const startPosition = route.routeStartPosition || {};
//     const stopPosition = route.routeStopPosition || {};

//     // Muodostetaan osoitteet API:n palauttamista tiedoista
//     const startAddress = [
//         startPosition.street,
//         startPosition.houseno,
//         startPosition.zip,
//         startPosition.city,
//         startPosition.country
//     ].filter(Boolean).join(" ");

//     const stopAddress = [
//         stopPosition.street,
//         stopPosition.houseno,
//         stopPosition.zip,
//         stopPosition.city,
//         stopPosition.country
//     ].filter(Boolean).join(" ");

//     const sql = `
//         INSERT INTO public.web_ajopaivakirja (
//             id,
//             device_id,
//             drive_start_id,
//             drive_stop_id,
//             start_time,
//             stop_time,
//             start_lat,
//             start_lon,
//             stop_lat,
//             stop_lon,
//             start_odo,
//             stop_odo,
//             distance,
//             start_address,
//             stop_address,
//             driver_identification,
//             job_number,
//             job_description,
//             raw_data
//         )
//         VALUES (
//             $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
//             $11, $12, $13, $14, $15, $16, $17, $18, $19
//         )
//         ON CONFLICT (id) DO UPDATE SET
//             device_id = EXCLUDED.device_id,
//             drive_start_id = EXCLUDED.drive_start_id,
//             drive_stop_id = EXCLUDED.drive_stop_id,
//             start_time = EXCLUDED.start_time,
//             stop_time = EXCLUDED.stop_time,
//             start_lat = EXCLUDED.start_lat,
//             start_lon = EXCLUDED.start_lon,
//             stop_lat = EXCLUDED.stop_lat,
//             stop_lon = EXCLUDED.stop_lon,
//             start_odo = EXCLUDED.start_odo,
//             stop_odo = EXCLUDED.stop_odo,
//             distance = EXCLUDED.distance,
//             start_address = EXCLUDED.start_address,
//             stop_address = EXCLUDED.stop_address,
//             driver_identification = EXCLUDED.driver_identification,
//             job_number = EXCLUDED.job_number,
//             job_description = EXCLUDED.job_description,
//             raw_data = EXCLUDED.raw_data;
//     `;

//     const values = [
//         route.id,
//         route.deviceId,
//         route.driveStartId,
//         route.driveStopId,
//         route.driveStartTimest,
//         route.driveStopTimest,
//         route.driveStartLat,
//         route.driveStartLon,
//         route.driveStopLat,
//         route.driveStopLon,
//         route.driveStartOdo,
//         route.driveStopOdo,
//         route.driveTotalLen,
//         startAddress,
//         stopAddress,
//         route.driverIdentification,
//         route.jobNumber,
//         route.jobDescription,
//         JSON.stringify(route)
//     ];

//     return await pool.query(sql, values);
// }



// EXPORT FUNCTIONS
// ----------------

// Export all functions and the pool itself. Jest needs the pool to run tests
module.exports = {pool, insertQuery, selectQuery, getFreeVehicles, getVehiclesInUse, getVehicleDetails, getDiary, getTaxDiary, runQueryWithValues, getLocationByReg, getVehicleData, convertToDateTimeObject, getWebUserData, getVehicleDiary, getSetting, getDeviceId, getDiaryTax, getVehicleDataByDepartment,getVehicleDetailsByDepartment, };