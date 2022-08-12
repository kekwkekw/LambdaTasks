'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hello, ${event.queryStringParameters.myname}!`,
      },
      null,
      2
    ),
  };
};
