import { Link } from 'react-router-dom';
import './Mypage.scss';
import mypage from './img/mypage_i.png';
import {useEffect, useState} from 'react';

const Mypage = () => {
        // 페이지 스크롤 애니메이션 정의
        const [boxList1, setBoxList] = useState(document.querySelector('.box1_h1')); 
        const options = {
            // viewport
            root: null,
            rootMargin: "0px",
            threshold: 1,
            // 0%가 viewport에 들어와 있어야 callback 실행            
        }
        useEffect(() => {
            const boxList = document.querySelector('.box1_h1');
            setBoxList(boxList);
        }, []);

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                console.log( "entry2 : ", entry );
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, options);
        console.log("box : ", boxList1);
        if ( boxList1 != null ) observer.observe(boxList1);


    return (
        <section>
            <div className='mypageBox'>
                <div className='mypage_back'>
                    <div className='mypage_box1'>
                        <h1 className='box1_h1'>축제와 전시회의 일정을 한 눈에 볼 수 있는 <br /> 내일뭐하지에서 원하는 일정들을 등록해보세요.</h1>
                        
                        <div className='box1_a'>
                            <p className='box1_p'>마이 페이지
                                <span className='box1_span'>*로그인이 필요한 서비스입니다. 로그인 후 이용 가능합니다.</span>
                            </p>
                        </div>

                        <div className='box1_b'>
                            <span className='b_list'>즐겨찾기</span>
                            <span className='b_list2'>지도에서 즐겨찾기 한 항목을 인기순 및 별점 순으로 확인 할 수 있는 서비스 제공합니다.</span>
                        </div>

                        <div className='box1_c'>
                            <span className='b_list'>이벤트</span>
                            <span className='b_list2'>참가 할 이벤트를 달력에 표시하여 실시간으로 확인 할 수 있는 서비스 제공합니다.</span>
                        </div>

                    </div>

                    <div className='mypage_box2'>
                        <img className='box2_img' src={mypage} alt='' />
                        <div className='box2_btn'>
                            <Link to="/mypage">마이 페이지</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Mypage;