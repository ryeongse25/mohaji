import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import Map from '../components/Map';

const EVENT_PAGE = "http://localhost:8000/event";

const Event = () => {

    const { state } = useLocation();

    const [city, setCity] = useState(state);
    const [data, setData] = useState([]);

    const getData = async () => {
        const response = await axios.get(EVENT_PAGE, {
            params: {city: city}
        })
        console.log(response.data);
        setData(response.data);
    }

    const onChange = (e) => {
        setCity(e.target.value);
    }

    useEffect(() => {
        getData();
    }, [city])

    return (
        <div style={{ width: "90%", margin: "100px auto 0 auto", display: "flex", gap: "50px"}}>
            <div>
                <Map />
            </div>
            <div>
                <select onChange={onChange}>
                    <option value="전체">전체</option>
                    <option value="강남구">강남구</option>
                    <option value="종로구">종로구</option>
                    <option value="영등포구">영등포구</option>
                </select>
                {data.map((data) => {
                    return (
                        <div key={data.id}>
                            <p>{data.title}</p>
                            <p>{data.detail}</p>
                            <p>{data.url}</p>
                            <p>{data.type}</p>
                            <p>{data.place}</p>
                            <p>{data.address}</p>
                            <p>{data.start_date}</p>
                            <p>{data.end_date}</p>
                            <p>{data.time}</p>
                            <p>{data.people}</p>
                            <p>{data.price}</p>
                            <img src={"./img/" + data.filename} style={{width: "200px"}}/>
                            <hr />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Event;