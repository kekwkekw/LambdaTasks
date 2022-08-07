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
console.log(fibonacci(50))