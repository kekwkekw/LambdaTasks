function fibonacci(n) {
    if (n === 1) {
        return [0, 1]
    }
    else {
        let arr = fibonacci(n - 1)
        arr.push(arr[arr.length - 1] + arr[arr.length - 2]);
        return arr;
    }
}

exports.handler = async (event) => {
    // TODO implement
    let response
    if (event.queryStringParameters) {
        response = {
            statusCode: 200,
            body: JSON.stringify(`Hello, ${event.queryStringParameters.myname}`),
        };
    }
    else {
        response = {
            statusCode: 200,
            body: JSON.stringify(fibonacci(10)),
        };
    }
    return response;
};
