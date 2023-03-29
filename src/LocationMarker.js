import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';

function LocationMarker() {
    const [dataMarker, setDataMarker] = useState([]);

    const myIcon = L.icon({
        iconUrl: 'http://real.gpscenter.xyz/V2/dist/static/images/car/gray_22.png',
        iconSize: [32, 32],
    });

    const map = useMapEvents({
        moveend(e) {
            console.log(e);
            // setDataMarker([]);
            // marker({
            //     lat: e.latlng.lat,
            //     lng: e.latlng.lng,
            //     distance: 10000,
            // });
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
        // console.log(23415);
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
                        console.log(e);
                        e.target.closeTooltip();
                    },
                    popupclose: (e) => {
                        e.target.openTooltip();
                    },
                }}
            >
                <Tooltip permanent={true}>{value.lat}</Tooltip>
                <Popup
                    eventHandlers={{
                        popupclose: (e) => {
                            console.log(e);
                        },
                    }}
                >
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        ))
    );
}

export default LocationMarker;
