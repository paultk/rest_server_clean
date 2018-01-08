var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var con;



const CLEAR_DB = {
    host: "us-cdbr-iron-east-05.cleardb.net",
    user: "b3e5317d7ab7f8",
    password: "09467e44",
    database: 'heroku_c93b5837c0d67be'
}

const LATITUDE = 'latitude'
const LONGITUDE = 'longitude'

const query = (con, values) => {
    return new Promise (resolve => {
        let sentence = `SELECT *
FROM locations
WHERE
  ABS(longitude - ${con.escape(values[LONGITUDE])}) < 0.1
AND
    ABS(latitude - ${con.escape(values[LATITUDE])}) < 0.1
;`
        con.query(sentence, (err, results, fields) => {
        console.log('errors: ', err)

    /*     console.log(`results:\n${results}`)
         console.log(`fields:\n${fields}`)

         // results = results[0]
         results.forEach( result => {
                 for (const key of Object.keys(result)) {
                     console.log(`key: ${key}\nValue: ${result[key]}`)
                 }
             }
         )*/
    // con.end()
    resolve(results)

    // return results
})
})

}

const insert = (con, values) => {

    let sentence = `insert into sensor_reading (${LONGITUDE}, ${LATITUDE})
    values(${con.escape(values[LONGITUDE])}, ${con.escape(values[LATITUDE])})`
    con.query(sentence, (error, resultSet, fields) => {
        // console.log(resultSet)
        console.log(error)
    // con.end()
})
}


const dbQuery = (callback, values) => {
    return new Promise(resolve => {

        if (!con || con.state === 'disconnected') {
        con = mysql.createConnection(
            CLEAR_DB
        );
        con.connect(function (err) {
            // if (err) throw err;
            dbQuery(callback, values)
        })
    } else {
        console.log("Connected!");
        resolve(callback(con, values))
    }

})

}
let values = {};
values[LONGITUDE] = 52.3644
values[LATITUDE] = 4.913299


/* GET home page. */
router.get('/', function(req, res, next) {
    try {
        dbQuery(insert, values)
        dbQuery(query, values )
            .then( val1 => {
            console.log('val1', val1)
        res.send(JSON.stringify(val1))
    })
    } catch (err) {
        console.log('err')
    }

    // res.render('index', { title: 'Express' });
});

router.post('/', (req, res, next) =>{

    /*
        req = req['body']
        for (const key of Object.keys(req)) {
            console.log(req[key])
        }
        // console.log(`req\n${req}`)
        res.send(JSON.stringify({something: "something"}))
    */


    try {
        dbQuery(insert, values)
        dbQuery(query, values )
        .then( val => {
        console.log('val', val)
    res.send(JSON.stringify(val))
})
} catch (err) {
    console.log('err')
}

// res.render('index', { title: 'Express' });

})

module.exports = router;