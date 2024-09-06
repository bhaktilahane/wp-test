const mongoose = require('mongoose');
const { Schema } = mongoose;

const offsiteAttendanceSchema = new Schema({
    emp_id: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    offsiteStatus: {
        type: String,
        require: true,
    
    },
    latestCheckin: {
        type: Date,
    },
    latestCheckout: {
        type: Date,
    },
    date: {
        day: {
            type: Number,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
    },
  
   
    
});

const Employee = mongoose.model('OffsiteAttendance', offsiteAttendanceSchema);
module.exports = Employee;
