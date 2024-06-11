const mongoose = require('mongoose');

const patternSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
            return /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
        },
    },
    type: {
        type: String,
        default: null, // Optional field
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    }, {
    timestamps: true
});

const Pattern = mongoose.model('Pattern', patternSchema);

module.exports = Pattern;
