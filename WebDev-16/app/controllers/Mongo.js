let MongoClient = require('mongodb').MongoClient

module.exports = async function(name){
    let url = 'mongodb://127.0.0.1:27017/' + name
    const client = await MongoClient.connect(url, {useUnifiedTopology: true})
    console.log("Database connection succeeded")
    let db = client.db(name)
    return db
}
