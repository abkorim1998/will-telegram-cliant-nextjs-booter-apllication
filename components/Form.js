import { useState } from 'react';

function Form({ onSubmit, upDownApikey, booterApikey, loader }) {
    

    const [formData, setFormData] = useState({
        status: 'not-running', // running, not-running, error
        isStarred: true,
        url: '',
        port: 80,
        expiresIn: 60,
        method: 'HTTPSV2',
        interval: 15,
    });


    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if(formData.url === '') return alert('please give valid url');

        // gtag_report_conversion("
        console.log(formData);
        const request = await fetch('api/getWebsite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: formData.url,
            }),
        });
        const response = await request.json();
        
        console.log(response.response);
        // find window.open in the response
        // and get the url inside it
        const htmlAsText = response.response;
        var index = htmlAsText.indexOf("window.open");
        if (index !== -1) {
            var start = htmlAsText.indexOf("(", index);
            var end = htmlAsText.indexOf(")", start);
            var url = htmlAsText.substring(start + 1, end);
            console.log(url);
        }





        // add unique id
        onSubmit({
            ...formData,
            id: Date.now(),
            startedAt: Date.now(),
        });
    }

    return (
        <form onSubmit={handleSubmit}>

            <div>
                <div className="formItem">
                    <label htmlFor="url">URL</label>
                    <input type="text" name="url" id="url" value={formData.url} onChange={handleChange} placeholder="URL" />
                </div>

                <div className="formItem">
                    <label htmlFor="port">Port</label>
                    <input type="number" name="port" id="port" value={formData.port} onChange={handleChange} placeholder="port" />
                </div>
            </div>

            <div>
                <div className="formItem">
                    <label htmlFor="expiresIn">Expires In</label>
                    <input type="number" placeholder='Expires In' name="expiresIn" id="expiresIn" value={formData.expiresIn} onChange={handleChange} />
                </div>
                
                <div className="formItem">
                    <label htmlFor="method">Method</label>
                    <select name="method" id="method" value={formData.method} onChange={handleChange}>
                        <option value="HTTPSV2">HTTPSV2</option>
                        <option value="HTTP">HTTP</option>
                        <option value="UDP">UDP</option>
                        <option value="TCP">TCP</option>
                    </select>
                </div>
                <div className="formItem">
                    <label htmlFor="interval">Interval</label>
                    <select name="interval" id="interval" value={formData.interval} onChange={handleChange}>
                        <option value="15">15 sec</option>
                        <option value="30">30 sec</option>
                        <option value="60">1 min</option>
                        <option value="120">2 min</option>
                        <option value="300">5 min</option>
                        <option value="600">10 min</option>
                        <option value="1800">30 min</option>
                        <option value="3600">1 hour</option>
                    </select>
                </div>
                { (upDownApikey !== null &  booterApikey !== null) ? 
                (
                    !loader ? <button type="submit">Submit</button>: <img src="./loading.gif" alt="loaing image" />
                )
                : <p style={{color: 'red'}}>set the apikey first</p>}
            </div>
        </form>
    );
}

export default Form;