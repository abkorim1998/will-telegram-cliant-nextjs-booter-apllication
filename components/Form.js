import { useState } from 'react';

function Form({ onSubmit }) {

    const [formData, setFormData] = useState({
        status: 'not-running', // running, not-running, error
        isStarred: true,
        url: '',
        port: 80,
        expiresIn: 60,
        method: 'HTTPSV2',
        interval: 30,
    });


    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        // add unique id
        onSubmit({
            ...formData,
            id: Date.now(),
            startedAt: Date.now(),
        });
    }

    return (
        <form onSubmit={handleSubmit}>

            <label htmlFor="url">URL</label>
            <input type="text" name="url" id="url" value={formData.url} onChange={handleChange} />

            <label htmlFor="port">Port</label>
            <input type="text" name="port" id="port" value={formData.port} onChange={handleChange} />

            <label htmlFor="expiresIn">Expires In</label>
            <input type="number" name="expiresIn" id="expiresIn" value={formData.expiresIn} onChange={handleChange} />

            <label htmlFor="method">Method</label>
            <select name="method" id="method" value={formData.method} onChange={handleChange}>
                <option value="HTTPSV2">HTTPSV2</option>
                <option value="HTTP">HTTP</option>
                <option value="UDP">UDP</option>
                <option value="TCP">TCP</option>
            </select>
            

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
            <button type="submit">Submit</button>
        </form>
    );
}

export default Form;