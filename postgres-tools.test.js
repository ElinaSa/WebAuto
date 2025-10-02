// TESTS FOR MODULE POSTGRES-TOOLS IN A SINGLE FILE
// ================================================

// IMPORT THE MODULE TO BE TESTED
// ------------------------------

// Custom module to make queries from PostgreSQL databases
const pgTools = require('./postgres-tools')

// Container function to include several test functions
describe('postgres-tools functions testing', () => {
  
    // 1st test for selectQuery function
    test('selectQuery test', () => {

        // Define a SQL statement to be used
        let sqlstatement = 'SELECT * FROM jest_test';
        
        // Define a lists of objecst with correct properties
        let correctResultset = [
      {
        id: 2,
        nimi: 'Jakke Jäynä',
        palkka: 2388.5,
        koodari: true,
        aikaleima: '2025-09-29T08:10:22.459Z'
      },
      {
        id: 4,
        nimi: 'Calle Keckelberg',
        palkka: 7650,
        koodari: false,
        aikaleima: '2025-09-29T08:15:05.275Z'
      }
    ];
        // Run the query and wait for the results
        pgTools.selectQuery(sqlstatement).then((resultset) => {
    
            // Because rows are objects use toEqual for comparison: properties
            // are the same, but objects are different objects
            expect(resultset.rows).toEqual(correctResultset);
        });
        
  });
 
    // 2nd test for runQueryWithValues function
    test('runQueryWithValues test', () => {
      // Define a SQL statement to be used
        let query = {
            text:'SELEC * FROM jest_test WHERE id = $1',
            value: [4]
        };
        
        // Define the properties of an object to compare against
        let correctResultset = {
        id: 4,
        nimi: 'Calle Keckelberg',
        palkka: 7650,
        koodari: false,
        aikaleima: '2025-09-29T08:15:05.275Z'
        };
    
        // Run the query and wait for the results
        pgTools.runQueryWithValues(query) .then((resultset) => {
    
            // Because rows are objects use toEqual for comparison: properties
            // are the same, but objects are different objects
            expect(resultset.rows[0]).toEqual(correctResultset);
        });
  });
})
