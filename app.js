let express = require('express');
let app = express();

let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 8500;

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = process.env.MongoUrl;     // local url
// let mongoUrl = process.env.MongoLiveUrl;   // live url
let db;

//middleware
let cors = require('cors');
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    // res.send('Express Server Default');
    res.send('<h1>UltraHack Hackathon API home</h1>')
});

// http://localhost:9200/list-apis
// https://hash-define-api.herokuapp.com/list-apis
app.get('/list-apis', (req, res) => {
    db.listCollections().toArray((err, collInfo) => {
        if (err) throw err;
        let arr = []
        for (c of collInfo)  // for of loop (used in arrays)
            arr.push(c.name);

        res.send(arr);
    });
});

// getEth Values of an existing organization
// http://localhost:9200/getOrgEthValues?orgName=Google
app.get('/getOrgEthValues', (req, res) => {
    let orgName = req.query.orgName;
    let query = { orgName: orgName };

    db.collection('orgEthValues').find(query).toArray((err, result) => {
        if (err) throw err;
        if(result.length > 0) {
            // value found
            res.send(result);
        } else {
            // value not found
            res.send({ message: 'No ethValue found' });
        }
    });
});


// set eth values if org does not exist
// http://localhost:9200/setOrgEthValues?orgName=AWS&ethValue=0.04
app.post('/setOrgEthValues', (req, res) => {
    let orgName = req.query.orgName;
    let ethValue = req.query.ethValue;

    let query = { orgName: orgName };
    db.collection('orgEthValues').find(query).toArray((err, result) => {
        if (err) throw err;
        if(result.length > 0) {
            // value found
            res.send({ message: 'ethValue already exists' });
        } else {
            // value not found
            // insert another value
            db.collection('orgEthValues').insertOne({orgName, ethValue}, (err, result) => {
                if (err) throw err;
                res.send({ message: 'ethValue inserted' });
            });
        }
    });
});



// getEth Values of an organizationType
// http://localhost:9200/getOrgTypeEthValues?orgType=tech
app.get('/getOrgTypeEthValues', (req, res) => {
    let orgType = req.query.orgType;
    let query = { orgType: orgType };

    db.collection('orgTypeEthValues').find(query).toArray((err, result) => {
        if (err) throw err;
        if(result.length > 0) {
            // value found
            res.send(result);
        } else {
            // value not found
            res.send({ message: 'No ethValue found' });
        }
    });
});


// set eth values if organization types that do not exist
// http://localhost:9200/setOrgTypeEthValues?orgType=tech&ethValue=0.04
app.post('/setOrgTypeEthValues', (req, res) => {
    let orgType = req.query.orgType;
    let ethValue = req.query.ethValue;

    let query = { orgType: orgType };
    db.collection('orgTypeEthValues').find(query).toArray((err, result) => {
        if (err) throw err;
        if(result.length > 0) {
            // value found
            res.send({ message: 'ethValue already exists' });
        } else {
            // value not found
            // insert another value
            db.collection('orgTypeEthValues').insertOne({orgType, ethValue}, (err, result) => {
                if (err) throw err;
                res.send({ message: 'ethValue inserted' });
            });
        }
    });
});



// getEth Values of an certificateType
// http://localhost:9200/getCertTypeEthValues?certType=internship
app.get('/getCertTypeEthValues', (req, res) => {
    let certType = req.query.certType;
    let query = { certType: certType };

    db.collection('certTypeEthValues').find(query).toArray((err, result) => {
        if (err) throw err;
        if(result.length > 0) {
            // value found
            res.send(result);
        } else {
            // value not found
            res.send({ message: 'No ethValue found' });
        }
    });
});


// set eth values if certificates types that do not exist
// http://localhost:9200/setCertTypeEthValues?certType=internship&ethValue=0.04
app.post('/setCertTypeEthValues', (req, res) => {
    let certType = req.query.certType;
    let ethValue = req.query.ethValue;

    let query = { certType: certType };
    db.collection('certTypeEthValues').find(query).toArray((err, result) => {
        if (err) throw err;
        if(result.length > 0) {
            // value found
            res.send({ message: 'ethValue already exists' });
        } else {
            // value not found
            // insert another value
            db.collection('certTypeEthValues').insertOne({certType, ethValue}, (err, result) => {
                if (err) throw err;
                res.send({ message: 'ethValue inserted' });
            });
        }
    });
});


// -----------------------------------------------------------------------------------------
// insert data
    // {
    //     "email": "pawan@gmail.com",
    //     "orgName": "Geeks For Geeks",
    //     "orgType": "Tech",
    //     "certificateType": "Course Completion",
    //     "certificateFor": "DSA Self Paced",
    //     "personName": "John Doe",
    //     "timeDuration": "2 months",
    //     "validTill": "2 years"
    // }
// http://localhost:9200/addCertificates
// https://hash-define-api.herokuapp.com/addCertificates

app.post('/addCertificates', (req, res) => {
    let email = req.body.email;
    let orgName = req.body.orgName;
    let orgType = req.body.orgType;
    let certificateType = req.body.certificateType;
    let certificateFor = req.body.certificateFor;
    let personName = req.body.personName;
    let timeDuration = req.body.timeDuration;
    let validTill = req.body.validTill;
    let newCertificate = [{"orgName":orgName, "orgType":orgType, "certificateType":certificateType, "certificateFor":certificateFor, "personName":personName, "timeDuration":timeDuration, "validTill":validTill}];
    
    console.log(email, newCertificate)

    let data = {email, newCertificate};
    query = {email: email};
    db.collection('certificates').find(query).toArray((err, result) => {
        if(result.length > 0) {
            // update required
            let oldCertificate = result[0].newCertificate;
            oldCertificate.push(newCertificate[0]);
            newCertificate = oldCertificate;

            console.log('data need to be updated');
            db.collection('certificates').updateOne(
                {email: email},
                {
                    $set:{
                        "newCertificate": newCertificate
                    }
                }, (err, result) => {
                if(err) throw err;
                // res.send(result);
                res.status(200).send(`Order ${orderId} Updated`);
            });
            res.send('data appended!!')
        }
        // if not exists then add
        else {
            db.collection('certificates').insertOne(data, (err, result) => {
                if(err) throw err;
                console.log('adding')
                res.send(`Data added with Object id: ${result.insertedId}`)
            })
        }
    })
});

// getCertificate api
// https://hash-define-api.herokuapp.com/getCertificates

app.get('/getCertificates', (req, res) => {
    let email = req.query.email;

    db.collection('certificates').find({}).toArray((err, result) => {
        if(err) throw err;
        if(result.length > 0) {
            res.send(result);
        } else {
            res.send({message: 'No data found'});
        }
    })
});


// update the db with eth value based on email
// https://hash-define-api.herokuapp.com/updateEthValue?email=sayan@gmail.com&ethValues=[0.1,0.4,0,0]
app.post('/updateEthValue', (req, res) => {
    let email = req.query.email;
    let ethValues = req.query.ethValues;

    db.collection('certificates').find({email: email}).toArray((err, result) => {
        if(err) throw err;
        if(result.length > 0) {
            newValues = "";
            if(result[0].ethValues) {
                tmp = JSON.parse('[' + result[0].ethValues + ']');
                ethValues = JSON.parse('[' + ethValues + ']');
                newValues = [tmp[0] + ethValues[0], tmp[1] + ethValues[1], tmp[2] + ethValues[2], tmp[3] + ethValues[3]];
            } else {
                newValues = JSON.parse('[' + ethValues + ']');
            }

            db.collection('certificates').updateOne(
                {email: email},
                {
                    $set:{
                        "ethValues": newValues
                    }
                }, (err, result) => {
                if(err) throw err;
                // res.send(result);
                res.status(200).send(`Eth values Updated`);
            });
        } else {
            res.send({message: 'No data found'});
        }
    })
    // res.send('data appended!!')
});



// connect to database
MongoClient.connect(mongoUrl, (err, client) => {
    if (err) console.log("Error while connecting");

    db = client.db('ultrahack');        // dbname

    app.listen(port, (err) => {
        if (err) throw err;
        console.log('Express server listening on port' + port);
        console.log('http://localhost:' + port);
    });
});

