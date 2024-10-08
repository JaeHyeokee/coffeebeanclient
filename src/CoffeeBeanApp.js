import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MyPage from './pages/my/MyPage';
import MyInformation from './pages/my/MyInformation';
import Join from './pages/my/Join';
import LogIn from './pages/my/LogIn';
import ReviewCreate from './pages/my/ReviewCreate';
import ReviewDetail from './pages/my/ReviewDetail';
import WriterReviewList from './pages/my/WriterReviewList';
import RecipientReviewList from './pages/my/RecipientReviewList';
import UnRegister from './pages/my/UnRegister';
import UserManagement from './pages/admin/UserManagement';
import CarCreate from './pages/car/CarCreate';
import CarDetail from './pages/car/CarDetail';
import CarList from './pages/car/CarList';
import CarUpdate from './pages/car/CarUpdate';
import PostCreate from './pages/post/PostCreate';
import PostDetail from './pages/post/PostDetail';
import PostList from './pages/post/PostList';
import PostUpdate from './pages/post/PostUpdate';
import ProductCreate from './pages/product/ProductCreate';
import ProductDetail from './pages/product/ProductDetail';
import ProductList from './pages/product/ProductList';
import ProductUpdate from './pages/product/ProductUpdate';
import LoginContextProvider from './contexts/LoginContextProvider';
import ChatList from './pages/chatting/ChatList';
import Chat from './pages/chatting/Chat';
import KaKaoLogin from './pages/components/Kakao/KaKaoLogin'; //카카오로그인
import KakaoCallback from './pages/components/Kakao/KaKaoCallBack';
import UserProfile from './pages/components/Kakao/UserProfile';

import 'bootstrap/dist/css/bootstrap.min.css';
import './CoffeeBeanApp.css';

const CoffeeBeanApp = () => {
    return (
        <>
        <BrowserRouter>
            <LoginContextProvider>
                <Routes>
                    <Route path = '/' Component = {Home}/>

                    <Route path = '/UserManagement' Component={UserManagement}/>
                    <Route path = '/UserManagement' Component={UserManagement}/>

                    <Route path='/Chat/:chatRoomId' element={<Chat />} />
                    <Route path='/ChatList' element={<ChatList />} />

                    <Route path = '/CarCreate/:userId' Component={CarCreate}/>
                    <Route path = '/CarDetail/:id' Component={CarDetail}/>
                    <Route path = '/CarList' Component={CarList}/>
                    <Route path = '/CarList/:category' Component={CarList}/>
                    <Route path = '/CarList/:category/:subcategory' Component={CarList}/>
                    <Route path = '/CarUpdate/:carId' Component={CarUpdate}/>

                    <Route path = '/Login' Component={LogIn}/>
                    <Route path = '/MyPage' Component={MyPage}/>
                    <Route path = '/MyInformation' Component={MyInformation}/>
                    <Route path = '/ReviewCreate/:chatRoomId/:writerId' Component={ReviewCreate}/>
                    <Route path = '/ReviewDetail/:chatRoomId/:writerId' Component={ReviewDetail}/>
                    <Route path = '/ReviewList/writer/:userId' Component={WriterReviewList}/>
                    <Route path = '/ReviewList/recipient/:userId' Component={RecipientReviewList}/>
                    <Route path = '/UnRegister' Component={UnRegister}/>

                    <Route path = '/PostCreate/:userId' Component={PostCreate}/>
                    <Route path = '/PostDetail/:postId' element={<PostDetail/>}/>
                    <Route path = "/PostList" element={<PostList initialContentType="contentType1" />} />
                    <Route path = '/PostUpdate/:postId' element={<PostUpdate/>}/>

                    <Route path = '/ProductCreate/:userId' Component={ProductCreate}/>
                    <Route path = '/ProductDetail/:id' Component={ProductDetail}/>
                    <Route path = '/ProductList' Component={ProductList}/>
                    <Route path = '/ProductList/:category' Component={ProductList}/>
                    <Route path = '/ProductList/:category/:subcategory' Component={ProductList}/>
                    <Route path = '/ProductList/:category/:subcategory/:subsubcategory' Component={ProductList}/>
                    <Route path = '/ProductUpdate/:id' Component={ProductUpdate}/>

                    <Route path = '/Join' Component={Join}/>

                    <Route path = '/Kakao' Component={KaKaoLogin}/>
                    <Route path="/callback/kakao" element={<KakaoCallback />} />
                </Routes>
            </LoginContextProvider>
        </BrowserRouter>
            
        </>
    );
};

export default CoffeeBeanApp;