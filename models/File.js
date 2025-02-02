const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const fileSchema = new Schema({

    data: Buffer,
    contentType: String,
    filename: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }
});


const File = mongoose.model('File', fileSchema);


module.exports = File;