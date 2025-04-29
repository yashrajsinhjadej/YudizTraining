const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/')
.then(()=>{console.log('mongodb connected')})
.catch(()=>{console.log('error occured')})

const obj = {
    name : {
        type:String,
        require:true 
    },
    age:{
        type:Number,
        require:true
    },
    fitness_goals:String
}

// Use 'new' keyword to create the schema
const parakram = new mongoose.Schema(obj)

const User = mongoose.model('user', parakram)

const merge1 = new User(     
    {
         name:"Puthi",
         age:10,
         fitness_goals:"weight loss"
    }
)

merge1.save()
    .then(() => console.log('Document saved successfully'))
    .catch((err) => console.error('Error saving document:', err));
