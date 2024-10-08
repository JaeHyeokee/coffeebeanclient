import React, { useEffect, useState } from 'react';
import Style from '../css/home.module.css';
import Header from './components/Header.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from './components/Footer.jsx';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import moment from 'moment';
import { SERVER_HOST } from '../apis/Api.js';

import main1 from '../image/main1.png';
import main2 from '../image/main2.png';
import main3 from '../image/main3.png';
import main4 from '../image/main4.png';
import main5 from '../image/main5.png';

const Home = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [topCars, setTopCars] = useState([]); // 중고차 상태 추가
    const [firstPost, setFirstPost] = useState(null); // 첫 번째 게시글 상태 추가


    useEffect(() => {
        console.log(SERVER_HOST);
        // 인기 상품 가져오기
        axios.get(`http://${SERVER_HOST}/product/top10`)
            .then(response => {
                setTopProducts(response.data);
            })
            .catch(error => {
                console.error('인기 상품 가져오기 오류', error);
            });

        // 최근 등록된 상품 가져오기
        axios.get(`http://${SERVER_HOST}/product/top10regDate`)
            .then(response => {
                setRecentProducts(response.data);
            })
            .catch(error => {
                console.error('최근 등록된 상품 가져오기 오류', error);
            });

        // 중고차 목록 가져오기
        axios.get(`http://${SERVER_HOST}/car/top10`)
            .then(response => {
                setTopCars(response.data);
            })
            .catch(error => {
                console.error('중고차 목록 가져오기 오류', error);
            });

            // 게시글 리스트 가져오기
        axios.get(`http://${SERVER_HOST}/post/list`)
        .then(response => {
            if (response.data.length > 0) {
                setFirstPost(response.data[0]); // 첫 번째 게시글 저장
            }
        })
        .catch(error => {
            console.error('게시글 리스트 가져오기 오류', error);
        });
    }, []);

    const formatRegDate = (regDate) => {
        const now = moment();
        const date = moment(regDate);

        const diffSeconds = now.diff(date, 'seconds');
        const diffMinutes = now.diff(date, 'minutes');
        const diffHours = now.diff(date, 'hours');
        const diffDays = now.diff(date, 'days');

        if (diffSeconds < 60) {
            return `${diffSeconds}초전`;
        } else if (diffMinutes < 60) {
            return `${diffMinutes}분전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간전`;
        } else if (diffDays < 30) {
            return `${diffDays}일전`;
        } else {
            return date.format('YYYY-MM-DD');
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true, // 좌우 화살표 사용 설정
    };

    return (
        <>
            <Header />
            <div className={Style.homeBody}>
                {/* 슬라이더 섹션 */}
                <section className={Style.sliderSection}>
                    <Slider {...sliderSettings}>
                        <div className={Style.sliderItem}>
                            <img src={main1} alt="slider-img-1" />
                        </div>
                        <div className={Style.sliderItem}>
                            <a href="https://thecheat.co.kr/rb/?mod=_search" target="_blank" rel="noopener noreferrer">
                                <img src={main2} alt="slider-img-2" />
                            </a>
                        </div>
                        <div className={Style.sliderItem}>
                            <img src={main3} alt="slider-img-3" />
                        </div>
                        <div className={Style.sliderItem}>
                            <img src={main4} alt="slider-img-4" />
                        </div>
                        <div className={Style.sliderItem}>
                            <img src={main5} alt="slider-img-5" />
                        </div>
                    </Slider>
                </section>

                {/* 첫 번째 게시글 타이틀 출력 */}
                {firstPost && (
                    <section className={Style.firstPostSection}>
                        <Link to={`/PostDetail/${firstPost.postId}`} className={Style.firstPostTitle}>
                            {firstPost.title}
                        </Link>
                    </section>
                )}



                {/* 인기 상품 */}
                <section>
                    <div className={Style.productList}>
                        <h2 className={Style.maintext}>실시간 인기 상품</h2>
                        <div className={Style.productItems}>
                            {topProducts.slice(0, 10).map(product => (
                                <Link key={product.productId} to={`/ProductDetail/${product.productId}`} className={Style.productItem}>
                                    <img src={product.fileList[0].source} alt={product.name} />
                                    <h4>{product.name}</h4>
                                    <p className={Style.price}>{product.price.toLocaleString()}원</p>
                                    <p>
                                        {product.desiredArea ? product.desiredArea + ' | ' : ''}
                                        {formatRegDate(product.regDate)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 최근 등록 상품 */}
                <section>
                    <div className={Style.productList}>
                        <h2 className={Style.maintext}>방금 등록된 상품</h2>
                        <div className={Style.productItems}>
                            {recentProducts.slice(0, 10).map(product => (
                                <Link key={product.productId} to={`/ProductDetail/${product.productId}`} className={Style.productItem}>
                                    <img src={product.fileList[0].source} alt={product.name} />
                                    <h4>{product.name}</h4>
                                    <p className={Style.price}>{product.price.toLocaleString()}원</p>
                                    <p>
                                        {product.desiredArea ? product.desiredArea + ' | ' : ''}
                                        {formatRegDate(product.regDate)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 최근 등록 중고차 */}
                <section>
                    <div className={Style.productList}>
                        <h2 className={Style.maintext}>방금 등록된 중고차</h2>
                        <div className={Style.productItems}>
                            {topCars.slice(0, 10).map(car => (
                                <Link key={car.carId} to={`/CarDetail/${car.carId}`} className={Style.productItem}>
                                    <img src={car.fileList[0].source} alt={car.name} />
                                    <h4>{car.name}</h4>
                                    <p className={Style.price}>
                                        {car.price === 0 ? "가격협의" : `${car.price.toLocaleString()} 만원`}
                                    </p>

                                    <p>
                                        {car.location ? car.location + ' | ' : ''}
                                        {formatRegDate(car.regDate)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Home;
