import logo from './logo.svg';
import './App.css';
// import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L, { stamp } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet-plugin-trackplayback';
import 'leaflet-plugin-trackplayback/dist/leaflet.trackplayback.js';
// import 'leaflet-plugin-trackplayback/dist/control.playback.css'
// import 'leaflet-plugin-trackplayback/dist/control.trackplayback.js'
import axios from 'axios';
import { format } from 'date-fns';
import moment from 'moment/moment';
import LocationMarker from './LocationMarker';
// import { useMapEvents } from 'react-leaflet';
const data = [
    { lng: 106.628597, lat: 10.823787, time: 1635759970 },
    { lng: 106.628747, lat: 10.823537, time: 1635759972 },
    { lng: 106.628967, lat: 10.823202, time: 1635759974 },
    { lng: 106.629142, lat: 10.822898, time: 1635759976 },
    { lng: 106.629297, lat: 10.822612, time: 1635759978 },
    { lng: 106.629452, lat: 10.822313, time: 1635759980 },
    { lng: 106.629602, lat: 10.822013, time: 1635759982 },
    { lng: 106.629722, lat: 10.821773, time: 1635759984 },
    { lng: 106.629897, lat: 10.821443, time: 1635759986 },
    { lng: 106.630072, lat: 10.821122, time: 1635759988 },
    { lng: 106.630247, lat: 10.820782, time: 1635759990 },
    { lng: 106.630402, lat: 10.820527, time: 1635759992 },
    { lng: 106.630542, lat: 10.820282, time: 1635759994 },
    { lng: 106.630687, lat: 10.82002, time: 1635759996 },
];

function App() {
    const mapRef = useRef(null);
    const mapRef_ = useRef(null);
    const [map, setMap] = useState();
    const [isMapReady, setIsMapReady] = useState(false);

    useEffect(() => {
        if (mapRef.current) {
            setMap(mapRef.current.target);
        }
    }, [mapRef]);
    const formatDate = (timestamp) => {
        const dateObj = new Date(timestamp * 1000); // đổi timestamp sang milliseconds bằng cách nhân với 1000
        const day = dateObj.getDate().toString().padStart(2, '0'); // lấy ngày và định dạng về dạng chuỗi, sử dụng padStart để đảm bảo chuỗi có 2 kí tự
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // lấy tháng và định dạng về dạng chuỗi, sử dụng padStart để đảm bảo chuỗi có 2 kí tự
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours().toString().padStart(2, '0'); // lấy giờ và định dạng về dạng chuỗi, sử dụng padStart để đảm bảo chuỗi có 2 kí tự
        const minutes = dateObj.getMinutes().toString().padStart(2, '0'); // lấy phút và định dạng về dạng chuỗi, sử dụng padStart để đảm bảo chuỗi có 2 kí tự
        const seconds = dateObj.getSeconds().toString().padStart(2, '0'); // lấy giây và định dạng về dạng chuỗi, sử dụng padStart để đảm bảo chuỗi có 2 kí tự
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (map && isMapReady) {
            const Options = {
                // the play options
                clockOptions: {
                    // the default speed
                    // caculate method: fpstime * Math.pow(2, speed - 1)
                    // fpstime is the two frame time difference
                    speed: 2,
                    // the max speed
                    maxSpeed: 65,
                    // speedSlider: true,
                    // playerTime: true,
                },
                // trackPoint options
                trackPointOptions: {
                    // whether draw track point
                    isDraw: false,
                    // whether use canvas to draw it, if false, use leaflet api `L.circleMarker`
                    useCanvas: false,
                    stroke: false,
                    color: '#ef0300',
                    fill: true,
                    fillColor: '#ef0300',
                    opacity: 0.3,
                    radius: 4,
                },
                // trackLine options
                trackLineOptions: {
                    // whether draw track line
                    isDraw: true,
                    stroke: true,
                    color: '#1C54E2',
                    weight: 2,
                    fill: false,
                    fillColor: '#000',
                    opacity: 0.3,
                },
                // target options config icon trên đường đi
                targetOptions: {
                    // whether use image to display target, if false, the program provide a default
                    useImg: true,
                    // if useImg is true, provide the imgUrl
                    imgUrl: 'http://real.gpscenter.xyz/V2/dist/static/images/car/gray_22.png',
                    // the width of target, unit: px
                    width: 8,
                    // the height of target, unit: px
                    height: 18,
                    // the stroke color of target, effective when useImg set false
                    color: '#00f',
                    // the fill color of target, effective when useImg set false
                    fillColor: '#9FD12D',
                },
            };
            // console.log(map);
            const trackPlayback = L.trackplayback(data, map, Options);
            const customControl = L.Control.extend({
                options: {
                    position: 'bottomleft',
                },
                onAdd: function (map) {
                    const startTimes = trackPlayback.getStartTime();
                    const endTimes = trackPlayback.getEndTime();
                    const totalTimesPlayback = endTimes - startTimes;
                    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                    const playPause = L.DomUtil.create('button', 'leaflet-control-play-pause', container);
                    playPause.innerText = 'Play';
                    const progress = L.DomUtil.create('input', 'leaflet-control-progress', container);
                    const currentTimes = L.DomUtil.create('span', 'leaflet-current-times', container);
                    currentTimes.innerText = formatDate(startTimes);
                    progress.type = 'range';
                    progress.value = '0';
                    progress.step = '1';
                    progress.min = '0';
                    progress.max = '100';
                    trackPlayback.on(
                        'tick',
                        (e) => {
                            const valueProgress = Math.floor(((e.time - startTimes) / totalTimesPlayback) * 100);
                            currentTimes.innerText = formatDate(e.time);
                            // console.log('valueProgress',valueProgress);
                            progress.value = valueProgress;
                            // console.log('e.time',e.time)
                        },
                        this,
                    );

                    L.DomEvent.on(playPause, 'click', function () {
                        if (trackPlayback.isPlaying()) {
                            playPause.innerText = 'Play';
                            trackPlayback.stop();
                        } else {
                            playPause.innerText = 'Pause';
                            trackPlayback.start();
                        }
                    });
                    L.DomEvent.on(progress, 'input', function () {
                        const valueProgressChange = progress.value;
                        const currentTimesPlayback = (valueProgressChange * totalTimesPlayback) / 100 + startTimes;
                        trackPlayback.setCursor(currentTimesPlayback);
                    });
                    return container;
                },
            });
            map.addControl(new customControl());
        }
    }, [map, isMapReady]);

    return (
        <div id="map">
            <MapContainer
                // onMouseUp={handleMouseUp}
                ref={mapRef_}
                center={[10.823099, 106.629662]}
                zoom={13}
                style={{ width: '100%', height: '500px' }}
                whenReady={(mapInstance) => {
                    console.log(122);
                    mapRef.current = mapInstance;
                    setIsMapReady(true);
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker />
            </MapContainer>
        </div>
    );
}

export default App;
