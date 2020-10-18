// Copyright 2018-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// const AWS = require('aws-sdk');

// const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });
const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();

exports.handler = async (req, res) => {
  try {
    console.log(req.path);
    console.log("connect handler", req.body);
    // console.log("connect headers", req.headers);
    // console.log("connect req", req);
    await firestore
      .collection("simple-chat-app-connections")
      .doc()
      .create({ connectionId: req.body.connectionId });
    res.status(200).send("");
  } catch (err) {
    res.status(500).send("");
  }
};
