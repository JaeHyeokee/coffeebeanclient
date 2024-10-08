import React, { useState } from 'react';
import MyHome from './MyHome';
import { Button } from 'react-bootstrap';
import Style from '../../css/my/DealListFrame.module.css';
import DealListTab from './DealListTab';

const DealListFrame = (props) => {
    const { pageType, isProductOrCar, setIsProductOrCar } = props;
    const [ activatedKey, setActivatedKey ] = useState('전체');

    const handleClick = (e) => {
        if(e.target.value !== isProductOrCar) setIsProductOrCar(e.target.value);
    }

    return (
        <>
            <MyHome/>
            <section className={Style.sellList}>
                <div className={Style.myListHeader}>
                    <p className={Style.sellTitle}>{pageType === 'sell' ? '판매 내역' : pageType === 'buy' ? '구매 내역' : '찜 목록'}</p>
                    <div className={Style.categoryFilterButtonFrame}>
                        <Button className={isProductOrCar === 'product' ? Style.categoryFilterButtonActive : Style.categoryFilterButton} onClick={handleClick} value='product'>중고 물품</Button>
                        <Button className={isProductOrCar === 'car' ? Style.categoryFilterButtonActive : Style.categoryFilterButton} onClick={handleClick} value='car'>중고차</Button>
                    </div>
                </div>
                <DealListTab key={isProductOrCar} activatedKey={activatedKey} setActivatedKey={setActivatedKey} pageType={pageType} isProductOrCar={isProductOrCar}/>
            </section>
        </>
    );
};

export default DealListFrame;