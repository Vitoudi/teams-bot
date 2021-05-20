import mongoose from 'mongoose'

export const dbUri = process.env.DB_URI!

export const mongooseConnection = mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})

export const db = mongoose.connection