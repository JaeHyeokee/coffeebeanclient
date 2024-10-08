import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductItem from '../components/ProductItem';
import Footer from '../components/Footer';
import styles from '../../css/product/ProductList.module.css';
import PriceTrendChart from '../priceTrend/PriceTrendChart';
import { Button, Modal } from 'react-bootstrap';
import Soldout from '../../image/Soldout.png';
import UnSoldout from '../../image/UnSoldout.png';
import { SERVER_HOST } from '../../apis/Api';

const ITEMS_PER_PAGE = 20;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [priceInfo, setPriceInfo] = useState({
        averagePrice: 0.0,
        minPrice: 0.0,
        maxPrice: 0.0,
        productCount: 0
    });
    const [minPriceFilter, setMinPriceFilter] = useState(''); //최소가격 상태 저장
    const [maxPriceFilter, setMaxPriceFilter] = useState(''); //최대가격 상태 저장
    const [showModal, setShowModal] = useState(false);
    const [includeSoldOut, setIncludeSoldOut] = useState(false); //판매완료 포함 미포함 상태 저장

    const { category, subcategory, subsubcategory } = useParams();

    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get('keyword') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let response;

                if(keyword !== '') {
                    response = await axios({
                        method: "get",
                        url: `http://${SERVER_HOST}/product/list/${keyword}`,
                    });
                } else {
                    response = await axios.get(`http://${SERVER_HOST}/product/category`, {
                        params: {
                            category1: category || undefined,
                            category2: subcategory || undefined,
                            category3: subsubcategory || undefined,
                        }
                    });
                }

                console.log('응답데이터: ', response.data)
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('상품 데이터 가져오기 실패:', error);
            } finally {
                setLoading(false);
            }
        };
    
        const fetchPriceInfo = async () => {
            try {
                let response;
                if(keyword === '') {
                    response = await axios.get(`http://${SERVER_HOST}/product/priceInfo`, {
                        params: {
                            category1: category,
                            category2: subcategory,
                            category3: subsubcategory
                        }
                    });
                } else {
                    response = await axios({
                        method: "get",
                        url: `http://${SERVER_HOST}/product/priceInfo/${keyword}`,
                    });
                }
                setPriceInfo(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchProducts();
        fetchPriceInfo();
    }, [keyword, category, subcategory, subsubcategory]);

    const handleFilterProducts = () => {
        const minPrice = parseFloat(minPriceFilter) || 0;
        const maxPrice = parseFloat(maxPriceFilter) || Infinity;
        const filtered = products.filter(product => {
            const productPrice = product.price;
            const isSoldOut = product.dealingStatus === '판매완료';

            return (
                (category ? product.category1 === category : true) &&
                (subcategory ? product.category2 === subcategory : true) &&
                (subsubcategory ? product.category3 === subsubcategory : true) &&
                (productPrice >= minPrice && productPrice <= maxPrice) &&
                (includeSoldOut || !isSoldOut) // 판매 완료 상품 포함 여부
            );
        });
        setFilteredProducts(filtered);
        setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
        setCurrentPage(1); // 필터 적용 시 페이지를 첫 페이지로 리셋
    };

    //필터링 조건이 변경될 때마다 필터링을 자동으로 수행
    useEffect(() => {
        handleFilterProducts();
    }, [products, category, subcategory, subsubcategory, includeSoldOut]); //includeSoldOut값이 변경될때마다 필터링 적용

    //가격 필터를 적용버튼을 클릭했을때 호출
    const handlePriceFilterClick = () => {
        handleFilterProducts();
    };
    //판매 완료 여부 필터를 토글하여 필터링 조건을 변경
    const handleToggleSoldOut = () => {
        setIncludeSoldOut(prev => !prev);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 부드럽게 스크롤 이동
        });
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);


    const currentItems = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <>
            <Header />
            <div className={styles.productlistBody}>
                <div className={styles.searchResult}>{keyword !== '' ? "'" + keyword + "'" + '\u00A0' : ''}검색 결과</div>

                <table className={styles.categoryContainer}>
                    <tbody>
                        <tr>
                            <td className={styles.category1}>
                                <h2>카테고리</h2>
                            </td>
                            <td>
                                <div className={styles.category1Result}>
                                    <p>전체</p>
                                    <p>&gt; {category}</p>
                                    {subcategory && <p>&gt; {subcategory}</p>}
                                    {subsubcategory && <p>&gt; {subsubcategory}</p>}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className={styles.category2}>
                                <h2>가격</h2>
                            </td>
                            <td>
                                <div className={styles.category2Result}>
                                    <input
                                        type='number'
                                        className={styles.productInputPrice}
                                        placeholder=' 최소가격'
                                        value={minPriceFilter}
                                        onChange={(e) => setMinPriceFilter(e.target.value)}
                                    />
                                    <p>~</p>
                                    <input
                                        type='number'
                                        className={styles.productInputPrice}
                                        placeholder=' 최대가격'
                                        value={maxPriceFilter}
                                        onChange={(e) => setMaxPriceFilter(e.target.value)}
                                    />
                                    <button
                                        className={styles.category2ResultButton}
                                        onClick={handlePriceFilterClick}
                                    >
                                        적용
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className={styles.category3}>
                                <h2>옵션</h2>
                            </td>
                            <td>
                                <div className={styles.category3Result}>
                                    <button 
                                        className={styles.toggleButton}
                                        onClick={handleToggleSoldOut}
                                    >
                                        <img 
                                            src={includeSoldOut ? Soldout : UnSoldout} 
                                            alt={includeSoldOut ? '판매완료 상품 포함' : '판매완료 상품 포함'} 
                                            className={styles.icon}
                                        />
                                        {includeSoldOut ? '판매완료 상품 포함' : '판매완료 상품 포함'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className={styles.price}>
                    <div className={styles.priceTitle}>
                    <h4 className={styles.priceh4}>현재 검색 결과의 상품 가격 비교</h4>
                    <h6 onClick={handleOpenModal}> 그래프 보기</h6>
                    </div>
                    <div className={styles.priceInfo}>
                        <p1>평균 가격</p1> <p>{priceInfo.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}원</p>
                        <p1>최저 가격</p1> <p>{priceInfo.minPrice.toLocaleString()}원</p>
                        <p1>최고 가격</p1> <p>{priceInfo.maxPrice.toLocaleString()}원</p>
                        {/* <p1>상품 수</p1> <p>{priceInfo.productCount}개</p> */}
                    </div>
                </div>

                {/* 그래프 모달 */}
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>가격 분포도</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PriceTrendChart category1={category} category2={subcategory} category3={subsubcategory} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            닫기
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div className={styles.productList}>
                    {loading ? (
                        <p>로딩중...</p>
                    ) : (
                        filteredProducts.length > 0 ? (
                            currentItems.map(product => (
                                <ProductItem key={product.id} product={product} />
                            ))
                        ) : (
                            <p>상품이 없습니다.</p>
                        )
                    )}
                </div>

                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductList;
