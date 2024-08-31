const {mongoose} = require ("mongoose");

const dbConnect = () => {
    try{
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log("database connected");
    
}catch(error){
    console.log("database error", error)
}
}

module.exports = dbConnect;