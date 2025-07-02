import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MypageInfo from './MypageInfo';

// MypageMain 컴포넌트는 마이페이지의 전체 레이아웃을 담당함.
// 좌측 사이드바(메뉴 영역)와 우측 콘텐츠 영역(라우팅된 컴포넌트 표시)을 포함함.
export default function MypageMain() {
  return (
    <div className="mypage-wrap">
      {/* 좌측 사이드바 영역 */}
      <div className="mypage-side">
        <section className="section account-box">
          <div className="account-info">
            {/* 아이콘과 타이틀 */}
            <span className="material-icons">settings</span>
            <span>마이페이지</span>
          </div>
        </section>

        {/* 추가 메뉴 컴포넌트를 넣을 수 있는 자리 */}
        {/* 예) <LeftMenu menuList={menuList} /> */}
      </div>

      {/* 우측 콘텐츠 영역: 라우터에 따라 내부 컴포넌트 변경 */}
      <div className="mypage-content">
        <Routes>
          {/* /mypage/info 경로일 때 MypageInfo 컴포넌트 렌더링 */}
          <Route path="info" element={<MypageInfo />} />
          {/* 추가 페이지가 있으면 여기에 Route 추가 */}
        </Routes>
      </div>
    </div>
  );
}
