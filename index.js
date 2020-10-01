'use strict';

//base URL for the API request  
const searchURL = 'https://api.coingecko.com/api/v3/coins/markets';

//function to format query parameters to complete the API request URL
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

// function to display API response results
function displayResults(responseJson, coinAinput) {
    // if there are previous results, remove them
    $('.results').empty();

    // define placeholder for CoinA and CoinB data pulled from API based on coin names entered by user
    let coinA = {};
    let coinB = {};

    // assigns the data pulled to the coin variables based on how they were entered in the input fields. This breaks up the alphabetical order the API responds with
    if (coinAinput == responseJson[0].id) {
        coinA = responseJson[0];
        coinB = responseJson[1];
    } else {
        coinB = responseJson[0];
        coinA = responseJson[1];
    }

    // changes price data to an integer then executes ratio formula based CoinA / CoinB
    let ratio = Number(coinA.current_price) / Number(coinB.current_price);
    console.log(ratio);

    // sets the decimal place of the ratio to the 10th
    let ratioTwoDecimalPlaces = ratio.toFixed(2);

    // changes price data to an integer and assigns value of the spread formula based on  CoinA - CoinB * Ratio
    let spread = Number(coinA.current_price) - Number(coinB.current_price) * Number(ratioTwoDecimalPlaces);

    // sets the decimal place of the spread to the 10th
    let spreadTwoDecimalPlaces = spread.toFixed(2);

    // assigns visual representation of the formula to the variable
    let formulaVisual = `${coinA.symbol} - ${coinB.symbol} *` + `  ${ratioTwoDecimalPlaces}`;

    $("h2#js-ratio").append(`<h2>${ratioTwoDecimalPlaces}</h2>`);
    $("h2#js-formula").append(`<h2 class="coin-symbol-formula">${formulaVisual}</h2>`);
    $("h2#js-spread").append(`<h2> ${spreadTwoDecimalPlaces} </h2>`);

    //display the results section  
    $('#results').removeClass('hidden');

    //generate Coin Market Data
    $(".js-coin-market-data").html(generateCoinMarketDataHtml(coinA, coinB));
    return;
};


function getCoins(coinA, coinB) {
    const params = {
        vs_currency: "usd",
        ids: coinA + "," + coinB,
        order: "market_cap_desc",
        per_page: "2",
        page: "1",
        sparkline: "false"
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
    console.log(url);



    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson[0].id == null) {              
                throw console.log('incorrect coin name');
            } else {
                displayResults(responseJson, coinA)        }
        })
        .catch(error => alert(`can't find that pair, please try again`))
}

function watchForm() {
    //listen for submit 
    $('#js-form').submit(event => {
        event.preventDefault();
        //Accept value and submit
        const coinAinput = $('#js-coin-a').val();
        const coinBinput = $('#js-coin-b').val();
        console.log(coinAinput);
        console.log(coinBinput);
        getCoins(coinAinput, coinBinput);
    });
}

function generateCoinMarketDataHtml(coinA, coinB) {
    console.log(coinA);
    console.log(coinB);
    return `
    <section class='coin-container'>
        <div class='coin-row'>
            <div class='coin'>
                <h3>Coin</h3>              
            </div>
            <div class='coin-market-data'>
                <h3 class='coin-symbol-title'>Symbol</h3>
                <h3 class='coin-price-title'>Price</h3>
                <h3 class='coin-volume-title'>Volume</h3>
                <h3 class='coin-percent-title'>Price Ch. %</h3>
                <h3 class='coin-market-cap-title'>Coin Mkt. Cap</h3>
            </div>
        </div>    
    </section>

    <section class='coin-container'>
        <div class='coin-row'>
            <div class='coin'>
                <img src=${coinA.image} alt='crypto' />
                <h1>${coinA.name}</h1>              
            </div>
            <div class='coin-market-data'>
                <p class='coin-symbol'>${coinA.symbol.toUpperCase()}</p>
                <p class='coin-price'>${coinA.current_price}</p>
                <p class='coin-volume'>${coinA.total_volume.toLocaleString()}</p>
                <p class='coin-percent'>${coinA.price_change_percentage_24h.toFixed(2)}</p>
                <p class='coin-market-cap'>${coinA.market_cap.toLocaleString()}</p>
            </div>
        </div>    
    </section>

    <section class='coin-container'>
        <div class='coin-row'>
            <div class='coin'>
                <img src=${coinB.image} alt='crypto' />
                <h1>${coinB.name}</h1>              
            </div>
             <div class='coin-market-data'>
                <p class='coin-symbol'>${coinB.symbol.toUpperCase()}</p>
                <p class='coin-price'>${coinB.current_price}</p>
                <p class='coin-volume'>${coinB.total_volume.toLocaleString()}</p>
                <p class='coin-percent'>${coinB.price_change_percentage_24h.toFixed(2)}</p>
                <p class='coin-market-cap'>${coinB.market_cap.toLocaleString()}</p>
            </div>
        </div>    
    </section>
    `}

$(function () {
    console.log('App loaded! Waiting for submit!');
    watchForm();
});
