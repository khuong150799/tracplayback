import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';

function LocationMarker() {
    const [dataMarker, setDataMarker] = useState([]);
    const [clickMarker, setClickMarker] = useState(false);
    const clickRef = useRef(false);

    const myIcon = L.icon({
        iconUrl: 'http://real.gpscenter.xyz/V2/dist/static/images/car/gray_22.png',
        iconSize: [32, 32],
    });

    useMapEvents({
        mouseup(e) {
            // console.log(e);
            const timeoutId = setTimeout(() => {
                console.log(clickRef.current);
                if (clickRef.current) {
                    console.log(123);
                    clickRef.current = false;
                    return;
                }
                setDataMarker([]);
                marker({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                    distance: 10000,
                });
            }, 100);
            // clearTimeout(timeoutId);
        },
    });

    const marker = async (params) => {
        try {
            const res = await axios({
                method: 'GET',
                url: 'http://192.168.102.5:3002/api/marker/getall',
                params,
            });
            console.log(res?.data);
            if (res?.data?.data.length > 0) {
                setDataMarker(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        marker();
    }, []);
    useEffect(() => {
        console.log('dataMarker', dataMarker);
    }, [dataMarker]);

    return (
        dataMarker.length > 0 &&
        dataMarker.map((value) => (
            <Marker
                key={value.id}
                position={[value.lat, value.lng]}
                icon={myIcon}
                eventHandlers={{
                    click: (e) => {
                        // console.log(e);
                        e.target.closeTooltip();
                        // console.log(clickMarker);
                        clickRef.current = true;
                    },
                    popupclose: (e) => {
                        clickRef.current = true;
                        e.target.openTooltip();
                    },
                }}
            >
                <Tooltip permanent={true}>{value.lat}</Tooltip>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        ))
    );
}

export default LocationMarker;
