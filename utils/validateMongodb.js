const mongoose = require("mongoose");
const validateMongoDbId = (_id) => {
    const isValid = mongoose.Types.ObjectId.isValid(_id);
    if (!isValid) {
        throw new Error("Invalid Id")
    }
}

module.exports = validateMongoDbId