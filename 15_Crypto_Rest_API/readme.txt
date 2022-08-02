All info is obtained with GET https://crypto-api-lambda.herokuapp.com/get request, with the next parameters:

symbol: - required
    symbol of cryptocurrency you wish to obtain info for.
market: - optional
    one of 5 markets you are specifically interested in.
    Format: just the name of the market, for example, "coinpaprika".
    If there are none, calculate the average price among all 5.
startDate and endDate: -optional
    period, in which you wish to know the prices of coins.
    Format: string 'YYYY-MM-DD HH:MM:SS' in the UTC-0, for example '2022-07-30 16:45:00'. Note that in links '%' symbol used as space.
    If there are none, returns the most 'fresh' result

Example: https://crypto-api-lambda.herokuapp.com/get?symbol=BTC&startDate=2022-07-30%2016:35:00&endDate=2022-08-30%2016:45:00
