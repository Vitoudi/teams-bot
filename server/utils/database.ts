import * as mongoose from 'mongoose'

export const dbUri =
  "mongodb://vitoudi_:vespadomar0@cluster0-shard-00-00.ma580.mongodb.net:27017,cluster0-shard-00-01.ma580.mongodb.net:27017,cluster0-shard-00-02.ma580.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-130s3p-shard-0&authSource=admin&retryWrites=true&w=majority";

export const mongooseConnection = mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})

export const db = mongoose.connection