require('dotenv').config({path: './.env'})


const validator = require('validator').default
const { connectDB } = require('./config/db')
const Note = require('./Model/Note')



'use strict';



//Error Response Helper
const createErrorResponse = (statusCode, message) => ({
  statusCode : statusCode || 501,
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    error: message || 'An error occured'
  })
})


const returnError = (error, callback) => {
  if(error.name){
    const message = `Invalid ${error.name}: ${error.message}`;
    callback(null, createErrorResponse(400, `Error:: ${message}`))
  } else {
    callback(
      null,
      createErrorResponse(error.statusCode || 500, `Error:: ${error.name}`)
      )
  }
}

// SAMPLE ENDPOINT
module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

// NOTES CURD //

module.exports.create = async (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false

  if(!event.body){
    return callback(null, createErrorResponse(400, 'Missing details'))
  }

  const {title , description, reminder, status, category} = JSON.parse(event.body)

  const noteObj = new Note({
    title,
    description,
    reminder,
    status,
    category
  })

  

  if(noteObj.validateSync()){
    return callback(null, createErrorResponse(400, 'Incorrect note details'))
  }
  


  try {
    await connectDB()
    console.log(noteObj)
    const note = await Note.create(noteObj)

    callback(null, {statusCode : 200, body: JSON.stringify(note)})

  } catch (error) {
    returnError(error, callback)
  }
}


module.exports.getOne = async (event, context , callback)=> {
  context.callbackWaitsForEmptyEventLoop = false

  const id = event.pathParameters.id

  if(!validator.isAlphanumeric(id)){
    return callback(null, createErrorResponse(400, 'Invalid note ID'))
  }

  try {
    await connectDB()
    const note = await Note.findById(id);

    if(!note){
      return callback(null, createErrorResponse(404, `No Note foud with id : ${id}`))
    }


    callback(null, {
      statusCode : 200,
      body : JSON.stringify(note)
    })
  } catch (error) {
    returnError(error)
  }
}


module.exports.getAll = async (event,context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    await connectDB()
    const notes = await Note.find();

    if(!notes){
      return callback(null, createErrorResponse(404, ' No Notes found'))
    }

    callback(null, {
      statusCode : 200,
      body : JSON.stringify(notes)
    })

  } catch (error) {
    returnError(error)
  }
}


module.exports.update = async (event, context, callback)=> {
  context.callbackWaitsForEmptyEventLoop = false

  const data = JSON.parse(event.body)

  if(!validator.isAlphanumeric(event.pathParameters.id)){
    return callback(null, createErrorResponse(400 , 'Invalid note ID'))
  }

  if(!data){
    return callback(null, createErrorResponse(400, 'Missing details'))
  }


  const {title, description, reminder, status, category} = data

  try {
    await connectDB()

    const note = await Note.findById(event.pathParameters.id)

    if(note){
      note.title = title || note.title
      note.description = description || note.description
      note.reminder = reminder || note.reminder
      note.status = status || note.status
      note.category = category || note.category
    }

    if(note.validateSync()){
      return callback(null, createErrorResponse(400, 'Incorrect note details'))
    }

    const newNote = await note.save()

    callback(null, {
      statusCode: 204,
      body: JSON.stringify(newNote)
    })

  } catch (error) {
    returnError(error) 
  }
}



module.exports.delete = async (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false
  const id = event.pathParameters.id

  if(!validator.isAlphanumeric(id)){
    return callback(null, createErrorResponse(400, 'Invalid note ID'))
  }

  try {
    await connectDB()
    const note = await Note.findByIdAndRemove(id)

    callback(null,{
      statusCode: 200,
      body : JSON.stringify({
        message : `Deleted note with id: ${id}`,
        note
      })
    })
  } catch (error) {
    returnError(error)
  }
}