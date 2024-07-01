/**
 * name : findDuplicateRecords.js
 * author : Saish Borkar
 * created-date : 1 Jul 2024
 * Description : Finds duplicate records from project collection having same solutionId and userId
 */

const path = require("path");
let rootPath = path.join(__dirname, "../../");
require("dotenv").config({ path: rootPath + "/.env" });
const {validate : uuidValidate,v4 : uuidV4} = require('uuid');
let _ = require("lodash");
let mongoUrl = process.env.MONGODB_URL;
let dbName = mongoUrl.split("/").pop();
let url = mongoUrl.split(dbName)[0];
var MongoClient = require("mongodb").MongoClient;

var fs = require("fs");

(async () => {
  let connection = await MongoClient.connect(url, { useNewUrlParser: true });
  
  
  let db = connection.db(dbName);

  try {
    let pipeline = [
      {
        $match: {
          userId: { $exists: true, $ne: null },
          solutionId: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: { solutionId: "$solutionId", userId: "$userId" },
          count: { $sum: 1 },
          docs: { $push: "$$ROOT" },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          duplicateCount: "$count",
          duplicateArray: "$docs",
        },
      },
    ];
    let duplicateArray = await db
      .collection("projects")
      .aggregate(pipeline)
      .toArray();

    if(duplicateArray.length > 0){
        console.log('Duplicates records are present in the projects collection.')
    }
    else {
        console.log('Duplicates records are NOT present in the projects collection.')
    }

    connection.close();
  } catch (error) {
    console.log(error);
  }
})().catch((err) => console.error(err));