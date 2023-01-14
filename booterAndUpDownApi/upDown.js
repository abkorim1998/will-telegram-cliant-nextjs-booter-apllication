export async function getUpDownAccountInfo(apikey) {
    // send a get request to the server to updown.io api to get the account info
    // api key is in the header X-API-KEY 
    const response = await fetch('https://updown.io/api/recipients', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-API-KEY": apikey,
        },
    });
    return await response.json();
}

export async function addUrlToUpDown(apikey, url, period = 120) {
    const response = await fetch('https://updown.io/api/checks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-API-KEY": apikey,
        },
        body: JSON.stringify({
            "url": url,
            "period": period,
        }),
    });    

    return await response.json();
};

//get url list
export async function getUpDownUrlsList(apikey) {
    const response = await fetch('https://updown.io/api/checks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-API-KEY": apikey,
        },
    });

    return await response.json();
}

// check single 
export async function getUpDownSingle(apikey, token) {
    const response = await fetch(`https://updown.io/api/checks/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-API-KEY": apikey,
        },
    });

    return await response.json();
}

export async function deleteUpDownItem(apikey, token) {
    const response = await fetch('https://updown.io/api/checks/' + token, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "X-API-KEY": apikey,
        },
    });
    return await response.json();
}
