const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    userName: {
        type: String,
        require: true,
    
    },
    email: {
        type: String,
        require: true,    
    },
    password: {
        type: String,
        require: true,    
    },
    image: {
        type: String, // This will store the path or URL to the employee's image
        required: true,
    },
    pin: {
        type: Number,
        required: true,
    },
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;