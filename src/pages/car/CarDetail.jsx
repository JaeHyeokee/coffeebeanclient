import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import styles from '../../css/car/CarDetail.module.css';
import { Card, Carousel, ProgressBar } from 'react-bootstrap';
import ChatFrame from '../chatting/ChatFrame';
import x from '../../image/x.svg';
import Swal from 'sweetalert2';
import axios from 'axios';
import Footer from '../components/Footer';
import insuranceImage from '../../image/insurance2.png';
import updateImage from '../../image/icon-update.png';
import deleteImage from '../../image/icon-delete.png';
import shareImage from "../../image/share-icon.png";
import DipHeart from "../../image/Dip.svg";
import FullDipHeart from "../../image/FullDipHeart.svg";
import { SERVER_HOST } from '../../apis/Api';


import { LoginContext } from '../../contexts/LoginContextProvider';
import moment from 'moment';

const CarDetail = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [recommendedCars, setRecommendedCars] = useState([]);
    const [index, setIndex] = useState(0);
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const [showFullIntroduce, setShowFullIntroduce] = useState(false); // 더보기 버튼 상태
    const { userInfo,isLogin } = useContext(LoginContext);
    const userId = userInfo?.userId;
    const navigate = useNavigate();
    const isSeller = userId === car?.user?.userId;
    const [ listArr, setListArr ] = useState([]);
    const [isDipped, setIsDipped] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
    const [dipsCount, setDipsCount] = useState(0); // 찜 개수 상태 추가
    const [profileImg, setProfileImg] = useState('https://img2.joongna.com/common/Profile/Default/profile_f.png');


    useEffect(() => {
        axios.get(`http://${SERVER_HOST}/car/detail/${id}`)
            .then(response => {
                setCar(response.data);
                window.scrollTo(0, 0); // 페이지 로드 시 스크롤을 맨 위로 이동
            })
            .catch(error => {
                console.error('실패', error);
            });
    }, [id]);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await axios.get(`http://${SERVER_HOST}/user/profile/${userInfo.userId}`);
                const imageUrl = response.data;
                setProfileImg(imageUrl); 
            } catch (error) {
                console.error('Failed to fetch profile image:', error);
            }
        };

        fetchProfileImage();
    }, [userInfo.userId]);

    useEffect(() => {
        if (car) {
            axios.get(`http://${SERVER_HOST}/car/category2/${car.category2}`)
                .then(response => {
                    setRecommendedCars(response.data);
                })
                .catch(error => {
                    console.error('추천 차량 불러오기 실패', error);
                });
            axios({
                method: "get",
                url: `http://${SERVER_HOST}/sell/car/sortedlist/${car.user.userId}/1/판매중`,
            })
            .then(response => {
                if(Array.isArray(response.data)) {
                    setListArr(response.data.slice(0, 3));
                } else {
                    console.log('데이터 로드 실패');
                }
            });
        }
    }, [car]);

    useEffect(() => {
        const fetchDipsCount = async () => {
            try {
                const response = await axios.get(`http://${SERVER_HOST}/dips/count/car/${id}`);
                setDipsCount(response.data);

            } catch (error) {
                console.error('찜 개수 조회 실패', error);
            }
        };

        fetchDipsCount();
    }, [id, car]);

    const goDetailPage = (elem) => {
        navigate('/CarDetail/' + elem.carId);
    };

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const toggleChatSidebar = () => {
        setIsChatSidebarOpen(!isChatSidebarOpen);
    };

    useEffect(() => {
        if (car && userId) {
            axios.get(`http://${SERVER_HOST}/dips/status/car`, {
                params: { userId, carId: id}
            })
            .then(response => {
                setIsDipped(response.data.isDipped);
            })
            .catch(error => {
                console.error('찜 상태 확인 실패', error);
            });
        }
    }, [car, userId]);   

    useEffect(() => {
        if (isChatSidebarOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isChatSidebarOpen]);

    if (!car) {
        return <div>.</div>;
    }

    const introduceLines = car.introduce.split(/(?<=니다|입니다|습니다)\s*/);
    const maxLinesToShow = 5; // 처음에 보여줄 줄 수

    const handleImageClick = (carId) => {
        navigate(`/CarDetail/${carId}`);
        window.scrollTo(0, 0); // 페이지 이동 시 스크롤을 맨 위로 이동
    };

    const handleCarSearchClick = () => {
        window.open('https://direct.samsungfire.com/ria/pc/product/car/?state=Front', '_blank');
    };

    const deletecar = () => {
        Swal.fire({
            title: '상품을 삭제하시겠습니까?',
            text: '삭제된 상품은 복구되지 않습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://${SERVER_HOST}/car/delete/${id}`)
                    .then(response => {
                        navigate(`/MyPage`);
                    })
                    .catch(error => {
                        Swal.fire('삭제 실패', '상품 삭제에 실패했습니다.', 'error');
                        console.error('삭제 실패', error);
                    });
            }
        });
    };

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

    const dip = async () => {
        if (!isLogin) {
            Swal.fire("로그인이 필요합니다.", "찜하기 기능을 사용하시려면 로그인이 필요합니다.", "warning");
            navigate('/login');
            return;
        }
    
        try {
            if (isDipped) {
                // 찜 취소 요청
                await axios.delete(`http://${SERVER_HOST}/delete/car/${userId}/${id}`);
                setIsDipped(false);
                setDipsCount(dipsCount - 1); 
                Swal.fire("찜 상품에서 제외 했습니다.", "", "success");
            } else {
                // 찜 추가 요청
                await axios.post(`http://${SERVER_HOST}/dips/write/car/${userId}/${id}`);
                setIsDipped(true);
                setDipsCount(dipsCount + 1); 
                Swal.fire("찜 상품에 추가 되었습니다.", "", "success");
            }
        } catch (error) {
            console.error("찜하기/찜 취소하기 실패:", error);
            Swal.fire("작업 실패", "다시 시도해주세요.", "error");
        }
    };
    

    


    const handleShareClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Header />
            <div className={styles.cardetailBody}>
                <section className={styles.cardetailTop}>
                    <Carousel activeIndex={index} onSelect={handleSelect} interval={null} className={styles.carousel}>     
                        {car.fileList.map((file, idx) => 
                            <Carousel.Item key={idx} className={styles.carouselItem}>
                                <img className={styles.carImage} src={file.source} alt={''} />
                            </Carousel.Item>
                        )}
                    </Carousel>

                    <div className={styles.carInfo}>
                        <div className={styles.carHeader}>
                            <p className={car.category2 === "" ? styles.lastcarCategory : styles.carCategory}>{car.category1}</p>
                            {car.category2 !== "" && <p className={styles.carCategory}>&nbsp; &gt; &nbsp;</p>}
                            <p className={styles.lastcarCategory}>{car.category2}</p>
                        </div>

                        <div className={styles.carNameContainer}>
                            <h1 className={styles.carName}>{car.name}</h1>
                            <img
                                className={styles.shareImg}
                                src={shareImage}
                                alt="Share"
                                onClick={handleShareClick}
                            />
                        </div>

                        {isModalOpen && (
                            <div className={styles.modalOverlay} onClick={handleCloseModal}>
                                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                    <h3 className={styles.modaltitle}>공유하기</h3>
                                    <img className={styles.modalqrimg}
                                        src={`https://api.qrserver.com/v1/create-qr-code/?data=http://${SERVER_HOST.slice(0, SERVER_HOST.length - 5)}:3000/carDetail/${id}`}
                                        alt="QR Code"
                                    />
                                    <button onClick={handleCloseModal} className={styles.closeModalButton}>닫기</button>
                                </div>
                            </div>
                        )}






                        {/* <h2 className={styles.carName}>{car.name}</h2> */}
                        {/* <h2 className={styles.carpostinfo}>{formatRegDate(car.regDate)}·조회{car.viewCount}</h2> */}
                        <h1 className={styles.carPrice}>
                            {car.price === 0 ? '가격협의' : `${car.price.toLocaleString()} 만원`}
                        </h1>

                        <h2 className={styles.carpostinfo}>{formatRegDate(car.regDate)}·조회 {car.viewCount} ·찜 {dipsCount}</h2>

                        <div className={styles.area}>
                            <div>{car.modelYear} 년식·{car.distance} km·{car.fuel}</div>
                            <button className={styles.carsearch} onClick={handleCarSearchClick}>보험료 조회</button>
                        </div>
                        
                        <div className={styles.carInfoBottom}>
                            <div className={styles.carInfoBottomDiv}>
                                <p>제품상태</p>
                                <p>{car.status}</p>
                            </div>
                            <div className={styles.carInfoBottomLine}></div>
                            <div className={styles.carInfoBottomDiv}>
                                <p>판매상태</p>
                                <p>{car.dealingStatus}</p>
                            </div>
                        </div>
                        {!isSeller && car.dealingStatus !== "판매완료" && (
                        <div className={styles.chatDipButton}>
                            <button className={styles.dipButton} onClick={dip}>
                                {isDipped ? <img src={FullDipHeart} alt='찜 취소하기'/> : <img src={DipHeart} alt='찜하기'/>}
                            </button>
                            <button className={styles.chatButton} onClick={toggleChatSidebar}>
                                채팅하기
                            </button>
                        </div>
                        )}

                        {isSeller && (
                            <div className={styles.changeButton}>
                                <button className={styles.imageButton} onClick={() => navigate(`/CarUpdate/${id}`)}>
                                    <img src={updateImage} alt="상품수정" className={styles.updateImage} />
                                    <span className={styles.buttonText}>상품수정</span>
                                </button>
                                <div className={styles.carInfoBottomLine}></div>
                                <button className={styles.imageButton} onClick={deletecar}>
                                    <img src={deleteImage} alt="상품삭제" className={styles.deleteImage} />
                                    <span className={styles.buttonText}>상품삭제</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>



                <section className={styles.cardetailInfo}>
                    <div className={styles.leftPanel}>
                        <h2 className={styles.infotext}>차량 기본정보</h2>
                        <div className={styles.infoBox}>
                            <div className={styles.leftColumn}>
                                <p>
                                    <span className={styles.label}>연식</span> 
                                    <span className={styles.value}>{car.modelYear} 년</span>
                                </p>
                                <p>
                                    <span className={styles.label}>주행거리</span> 
                                    <span className={styles.value}>{car.distance} km</span>
                                </p>
                                <p>
                                    <span className={styles.label}>변속기</span> 
                                    <span className={styles.value}>{car.transmission}</span>
                                </p>
                            </div>
                            <div className={styles.rightColumn}>
                                <p>
                                    <span className={styles.label}>차량번호</span> 
                                    <span className={styles.value}>{car.carNum}</span>
                                </p>
                                <p>
                                    <span className={styles.label}>배기량</span> 
                                    <span className={styles.value}>{car.displacement} cc</span>
                                </p>
                                <p>
                                    <span className={styles.label}>연료</span> 
                                    <span className={styles.value}>{car.fuel}</span>
                                </p>
                            </div>
                        </div>
                    </div>








                    <div className={styles.rightPanel}>
                        <h2 className={styles.infotext}>가게정보</h2>
                        <div className={styles.nickNameAndProfileImgFrame}>
                            <span className={styles.sellerNickName}>{car.user.userName}</span>
                            <img className={styles.sellerProfileImg} src={profileImg} alt='프로필'/>
                        </div>
                        <div>
                            <div className={styles.trustIndexFrame}>
                                <div className={styles.sellerTrustIndex}>
                                    <p className={styles.sellerTrustIndexLabel}>신뢰지수</p>
                                    <p className={styles.sellerTrustIndexFigure}>{car.user.reliability}</p>
                                </div>
                                <p className={styles.maxTrustIndex}>1,000</p>
                            </div>
                            <ProgressBar className={styles.trustIndexBar} now={car.user.reliability / 10}/>
                        </div>
                        <div className={styles.sellListFrame}>
                            {listArr.map(elem => (
                                <Card className={styles.sellInfoCard} onClick={() => goDetailPage(elem)}>
                                    <div className={styles.sellInfoCardImgContainer}>
                                        <Card.Img className={styles.sellInfoCardImg} src={elem.fileList[0].source}/>
                                    </div>
                                    <Card.Body className={styles.sellInfoCardBody}>
                                        <Card.Title className={styles.sellInfoTitle}>{elem.name}</Card.Title>
                                        <Card.Text className={styles.sellInfoPrice}>{elem.price.toLocaleString()}만원</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </div>






                    
                </section>
                <section className={styles.insurance}>
                    <div className={styles.infoBoxinsurance}>
                        <h2 className={styles.infotextinsurance}>보험처리 이력</h2>
                        <div className={styles.insuranceContent}>
                            <div>
                                <img src={insuranceImage} alt="" className={styles.insuranceImage} />
                                <span className={styles.insuranceText}>
                                    보험처리 &nbsp;<span className={styles.redText}>{car.insuranceVictim + car.insuranceInjurer}</span> 회
                                </span>
                            </div>
                            <p className={styles.insuranceInfo}>
                                보험사고(피해) 이력&nbsp;<span className={styles.redText}>{'\u00A0' + car.insuranceVictim + '\u00A0'}</span>회
                                <span className={styles.separator}></span>|<span className={styles.separator}></span>
                                보험사고(가해) 이력&nbsp;<span className={styles.redText}>{'\u00A0' + car.insuranceInjurer + '\u00A0'}</span>회
                                <span className={styles.separator}></span>|<span className={styles.separator}></span>
                                소유자 변경 이력&nbsp;<span className={styles.redText}>{'\u00A0' + car.ownerChange + '\u00A0'}</span>회
                            </p>
                        </div>
                    </div>
                </section>
                <section className={styles.cardetailBottom}>
                    <h2 className={styles.infotextBox}>상품정보</h2>
                    <div className={styles.links}>
                        <a href="https://www.naver.com" target="_blank" rel="noopener noreferrer">중고차 주의사항</a>
                        <a href="https://www.naver.com" target="_blank" rel="noopener noreferrer">허위매물 구매사항</a>
                    </div>
                    <div className={styles.infoBoxdetail}>
                        {introduceLines.slice(0, showFullIntroduce ? introduceLines.length : maxLinesToShow).map((line, index) => (
                            <p key={index} className={styles.introduce}>{line}</p>
                        ))}
                        {introduceLines.length > maxLinesToShow && (
                            <button onClick={() => setShowFullIntroduce(!showFullIntroduce)} className={styles.moreButton}>
                                {showFullIntroduce ? '접기' : '더보기 +'}
                            </button>
                        )}
                    </div>
                </section>
                <section className={styles.carRecommend}>
                    <h2 className={styles.rectext}>추천 차량</h2>
                    <div className={styles.recommendationContainer}>
                        {recommendedCars.map((recCar) => {
                            const firstImage = recCar.fileList.length > 0 ? recCar.fileList[0].source : '';
                            return (
                                <div key={recCar.carId} className={styles.recommendationCard} onClick={() => handleImageClick(recCar.carId)}>
                                    {firstImage && (
                                        <img src={firstImage} alt={recCar.name} className={styles.recommendationImage} />
                                    )}
                                    <h3 className={styles.recommendationName}>{recCar.name}</h3>
                                    <p className={styles.recommendationPrice}>{recCar.price === 0 ? '가격협의' : `${recCar.price.toLocaleString()} 만원`}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
                {isChatSidebarOpen && (
                    <>
                        <div className={`${styles.overlay} ${isChatSidebarOpen ? styles.active : ''}`} onClick={toggleChatSidebar} />
                        <div className={`${styles.chatSidebar} ${isChatSidebarOpen ? styles.open : ''}`}>
                            <button className={styles.closeButton} onClick={toggleChatSidebar}>
                                <img src={x} alt='닫기' height={25} width={25} />
                            </button>
                            <ChatFrame productId={parseInt(id, 10)} />
                        </div>
                    </>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default CarDetail;
