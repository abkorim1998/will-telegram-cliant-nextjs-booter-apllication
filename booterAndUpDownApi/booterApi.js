// https://darlingapi.com/?key=13f1cffe6a828d73bd7f7bf6-28097a6a&host=[host]&port=[port]&time=[time]&method=[method]
export async function sendBooterRequest({apikey, host, port, time, method}={}) {
    const url = `https://darlingapi.com/?key=${apikey}&host=${host}&port=${port}&time=${time}&method=${method}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }});

    return await response.json();
};