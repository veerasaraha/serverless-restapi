const mongoose = require('mongoose')
const validator = require('validator').default



const noteSchema = new mongoose.Schema(
  {
    title : {
      type: String,
      required : true,
    },
    description: {
      type : String,
      required : true,
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


module.exports = mongoose.model('Note', noteSchema)