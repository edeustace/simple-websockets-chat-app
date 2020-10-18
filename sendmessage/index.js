const { Firestore } = require("@google-cloud/firestore");
const util = require("util");
const centra = require("centra");
const AWS = require("aws-sdk");

const fs = new Firestore();

exports.handler = async (req, res) => {
  console.log("req.body:", req.body);

  const domainName = req.body.domainName;
  const stage = req.body.stage;

  const coll = fs.collection("simple-chat-app-connections");
  const sn = await coll.get();
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: domainName + "/" + stage,
    region: "us-east-2",
  });

  await Promise.all(
    sn.docs.map(async (sn) => {
      const connectionId = sn.data().connectionId;

      try {
        const postData = JSON.stringify({
          action: "message",
          message: req.body.data.data,
        });
        await apigwManagementApi
          .postToConnection({ ConnectionId: connectionId, Data: postData })
          .promise();
      } catch (e) {
        if (e.statusCode === 410) {
          console.log(`Found stale connection, deleting ${connectionId}`);
          await sn.ref.delete();
        } else {
          throw e;
        }
      }

      // const callbackUrl = util.format(
      //   util.format(
      //     "https://%s/%s/@connections/%s",
      //     domain,
      //     stage,
      //     connectionId
      //   )
      // );

      // console.log("url:", callbackUrl);
      // const response = await centra(callbackUrl, "POST")
      //   .body({ message: req.body.data.data }, "json")
      //   .send();

      // console.log("response.statusCode:", response.statusCode);

      // if (response.statusCode === 410) {
      //   console.log(`Found stale connection, deleting ${connectionId}`);
      //   await sn.ref.delete();
      // }
    })
  );

  res.send("");
};
