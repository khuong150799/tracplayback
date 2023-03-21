import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const [dataMarker, setDataMarker] = useState([]);
    const [latlng, setLatlng] = useState({});
    // const [lng, setLng] = useState();
    const myIcon = L.icon({
        iconUrl: 'http://real.gpscenter.xyz/V2/dist/static/images/car/gray_22.png',
        iconSize: [32, 32],
    });

    const map = useMapEvents({
        mouseup(e) {
            setDataMarker([]);
            marker({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                distance: 10000,
            });
        },
    });

    // const isCalldevice = localStorage.getItem('isCalldevice');
    // useEffect(() => {
    //     console.log(isCalldevice);
    //     if (!isCalldevice) {
    //         const fetch = async () => {
    //             const res = await axios({
    //                 method: 'GET',
    //                 url: 'http://localhost:3002/api/devices/getall',
    //             })
    //                 .then(async (data) => {
    //                     console.log(data);
    //                     if (data.data.result) {
    //                         marker();
    //                         localStorage.setItem('isCalldevice', true);
    //                     }
    //                 })
    //                 .catch((error) => {
    //                     console.log(error);
    //                 });
    //         };
    //         fetch();
    //     }
    // }, []);
    const marker = async (params) => {
        try {
            const res = await axios({
                method: 'GET',
                url: 'http://localhost:3002/api/marker/getall',
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
            <Marker key={value.id} position={[value.lat, value.lng]} icon={myIcon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        ))
    );
}

export default LocationMarker;
