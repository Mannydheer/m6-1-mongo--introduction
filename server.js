'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { getCollection } = require('./exercises/exercise-1-2');
const { createGreeting, getGreeting, getMoreGreetings } = require('./exercises/exercise-2')
const { batchImport } = require('./batchImport');





const PORT = process.env.PORT || 8000;


express()
  .use(morgan('tiny'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use('/', express.static(__dirname + '/'))

  // exercise 1
  .get('/ex-1/:dbName/:collection', getCollection)

  //

  //collection is greetings
  .post('/ex-2/:dbName/:collection', createGreeting)
  //insert many
  .post('/batchImports/:dbName/:collection', batchImport)
  //getGreeting. 
  .get('/ex-2-greeting/:_id', getGreeting)
  //more greetings. 
  .get('/ex-2-more-greeting', getMoreGreetings)



  // exercise 2

  // handle 404s
  .use((req, res) => res.status(404).type('txt').send('🤷‍♂️'))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
