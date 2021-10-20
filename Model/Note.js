const mongoose = require('mongoose')
const validator = require('validator').default



const NoteSchema = new mongoose.Schema(
  {
    title : {
      required : true,
      validate : {
        validator : function(title) {
          return validator.isAlphanumeric(title)
        }
      }
    },
    description: {
      type : String,
      required : true,
      validate : {
        validator : function(description){
          return validator.isAlphanumeric(description)
        }
      }
    },
    reminder: {
      type : Boolean,
      required : true,
      default : false
    },
    status : {
      type : String,
      enum : ['completed', 'new'],
      default : 'new'
    },
    category: {
      type : String,
      enum : ['work', 'todos', 'technology', 'personal'],
      default : 'todos'
    }
  },
  {
    timestamps: true
  }
)


module.exports = mongoose.model('Note', NoteSchema)