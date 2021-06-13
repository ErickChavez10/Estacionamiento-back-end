const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkingSchema = new Schema({
    name:              {type: String }, 
    auto:              {type: String },
    email:             {type: String }, 
    timeStart:         {type: Date,  },
    timeEnd:           {type: Date, default: null   },
    createdAt:         {type: Date, default: Date.now()   }
});

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;
