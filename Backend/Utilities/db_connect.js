const mongoose=require('mongoose')




const dbConnect=async ()=>{
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log("db connected")
  } catch (error) {
    console.log("err=",error)
  }
}

exports.dbConnect=dbConnect

