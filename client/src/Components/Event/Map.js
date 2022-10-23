import React, { useEffect, useState, useRef, createRef } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Map.scss';

const { naver } = window;
const EVENT_PAGE = "http://localhost:8000/event";

function MapComponent(props) {

    const [myLocation, setMyLocation] = useState({latitude: 37.3724620, longitude: 127.1051714});
    const [zoom, setZoom] = useState(12);
    const container = useRef();
    const addressInput = createRef();
    const {city, type, date} = props.filter;
    // const location = useLocation();

    // 🤔 Event.js에서 button 누르면 누른 데이터 address 가져오게 함. 
    const [ event , setEvent ] = useState('');
    // const [animation, setAnimation ] = useState(null);

    const initMap = async () => {

        const mapOption = {
            center: myLocation,
            zoom: zoom,
            minZoom: 1,
            disableKineticPan: false,
            mapTypeControl : true,
            zoomControl: true,
            scrollWheel: true
        };

//------------------------------ 현재 위치 가져오기----------------------------------//
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setMyLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                })
        } else {
            alert("현재 위치 찾을 수 없음");
        }

        if (typeof myLocation.latitude == "number") {
            // console.log("위치", myLocation);
            // LatLng : 위/경도 좌표를 정의함.
            mapOption.center = new naver.maps.LatLng(myLocation.latitude, myLocation.longitude); // 지도 시작 지점
        } else {
            alert("현재 위치 오류");
            mapOption.center = new naver.maps.LatLng(37.3724620, 127.1051714);
        }

        const map = new naver.maps.Map(container.current, mapOption);

        // 마커 애니메이션
        // map.fitBounds(naver.maps.LatLngBounds.bounds(new naver.maps.LatLng(37.3724620, 127.1051714), new naver.maps.LatLng(37.3542795, 127.1174332)));

        //마커 속성
        const markerOptions = {
            position: mapOption.center,
            map,
            icon: {
                content: `<img src=${require('./img/nowlocation.png')} width='30px' height='30px'/>`,
                size: new naver.maps.Size(50, 52),
                origin: new naver.maps.Point(0,0),
                anchor: new naver.maps.Point(25, 26),
            }
            // animation: naver.maps.Animation.DROP
        }

        const marker = new naver.maps.Marker(markerOptions);

        naver.maps.Event.addListener(map, 'click', function() {
            setEvent('');
            window.location.replace('/event?city=전체');
        });



//-------------------------- DB event 주소 -> 좌표 전환 및 마커표시------------------------------------//

        axios.get(EVENT_PAGE, {
            params: {city: city, type: type, date: date}
        })
        .then((req) => { return req.data;})
        .then((addressData) => {

        console.log(addressData);
        console.log("props :", props.address);

            // 1. 주소 >> 좌표 전환

            // 🤔 
            //1)여기 전체 데이터에서 Event.js에서 버튼 클릭해서 받은 주소와 비교 해서 데이터가 일치할 경우 그 데이터만 담아서 .then에 보내줌. 

            //2) 1)이 아닐경우 전체 데이터를 .then에 보내줌.
                // if (props.address != "") {
                //     const result = addressData.filter((data) => { return data.address === props.address });
                //     setEvent(props.address);
                //     console.log(result);
                //     return result;
                // } 
                
                if (props.clickData != "") {
                    const result = addressData.filter((data) => { return data.address === props.address });
                    setEvent(props.address);
                    return result;
                } else {
                    return addressData;
                }
            

        })
        .then((data) => {
                
                    data.map(function(aData) {                   

                    naver.maps.Service.geocode({
                        query: aData.address
                    }, function(status,response) {
                        if (status === naver.maps.Service.Status.ERROR) {
                            return alert('error!');
                        }
                        
                        var result = response.v2;
                        var item = result.addresses;

                        var data_lat = item[0].y;
                        var data_lng = item[0].x;
                    
                    // 2. 각 이벤트별 마커 표시
                        const event_marker = new naver.maps.Marker({
                            map: map,
                            position: new naver.maps.LatLng(data_lat,data_lng),
                            icon : {
                                content: `<img src=${require('./img/marker.png')} width='30px' height='30px'/>`,
                                size: new naver.maps.Size(50, 52),
                                origin: new naver.maps.Point(0,0),
                                anchor: new naver.maps.Point(25, 26),
                            }
                        });

                    // 3. 각 마커별 정보창 표시

                        const infoText = 
                            `<div className='infoText' style='padding:20px; background-color:white; color:black; border-radius:20px; opcity:75%; display:flex; align-items:center;'>
                            <div style='margin-right:30px;'>
                                <div style='font-weight:normal; text-align:center; font-size:11px; margin-top:3px; width:50px; background-color:#FFE6E6; border-radius:4px;'>${aData.type}</div>    
                                <div style='font-weight:bold; font-size:15px; cursor:pointer;'>${aData.title}<span><img src=${require('./img/arrow.png')} style='width:12px; height:12px; margin-left:5px; margin-bottom:4px;' alt='상세보기'></span></div>
                                <div>
                                    <span style='font-size:11px; border-right: 1px solid #dcdcdc;'>⭐⭐⭐</span>
                                    <span style='font-size:11px;' >리뷰 (5)</span>
                                </div>
                                <div style='margin-top:10px;'>
                                <span style='font-size:12px; font-weight:bold;padding:5px; border-radius:3px;background-color:#5AD2FF; color:white;'><img src=${require('./img/detour.png')} style='width:15px; height:15px;' />길찾기</span>
                                </div>
                            </div>
                            <div>
                                <img src='./img/${aData.filename}' style='width:70px; height:100px;' />
                            </div>
                            </div>`;

                        const infoText2 = 
                            `<div className='infoText' style='padding:20px; background-color:white; color:black; border-radius:20px; opcity:75%; display:flex; align-items:center;'>
                            <div style='margin-right:30px;'>
                                <div style='font-weight:normal; text-align:center; font-size:11px; margin-top:3px; width:50px; background-color:#FFE6E6; border-radius:4px;'>${props.clickData.type}</div>    
                                <div style='font-weight:bold; font-size:15px; cursor:pointer;'>${props.clickData.title}<span><img src=${require('./img/arrow.png')} style='width:12px; height:12px; margin-left:5px; margin-bottom:4px;' alt='상세보기'></span></div>
                                <div>
                                    <span style='font-size:11px; border-right: 1px solid #dcdcdc;'>⭐⭐⭐</span>
                                    <span style='font-size:11px;' >리뷰 (5)</span>
                                </div>
                                <div style='margin-top:10px;'>
                                <span style='font-size:12px; font-weight:bold;padding:5px; border-radius:3px;background-color:#5AD2FF; color:white;'><img src=${require('./img/detour.png')} style='width:15px; height:15px;' />길찾기</span>
                                </div>
                            </div>
                            <div>
                                <img src='./img/${props.clickData.filename}' style='width:70px; height:100px;' />
                            </div>
                            </div>`;
                        
                        const infowindow = new naver.maps.InfoWindow({
                            content: infoText,
                            borderWidth:0,
                            maxWidth:500,
                            backgroundColor:'transparent',
                            anchorColor: '#fff',
                            anchorSize: {
                                width: 15,
                                height: 15
                            },                            
                        });

                        const infowindow2 = new naver.maps.InfoWindow({
                            content: infoText2,
                            borderWidth:0,
                            maxWidth:500,
                            backgroundColor:'transparent',
                            anchorColor: '#fff',
                            anchorSize: {
                                width: 15,
                                height: 15
                            },                            
                        });
                        

                            naver.maps.Event.addListener(event_marker, 'click', function(e) {
                                map.panTo(e.coord);
                                map.setZoom(14);

                                if (event_marker.getAnimation() != null) {
                                    event_marker.setAnimation(null);
                                } else {
                                    event_marker.setAnimation(naver.maps.Animation.BOUNCE)
                                }
                                if (infowindow.getMap()) {
                                    infowindow.close();
                                } else {
                                    infowindow.open(map, event_marker);
                                }

                                if(props.clickData != "") {
                                    if (infowindow2.getMap()) {
                                        infowindow2.close();
                                    } else {
                                        infowindow2.open(map, event_marker);
                                    }
                                }

                            });
                            infowindow.open(map,event_marker);
                            infowindow2.open(map,event_marker);
                            }

                    )

                })
            
            })  
    }

    useEffect(() => {
        initMap();
    }, [props.city, props.address, props.clickData]); 


    return (
    <div className="mapPart">
        <div ref={container} style={{width: '100%', height: '90vh'}}></div><br />
        <div>
        <input ref={addressInput} value={props.address || ''} readOnly style={{display:'none'}} />
        {/* <button type='button' onClick={reset}>초기화</button> */}
        </div>
    </div>);
}

export default MapComponent;