import React, { useEffect, useState } from 'react';
import '../../css/components/Header.css';
import chat from '../../image/ChatIcon.svg';
import my from '../../image/MyIcon.svg';
import sale from '../../image/SaleIcon.svg';
import x from '../../image/x.svg';
import { Link } from 'react-router-dom';
import ChatList from '../chatting/ChatList';
import Chat from '../chatting/Chat';
import Category from './Category';
import CarCategory from './CarCategory';

const Header = () => {

    //상태관리
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const [isSaleMenuOpen, setIsSaleMenuOpen] = useState(false);
    const [isMyMenuOpen, setIsMyMenuOpen] = useState(false);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null); // 선택된 채팅방 상태

    // 사이드바 스크롤관리 (채팅하기 눌렀을때)
    useEffect(() => {
        if (isChatSidebarOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isChatSidebarOpen]);
    //메뉴 열고 닫는 토글
    const toggleChatSidebar = () => {
        setIsChatSidebarOpen(!isChatSidebarOpen);
        if (isSaleMenuOpen) setIsMyMenuOpen(false);
        if (isMyMenuOpen) setIsMyMenuOpen(false);
    }
    const toggleSaleMenu = () => {
        setIsSaleMenuOpen(!isSaleMenuOpen);
        if (isSaleMenuOpen) setIsMyMenuOpen(false);
        if (isChatSidebarOpen) setIsChatSidebarOpen(false);
    };
    const toggleMyMenu = () => {
        setIsMyMenuOpen(!isMyMenuOpen);
        if (isMyMenuOpen) setIsSaleMenuOpen(false);
        if (isChatSidebarOpen) setIsChatSidebarOpen(false);
    }

    // 채팅방 선택 함수
    const handleSelectChatRoom = (chatRoomId) => {
        setSelectedChatRoomId(chatRoomId);
    };

    // 뒤로가기 함수
    const handleBackToChatList = () => {
        setSelectedChatRoomId(null);
    };

    return (
        <>
            <header>
                <div className='header-top'>
                    <Link to='/'>
                        <img src='https://via.placeholder.com/200x80' className='logo' alt='로고' />
                    </Link>
                    <input type='text' className='search' placeholder='어떤 상품을 찾으시나요?' />
                    <nav className="nav">
                        <div>
                            <button className="nav-item" onClick={toggleChatSidebar}>
                                <img src={chat} className="nav-icon" alt="아이콘" />
                                채팅하기
                            </button>
                        </div>
                        <div>
                            <button className="nav-item" onClick={toggleSaleMenu}>
                                <img src={sale} className="nav-icon" alt="아이콘" />
                                판매하기
                            </button>
                            {isSaleMenuOpen && (
                                <div className='dropdown-menu'>
                                    <Link to="/ProductCreate" className="nav-link">
                                        <button className='dropdown-button'>중고물품</button>
                                    </Link>
                                    <Link to="/PropertyCreate" className="nav-link">
                                        <button className='dropdown-button'>부동산</button>
                                    </Link>
                                    <Link to="/CarCreate" className="nav-link">
                                        <button className='dropdown-button'>중고차</button>
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div>
                            <button className="nav-item" onClick={toggleMyMenu}>
                                <img src={my} className="nav-icon" alt="아이콘" />
                                마이
                            </button>
                            {isMyMenuOpen && (
                                <div className='dropdown-menu'>
                                    <Link to="/MyPage" className="nav-link">
                                        <button className='dropdown-button'>마이페이지</button>
                                    </Link>
                                    <button className='dropdown-button'>로그아웃</button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
                <div className='category-car-post'>
                    <Category />
                    <div className='header-bottom'>
                        <CarCategory />
                        <Link to='/PostList'>게시판</Link>
                    </div>
                </div>
                {/* 사이드바 */}
                {isChatSidebarOpen && (
                    <>
                        <div className={`overlay ${isChatSidebarOpen ? 'active' : ''}`} onClick={toggleChatSidebar} /> {/* 채팅 사이드바 나왔을때 뒷 배경 반투명하게 */}
                        <div className={`chat-sidebar ${isChatSidebarOpen ? 'open' : ''}`}>
                            <button className='close-button' onClick={toggleChatSidebar}><img src={x} alt='x' height={25} width={25} /></button> {/* 사이드바 닫기 버튼 */}
                            {!selectedChatRoomId ? (
                                <ChatList onSelectChatRoom={handleSelectChatRoom} />
                            ) : (
                                <Chat chatRoomId={selectedChatRoomId} onBack={handleBackToChatList} />
                            )}
                        </div>
                    </>
                )}
            </header>
        </>
    );
};
export default Header;