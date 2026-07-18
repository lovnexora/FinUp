// ✅ CommonJS Syntax (Fixes Error)
const { model, Schema } = require("mongoose");  

const TransactionSchema = new Schema({
    name: { type: String, required: true },
    price:{type:Number,require:true},
    description: { type: String },
    datetime: { type: Date, required: true },
});

// Use module.exports instead of export
module.exports = model('Transaction', TransactionSchema);   