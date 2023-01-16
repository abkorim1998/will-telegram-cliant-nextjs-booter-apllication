import { scanUrl } from 'booterAndUpDownApi/ablibary';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

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

    // scaning section
    const [isScaning, setIsScaning] = useState(false);
    const [isScanLoading, setIsScanLoading] = useState(false);
    const [scaningData, setScaningData] = useState([]);
    const [possibleUrl, setPossibleUrl] = useState('');
    const [manualeURL, setManualeURL] = useState('');

    async function handleScaning(event) {
        event.preventDefault();
        setIsScaning(true);

        if(formData.url === '') return alert('please give valid url');
        if(!formData.url.includes('http')) formData.url = 'https://' + formData.url;

        // gtag_report_conversion("
        console.log(formData);
        setIsScanLoading(true);
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
        setIsScanLoading(false);

        const removeAbleWord = ['"', "'",  ]; // add more if you want
        const regex = /https?:\/\/[^\s]+/g;
        const found = response.response.match(regex);

        // clean the url by removing the words in removeAbleWord
        // remeber if have " or ' then end the url
        const cleanFound = found.map((url) => {
            removeAbleWord.forEach((word) => {
                if(url.includes(word)) {
                    url = url.substring(0, url.indexOf(word));
                }

                if(url.includes('"')) {
                    url = url.substring(0, url.indexOf('"'));
                }
            });
            return url;
        });

        // scaning data
        setScaningData(cleanFound);

        // possible url
        const url = scanUrl(response.response);
        if(url !== '')
            setPossibleUrl(url);
        else
            setPossibleUrl('no url found');
    }

    const handleSubmit = (url) => (e) => {
        e.preventDefault();

        if(url.includes('http')) {
            console.log(url);
            // add unique id
            console.log({
                ...formData,
                id: Date.now(),
                startedAt: Date.now(),
                url: url,
            });
            
            onSubmit({
                ...formData,
                id: Date.now(),
                startedAt: Date.now(),
                url: url,
            });

            // reset all the form
            setFormData({
                status: 'not-running', // running, not-running, error
                isStarred: true,
                url: '',
                port: 80,
                expiresIn: 60,
                method: 'HTTPSV2',
                interval: 15,
            });
            setIsScaning(false);
            setScaningData([]);
            setPossibleUrl('');
            setManualeURL('');
        } else {
            alert('please give valid url');
        }
    }

    // if click outside the scaning section then close it
    const handleClick = (e) => {
        if(e.target.className === 'scaningSectionWrapper') {
            setIsScaning(false);
        }
    }

    return (
        <>  
            {isScaning && (<div className="scaningSectionWrapper" onClick={handleClick}>
                <div className="scaningSection">
                    {isScanLoading && <img className='loadingImage' src="./loading.gif" alt="" />}
                    <button className='closeBtn' onClick={() => setIsScaning(false)} ><CloseIcon fontSize="large" /></button>
                    <h2>scanning data</h2>
                    <ul>
                        {scaningData.map((url, index) => {
                            return <li style={{background: url.includes('gclid')?'#c19038':''}} onClick={handleSubmit(url)} key={index}>{url}</li>
                        })}
                    </ul>
                    <br />
                    <h2>possible url</h2>
                    <p className='possibleurl' onClick={handleSubmit(possibleUrl)}>{possibleUrl}</p>
                    <br />
                    <form className="manual-section" onSubmit={handleSubmit(manualeURL)}>
                        <input type="text" placeholder='give url manualy' value={manualeURL} onChange={(e)=>setManualeURL(e.target.value)} />
                        <button className='addBtn' type='submit'>add</button>
                    </form>
                </div>
            </div>)}
            <form onSubmit={handleScaning}>
                <div>
                    <div className="formItem">
                        <label htmlFor="url">Give Scanning URL</label>
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
        </>
    );
}

export default Form;