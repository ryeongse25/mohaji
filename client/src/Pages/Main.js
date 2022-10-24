import Banner from '../components/Banner/Banner';
import Gallery from '../components/MainGallery/Gallery'
import Mypage from '../components/MainMyPage/Mypage';
import axios from 'axios';

import {gsap, Power3} from 'gsap';


const Main = () => {
    let tl = new gsap.timeline();
    let ease = Power3.easeOut;

    const result = axios.get("http://localhost:8000/user/auth");

    return (
        <div>
            <Banner timeline={tl} ease={ease} />
            <Gallery timeline={tl} ease={ease} />
            <Mypage />
        </div>
    )
}

export default Main;