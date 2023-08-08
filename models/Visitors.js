import mongoose from 'mongoose';
const { Schema } = mongoose;

// For security, connectionString should be in a separate file and excluded from git
import { connectionString } from "../credentials.js"

mongoose.connect(connectionString, {
    dbName: 'visitor-log',
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('open', () => {
  console.log('Mongoose connected.');
});

// define data model as JSON key/value pairs
// values indicate the data type of each key
const visitorSchema = new Schema({
 fname: { type: String, required: true },
 lname: { type: String, required: true },
 timein: Timestamp,
 timeout: Timestamp,
 date: String,
 company: String
});

export const Visitors = mongoose.model('Visitors', visitorSchema);