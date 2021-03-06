// Copyright 2018-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-route-keys-connect-disconnect.html
// The $disconnect route is executed after the connection is closed.
// The connection can be closed by the server or by the client. As the connection is already closed when it is executed,
// $disconnect is a best-effort event.
// API Gateway will try its best to deliver the $disconnect event to your integration, but it cannot guarantee delivery.

// const AWS = require('aws-sdk');
const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();
// const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async (req, res) => {
  console.log("req.body", req.body);

  try {
    const docs = await firestore
      .collection("simple-chat-app-connections")
      .where("connectionId", "==", req.body.connectionId)
      .get();

    const b = firestore.batch();

    docs.forEach((d) => {
      b.delete(d.ref);
    });

    await b.commit();
    res.status(200).send("");
  } catch (err) {
    res.status(500).send("");
  }
};
