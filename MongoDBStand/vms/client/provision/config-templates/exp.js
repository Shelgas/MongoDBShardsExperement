let MongoClient   = require('mongodb').MongoClient,
  ObjectID      = require('mongodb').ObjectID,
  randomstring  = require('randomstring'),
  _             = require('lodash'),
	readlineSync  = require('readline-sync');
const fs = require('fs')

// Connection URL
let url = 'mongodb://192.168.4.102/test';

function generateEntries(collection, number, valueFieldLength, callback) {
  console.log('Generating entries...');
  let done = _.after(number, callback);
  let ran = randomstring.generate(valueFieldLength);

  
  function nextItem(itemNumber) {
    collection.insertOne({
      itemNumber: itemNumber,
      randomValue: ran,
      shardKey: new ObjectID()
    }, function() {
      itemNumber++;
      if (itemNumber < number) {
        nextItem(itemNumber);
      }
      done();
    });
  }
  
  nextItem(0);
}
function enter() {
  
  let qty = process.argv[2];
  let length = process.argv[3];
  
 
  
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Connected correctly to the server at:');
    console.log(new Date());
    const startTime = new Date().getTime();
    let collection = db.collection('items');
    generateEntries(collection, qty, length, function() {
      console.log('...completed.');
      db.close();
      console.log('Connection closed at:');
      console.log(new Date());
      const endTime = new Date().getTime();
      const resultTime = endTime - startTime;
      const content = `Recording time for quantity ${qty} items and ${length} item size is ${resultTime}ms`

      fs.writeFile('report.txt', content, err => {
        if (err) {
        console.error(err)
        return
        }
    //file written successfully
      })
    });
  });
}

enter();
