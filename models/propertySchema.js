const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Property title is required"]
        },
        price: {
            type: Number,
            required: [true, "Property price is required"]
        },
        location: {
            type: String,
            required: [true, "Property location is required"]
        },
        bedrooms: {
            type: Number,
        },
        bathrooms: {
            type: Number,
        },
        images: [{
            type: String,
            default: []
        }],
        status: {
            type: String,
            enum: ["For rent", "For sale"],
            default: "rent"
        },
        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const PROPERTY = mongoose.model("Property", propertySchema);
module.exports = PROPERTY;