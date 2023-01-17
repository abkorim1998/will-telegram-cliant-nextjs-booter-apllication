import React, { useEffect, useState } from 'react'


import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import HideSourceIcon from '@mui/icons-material/HideSource';
import TimerIcon from '@mui/icons-material/Timer';

import { getUpDownSingle } from 'booterAndUpDownApi/upDown';

function Item({upDownApikey, booterApikey, itemData, handleDelete, handleUpdate}) {
    const [ItemData, setItemData] = useState(null);
    const [upDownInfo, setUpDownInfo] = useState(null);


    // get updown info
    // --------------------------------------
    useEffect(() => {
        // setItemData(itemData);
        // if (itemData.status === "error") {
        //    setItemData({...itemData, isStarred: false});
        // }else {
        // }
        setItemData(itemData);
        const interval = setInterval( async() => {
            const info = await getUpDownSingle(upDownApikey, itemData.updownToken);
                console.log(info);
            setUpDownInfo(info);
        }, parseInt(itemData.interval) * 1000);

        return () => clearInterval(interval);
    }, [itemData, upDownApikey]);

   
    // time counter
    // --------------------------------------
    const [time, setTime] = useState(0);
    const expireTimeCounter = (from, to) => {
        const now = new Date().getTime();
        const expireTime = from + to * 1000;
        const timeLeft = expireTime - now;
        if (timeLeft < 0) {
            return 0;
        }else {
            return Math.floor(timeLeft / 1000);
        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
            const timeLeft = expireTimeCounter(itemData.startedAt, itemData.expiresIn);
            // if timeLeft === 0 and itemData.isStarred === true then call handleUpdate
            if (timeLeft === 0 && itemData.isStarred) {
                handleUpdate(itemData.id, {...itemData, isStarred: false});
            }
            setTime(timeLeft);
        }, 1000);
        return () => clearInterval(interval);
    }, [itemData, handleUpdate]);



    // if itemData.status === "error"
    // change the isStarred to false
    // --------------------------------------
    // useEffect(() => {
    //     if (itemData.status === "error") {
    //         handleUpdate(itemData.id, {...itemData, isStarred: false});
    //     }
    // }, [itemData, handleUpdate]);


    

    const attactHander = async (method, formData) => {
        // method means start or stop
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
                method: method === 'start' ? formData.method : 'stop',
                time: formData.expiresIn,
            }),
        });
        const booterInfoJson = await booterInfo.json();
        if (booterInfoJson.status === "error") {
            handleUpdate(itemData.id, {
                ...itemData, 
                isStarred: false,
                status: booterInfoJson.status,
                message: booterInfoJson.data,
            });
        }
    }


    return (
        <>
            {ItemData && <li key={ItemData.id} className="item">
                    <span>{ItemData.url}</span>
                    <span>{ItemData.port}</span>
                    {/* <span>{ItemData.status}</span>
                    <span>{ItemData.isStarred}</span> */}
                    <span>{ItemData.method}</span>
                    {/* <span>{ItemData.interval}</span> */}
                    {upDownInfo ? upDownInfo.down? <span style={{color: 'red'}}><HideSourceIcon /></span> : <span style={{color: 'green'}}><DirectionsRunIcon /></span>: <span style={{color: '#ccc'}}><TimerIcon /></span>}
                    
                    { itemData.status === "error" && <span style={{color: 'red'}}>{itemData.message}</span> }
                    { ItemData.isStarred && <span>{time}</span>}

                    <button onClick={() => {
                        if(!ItemData.isStarred){
                            attactHander('start', ItemData),
                            handleUpdate(ItemData.id, { ...ItemData, isStarred: true, startedAt: new Date().getTime() })
                        }else{
                            attactHander('stop', ItemData);
                            handleUpdate(ItemData.id, { ...ItemData, isStarred: false });
                        }
                    }}>{ItemData.isStarred ? <PowerSettingsNewIcon /> : <PlayCircleFilledWhiteIcon />}</button>
                    <button onClick={() => handleDelete(ItemData.id)} style={{color: 'red'}}> <DeleteIcon /> </button>
                </li>}
        </>
    )
}

export default Item;


