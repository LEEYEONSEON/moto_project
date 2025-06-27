-- 사용자 및 관리자 계정을 관리하는 기본 테이블. 로그인/회원가입/권한 구분/프로필 수정에 사용
CREATE TABLE tbl_user (
  user_no NUMBER(10) PRIMARY KEY, 						-- 시퀀스 기반 내부 고유 식별자
  user_id VARCHAR2(50) UNIQUE,  						-- 사용자 고유 ID (로그인용, 중복 불가)
  user_nickname VARCHAR2(50) UNIQUE NOT NULL, 				-- 사용자 닉네임
  user_email VARCHAR2(100) UNIQUE NOT NULL,	 				-- 로그인 이메일
  user_password VARCHAR2(60), -- 암호화된 비밀번호
  user_role CHAR(1) DEFAULT '2' CHECK (user_role IN ('1', '2', '3')), 			-- 1: 관리자, 2: 회원, 3: 정지
  user_join_date DATE DEFAULT SYSDATE NOT NULL, 				-- 가입일
  user_post_like_count NUMBER(10) DEFAULT 0 NOT NULL, 				-- 활동 인기 지표 (게시글 좋아요 수)
  user_comment_like_count NUMBER(10) DEFAULT 0 NOT NULL, 			-- 활동 인기 지표 (댓글 좋아요 수)
  user_sanction_count NUMBER(3) DEFAULT 0 NOT NULL, 				-- 신고 제재 누적 횟수
  user_social_type VARCHAR2(100) DEFAULT 'LOCAL' CHECK (user_social_type IN ('LOCAL', 'KAKAO', 'GOOGLE', 'NAVER')), -- 로그인 방식 구분
  user_profile_img VARCHAR2(300) 						-- 프로필 이미지 경로
);

-- 주식/코인/ETF 등 거래 가능한 모든 자산 정보를 저장
CREATE TABLE tbl_asset (
  asset_no NUMBER(10) PRIMARY KEY, 						-- 자산 고유 번호
  asset_name VARCHAR2(100) NOT NULL, 					-- 자산 이름 (예: 삼성전자)
  asset_code VARCHAR2(30) NOT NULL, 						-- 종목 코드 (예: 005930, BTC)
  asset_type VARCHAR2(20) CHECK (asset_type IN ('STOCK_KR', 'STOCK_US', 'CRYPTO')), -- 자산 유형
  asset_currency VARCHAR2(10) NOT NULL					-- 거래 통화 (KRW, USD 등)
);

-- 종목별 과거 가격 데이터를 저장. 차트 API 없이도 수익률 계산 가능
CREATE TABLE tbl_asset_price_history (
  price_no NUMBER(10) PRIMARY KEY, 						-- 이력 고유 번호
  asset_no NUMBER(10) REFERENCES tbl_asset(asset_no),	 			-- 해당 자산 번호
  price_history NUMBER(15,2) NOT NULL, 					-- 해당 시점 가격 (종가)
  price_date DATE NOT NULL 							-- 가격 기록 일자
);

-- 사용자 매수/매도 거래 내역 저장. 포트폴리오 수익률 계산의 기반
CREATE TABLE tbl_trade (
  trade_no NUMBER(10) PRIMARY KEY, 						-- 거래 고유 번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 거래자
  asset_no NUMBER(10) REFERENCES tbl_asset(asset_no), 				-- 거래된 자산
  trade_type VARCHAR2(10) CHECK (trade_type IN ('BUY', 'SELL')), 			-- 거래 타입
  trade_quantity NUMBER(15,6) NOT NULL, 					-- 수량
  trade_price NUMBER(15,2) NOT NULL, 						-- 단가
  trade_date DATE DEFAULT SYSDATE NOT NULL 					-- 거래 일자
);

-- 사용자별 포트폴리오 묶음. 여러 종목을 묶어 수익률 분석 가능
CREATE TABLE tbl_portfolio (
  portfolio_no NUMBER(10) PRIMARY KEY, 					-- 포트폴리오 고유번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 소유자
  portfolio_name VARCHAR2(100) NOT NULL 					-- 포트폴리오 이름
);

-- 현재 보유 중인 종목 목록 저장. 포트폴리오 화면에 활용
CREATE TABLE tbl_holding (
  holding_no NUMBER(10) PRIMARY KEY, 					-- 보유 정보 고유 번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 보유자
  asset_no NUMBER(10) REFERENCES tbl_asset(asset_no), 				-- 자산 ID
  portfolio_no NUMBER(10) REFERENCES tbl_portfolio(portfolio_no), 			-- 소속 포트폴리오
  holding_asset_quantity NUMBER(15,6) NOT NULL, 				-- 보유 수량
  holding_avg_price NUMBER(15,2) NOT NULL 					-- 평균 매입단가
);

-- 사용자 보유 현금 및 총 자산 평가액 저장
CREATE TABLE tbl_wallet (
  wallet_no NUMBER(10) PRIMARY KEY, 						-- 지갑 고유번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no),		 		-- 소유자
  wallet_cash_balance NUMBER(15,2) DEFAULT 0 NOT NULL, 				-- 현금 잔액
  wallet_total_valuation NUMBER(15,2) DEFAULT 0 NOT NULL 				-- 총 평가 금액
);

-- 주문 요청 (지정가, 시장가 등) 저장. 거래 실행 전 상태 관리
CREATE TABLE tbl_trade_order (
  order_no NUMBER(10) PRIMARY KEY, 						-- 주문 고유 번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 사용자
  asset_no NUMBER(10) REFERENCES tbl_asset(asset_no), 				-- 자산
  order_type VARCHAR2(10) CHECK (order_type IN ('LIMIT', 'MARKET')), 			-- 주문 유형
  order_status VARCHAR2(10) CHECK (order_status IN ('PENDING', 'FILLED', 'CANCELLED')) -- 주문 상태
);

-- 사용자간의 카피트레이딩 내역 저장
CREATE TABLE tbl_copy_trading (
  copy_trading_no NUMBER(10) PRIMARY KEY, 					-- 카피트레이딩 고유 ID
  copier_no NUMBER(10) REFERENCES tbl_user(user_no) NOT NULL, 			-- 카피한 사용자
  copied_no NUMBER(10) REFERENCES tbl_user(user_no) NOT NULL, 			-- 대상 사용자
  copy_amount NUMBER(15,2) NOT NULL 					-- 복사 금액
);

-- 팔로우 내역. 게시글 피드 필터링에 사용
CREATE TABLE tbl_follow (
  follow_no NUMBER(10) PRIMARY KEY, 						-- 팔로우 고유 ID
  follower_no NUMBER(10) REFERENCES tbl_user(user_no) NOT NULL, 			-- 팔로워
  followee_type VARCHAR2(30) CHECK (followee_type IN ('ASSET', 'USER')) NOT NULL, 	-- 대상 유형
  followee_no NUMBER(10) NOT NULL 						-- 대상 ID
);


-- 관심 종목을 그룹화한 사용자 전용 목록 (예: 내 코인, AI 관심주)
CREATE TABLE tbl_watchlist (
  watchlist_no NUMBER(10) PRIMARY KEY, 					-- 워치리스트 번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no),			 	-- 소유자
  watchlist_name VARCHAR2(100) UNIQUE NOT NULL 				-- 워치리스트 이름
);

-- 각 워치리스트에 속한 종목들. 관심 종목 추가/삭제 시 사용
CREATE TABLE tbl_watchlist_item (
  watchlist_item_no NUMBER(10) PRIMARY KEY, 					-- 항목 고유번호
  watchlist_no NUMBER(10) REFERENCES tbl_watchlist(watchlist_no), 			-- 소속 워치리스트
  watchlist_item_type VARCHAR2(30) NOT NULL, 					-- 항목 구분 (ASSET 등)
  watchlist_item_id NUMBER(10) NOT NULL 					-- 항목 대상 고유번호
);

-- 특정 종목이 지정가에 도달 시 알림을 보내기 위한 조건 테이블
CREATE TABLE tbl_asset_alert (
  alert_no NUMBER(10) PRIMARY KEY, 						-- 알림 조건 고유번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 사용자
  asset_no NUMBER(10) REFERENCES tbl_asset(asset_no), 				-- 자산
  alert_target_price NUMBER(15,2) NOT NULL 					-- 목표가격
);

-- 알림 내역을 저장. 사용자 알림창에 표시되는 내용
CREATE TABLE tbl_notification (
  notification_no NUMBER(10) PRIMARY KEY, 					-- 알림 고유번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 대상 사용자
  notification_content VARCHAR2(400) NOT NULL, 					-- 알림 내용
  notification_is_read CHAR(1) DEFAULT 'N' CHECK (notification_is_read IN ('Y', 'N')), 	-- 읽음 여부
  notification_date DATE DEFAULT SYSDATE 					-- 알림 생성 시점
);

-- 커뮤니티 게시글 테이블. 종목/유저 멘션, 이미지, 투표 포함 가능
CREATE TABLE tbl_post (
  post_no NUMBER(10) PRIMARY KEY, 						-- 게시글 고유번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 작성자
  post_content VARCHAR2(4000) NOT NULL, 					-- 내용
  post_date DATE DEFAULT SYSDATE, 						-- 작성일
  post_comment_cnt NUMBER DEFAULT 0, 					-- 댓글 수
  post_like_cnt NUMBER DEFAULT 0 						-- 좋아요 수
);

-- 게시글에 달린 댓글
CREATE TABLE tbl_comment (
  comment_no NUMBER(10) PRIMARY KEY, 					-- 댓글 고유번호
  post_no NUMBER(10) REFERENCES tbl_post(post_no), 				-- 소속 게시글
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 작성자
  comment_content VARCHAR2(4000) NOT NULL, 					-- 내용
  comment_date DATE DEFAULT SYSDATE, 					-- 작성일
  parent_comment_no NUMBER(10) REFERENCES tbl_comment(comment_no), 		-- 부모 댓글 (대댓글)
  comment_like_cnt NUMBER DEFAULT 0 					-- 좋아요 수
);

-- 게시글 이미지 테이블
CREATE TABLE tbl_post_image (
  post_img_no NUMBER(10) PRIMARY KEY, 					-- 게시글 이미지 고유번호
  post_no NUMBER(10) REFERENCES tbl_post(post_no) ON DELETE CASCADE, 		-- 게시글
  post_img_path VARCHAR2(500) NOT NULL,				 	-- 이미지 경로(URL)
  post_img_name VARCHAR2(500) NOT NULL,				 	-- 이미지 저장명
  post_img_upload_date DATE DEFAULT SYSDATE,					 -- 업로드 날짜
  post_img_file_order NUMBER(3) DEFAULT 1				 	-- 이미지 순서
);

-- 댓글 이미지 테이블
CREATE TABLE tbl_comment_image (
  comment_img_no NUMBER(10) PRIMARY KEY, 					-- 댓글 이미지 고유번호
  comment_no NUMBER(10) REFERENCES tbl_comment(comment_no) ON DELETE CASCADE, -- 댓글
  comment_img_path VARCHAR2(500) NOT NULL, 					-- 이미지 경로
  comment_img_name VARCHAR2(500) NOT NULL, 					-- 이미지 저장명
  comment_img_upload_date DATE DEFAULT SYSDATE 				-- 업로드 날짜
);

-- 좋아요 테이블 (게시글, 댓글 통합 관리)
CREATE TABLE tbl_like (
  like_no NUMBER(10) PRIMARY KEY, 						-- 좋아요 고유번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 사용자
  like_target_type VARCHAR2(10) CHECK (like_target_type IN ('POST', 'COMMENT')), 	-- 대상 구분
  like_target_id NUMBER(10), 							-- 대상 ID
  CONSTRAINT unique_like_once UNIQUE (user_no, like_target_type, like_target_id) 	-- 중복 방지
);

-- 게시글에 멘션된 종목/사용자 정보 저장
CREATE TABLE tbl_post_mention (
  mention_no NUMBER(10) PRIMARY KEY,			 		-- 멘션 고유번호
  post_no NUMBER(10) REFERENCES tbl_post(post_no),		 		-- 게시글
  mention_type VARCHAR2(10) CHECK (mention_type IN ('ASSET', 'USER')), 		-- 멘션 유형
  mention_target_no NUMBER(10) 						-- 멘션 대상 ID
);

-- 게시글에 포함된 투표
CREATE TABLE tbl_vote (
  vote_no NUMBER(10) PRIMARY KEY, 						-- 투표 고유번호
  post_no NUMBER(10) REFERENCES tbl_post(post_no),				 -- 게시글
  vote_question VARCHAR2(200) NOT NULL 					-- 투표 질문
);

-- 투표 옵션 정보
CREATE TABLE tbl_vote_option (
  option_no NUMBER(10) PRIMARY KEY, 						-- 옵션 고유 번호
  vote_no NUMBER(10) REFERENCES tbl_vote(vote_no), 				-- 투표
  option_text VARCHAR2(200) NOT NULL, 					-- 옵션 텍스트
  option_count NUMBER DEFAULT 0 						-- 선택 횟수
);

-- 실제 유저 응답 정보 저장
CREATE TABLE tbl_vote_result (
  vote_result_no NUMBER(10) PRIMARY KEY, 					-- 응답 고유번호
  vote_no NUMBER(10) REFERENCES tbl_vote(vote_no), 				-- 투표
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 사용자
  option_no NUMBER(10) REFERENCES tbl_vote_option(option_no) 			-- 선택한 옵션
);

-- 게시글/댓글 신고 정보 저장
CREATE TABLE tbl_report (
  report_no NUMBER(10) PRIMARY KEY, 						-- 신고 고유번호
  reporter_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 신고자
  report_target_type VARCHAR2(10) CHECK (report_target_type IN ('POST', 'COMMENT')), 	-- 대상 유형
  report_target_no NUMBER(10) NOT NULL, 					-- 대상 ID
  report_reason VARCHAR2(400) NOT NULL, 					-- 신고 사유
  report_date DATE DEFAULT SYSDATE, 						-- 신고 날짜
  report_is_handled CHAR(1) DEFAULT 'N' CHECK (report_is_handled IN ('Y', 'N')), 		-- 처리 여부
  report_handle_date DATE 							-- 처리 일자
);

-- 사용자 수익률 통계
CREATE TABLE tbl_profit_stat (
  stat_no NUMBER(10) PRIMARY KEY, 						-- 통계 고유번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- 사용자
  stat_period VARCHAR2(20) NOT NULL, 						-- 기간 (예: 2024-Q2)
  stat_return_rate NUMBER(7,2) NOT NULL 					-- 수익률(%)
);

-- 가상자산 복구 요청 기록
CREATE TABLE tbl_recovery_request (
  recovery_no NUMBER(10) PRIMARY KEY, 					-- 복구 요청 고유번호
  user_no NUMBER(10) REFERENCES tbl_user(user_no) NOT NULL, 			-- 요청자
  post_no NUMBER(10) UNIQUE REFERENCES tbl_post(post_no), 			-- 1회만 허용 (게시글 1건당 1회)
  recovery_is_approved CHAR(1) DEFAULT 'N' CHECK (recovery_is_approved IN ('Y', 'N')), 	-- 승인 여부
  recovery_request_date DATE DEFAULT SYSDATE, 					-- 요청 일자
  recovery_approve_date DATE 							-- 승인 일자
);

-- KRW 기준 환율 정보 저장. 매수/매도 시 환산에 사용
CREATE TABLE tbl_exchange_rate (
  exchange_no NUMBER(10) PRIMARY KEY, 					-- 환율 고유번호
  exchange_target_currency VARCHAR2(10) NOT NULL, 				-- 환산 대상 통화 (예: USD)
  exchange_rate_to_krw NUMBER(15,6) NOT NULL, 					-- 대상통화 1단위당 KRW 환산값
  exchange_date DATE DEFAULT TRUNC(SYSDATE) NOT NULL, 			-- 환율 기준 날짜 (일 단위)
  CONSTRAINT uq_exchange_date_currency UNIQUE (exchange_target_currency, exchange_date) -- 날짜별 통화 유니크
);



-- 1. 사용자
CREATE SEQUENCE seq_user_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 2. 종목
CREATE SEQUENCE seq_asset_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 3. 시세 이력
CREATE SEQUENCE seq_price_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 4. 거래 내역
CREATE SEQUENCE seq_trade_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 5. 보유 종목
CREATE SEQUENCE seq_holding_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 6. 포트폴리오
CREATE SEQUENCE seq_portfolio_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 7. 지갑
CREATE SEQUENCE seq_wallet_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 8. 주문 요청
CREATE SEQUENCE seq_order_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 9. 카피트레이딩
CREATE SEQUENCE seq_copy_trading_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 10. 팔로우
CREATE SEQUENCE seq_follow_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 11. 워치리스트
CREATE SEQUENCE seq_watchlist_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 12. 워치리스트 항목
CREATE SEQUENCE seq_watchlist_item_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 13. 자산 알림
CREATE SEQUENCE seq_alert_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 14. 알림
CREATE SEQUENCE seq_notification_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 15. 게시글
CREATE SEQUENCE seq_post_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 16. 댓글
CREATE SEQUENCE seq_comment_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 17. 게시글 이미지
CREATE SEQUENCE seq_post_img_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 18. 댓글 이미지
CREATE SEQUENCE seq_comment_img_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 19. 좋아요
CREATE SEQUENCE seq_like_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 20. 게시글 멘션
CREATE SEQUENCE seq_mention_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 21. 투표
CREATE SEQUENCE seq_vote_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 22. 투표 옵션
CREATE SEQUENCE seq_option_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 23. 투표 결과
CREATE SEQUENCE seq_vote_result_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 24. 신고
CREATE SEQUENCE seq_report_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 25. 수익률 통계
CREATE SEQUENCE seq_stat_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 26. 복구 요청
CREATE SEQUENCE seq_recovery_no START WITH 1 INCREMENT BY 1 NOCACHE;

--27. 환율
CREATE SEQUENCE seq_exchange_no START WITH 1 INCREMENT BY 1 NOCACHE;



