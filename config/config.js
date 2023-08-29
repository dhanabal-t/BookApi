import { MongoClient } from "mongodb";
import dotenv from "dotenv";


dotenv.config();

let uri=process.env.CONNECTION_URL;

let client = new MongoClient(uri)

export default client;