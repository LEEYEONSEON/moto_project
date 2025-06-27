-- ����� �� ������ ������ �����ϴ� �⺻ ���̺�. �α���/ȸ������/���� ����/������ ������ ���
CREATE TABLE tbl_user (
  user_no NUMBER(10) PRIMARY KEY, 						-- ������ ��� ���� ���� �ĺ���
  user_id VARCHAR2(50) UNIQUE,  						-- ����� ���� ID (�α��ο�, �ߺ� �Ұ�)
  user_nickname VARCHAR2(50) UNIQUE NOT NULL, 				-- ����� �г���
  user_email VARCHAR2(100) UNIQUE NOT NULL,	 				-- �α��� �̸���
  user_password VARCHAR2(60), -- ��ȣȭ�� ��й�ȣ
  user_role CHAR(1) DEFAULT '2' CHECK (user_role IN ('1', '2', '3')), 			-- 1: ������, 2: ȸ��, 3: ����
  user_join_date DATE DEFAULT SYSDATE NOT NULL, 				-- ������
  user_post_like_count NUMBER(10) DEFAULT 0 NOT NULL, 				-- Ȱ�� �α� ��ǥ (�Խñ� ���ƿ� ��)
  user_comment_like_count NUMBER(10) DEFAULT 0 NOT NULL, 			-- Ȱ�� �α� ��ǥ (��� ���ƿ� ��)
  user_sanction_count NUMBER(3) DEFAULT 0 NOT NULL, 				-- �Ű� ���� ���� Ƚ��
  user_social_type VARCHAR2(100) DEFAULT 'LOCAL' CHECK (user_social_type IN ('LOCAL', 'KAKAO', 'GOOGLE', 'NAVER')), -- �α��� ��� ����
  user_profile_img VARCHAR2(300) 						-- ������ �̹��� ���
);

-- �ֽ�/����/ETF �� �ŷ� ������ ��� �ڻ� ������ ����
CREATE TABLE tbl_asset (
  asset_no NUMBER(10) PRIMARY KEY, 						-- �ڻ� ���� ��ȣ
  asset_name VARCHAR2(100) NOT NULL, 					-- �ڻ� �̸� (��: �Ｚ����)
  asset_code VARCHAR2(30) NOT NULL, 						-- ���� �ڵ� (��: 005930, BTC)
  asset_type VARCHAR2(20) CHECK (asset_type IN ('STOCK_KR', 'STOCK_US', 'CRYPTO')), -- �ڻ� ����
  asset_currency VARCHAR2(10) NOT NULL					-- �ŷ� ��ȭ (KRW, USD ��)
);

-- ���� ���� ���� �����͸� ����. ��Ʈ API ���̵� ���ͷ� ��� ����
CREATE TABLE tbl_asset_price_history (
  price_no NUMBER(10) PRIMARY KEY, 						-- �̷� ���� ��ȣ
  asset_no NUMBER(10) REFERENCES tbl_asset(asset_no),	 			-- �ش� �ڻ� ��ȣ
  price_history NUMBER(15,2) NOT NULL, 					-- �ش� ���� ���� (����)
  price_date DATE NOT NULL 							-- ���� ��� ����
);

-- ����� �ż�/�ŵ� �ŷ� ���� ����. ��Ʈ������ ���ͷ� ����� ���
CREATE TABLE tbl_trade (
  trade_no NUMBER(10) PRIMARY KEY, 						-- �ŷ� ���� ��ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- �ŷ���
  asset_no NUMBER(10) REFERENCES tbl_asset(asset_no), 				-- �ŷ��� �ڻ�
  trade_type VARCHAR2(10) CHECK (trade_type IN ('BUY', 'SELL')), 			-- �ŷ� Ÿ��
  trade_quantity NUMBER(15,6) NOT NULL, 					-- ����
  trade_price NUMBER(15,2) NOT NULL, 						-- �ܰ�
  trade_date DATE DEFAULT SYSDATE NOT NULL 					-- �ŷ� ����
);

-- ����ں� ��Ʈ������ ����. ���� ������ ���� ���ͷ� �м� ����
CREATE TABLE tbl_portfolio (
  portfolio_no NUMBER(10) PRIMARY KEY, 					-- ��Ʈ������ ������ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- ������
  portfolio_name VARCHAR2(100) NOT NULL 					-- ��Ʈ������ �̸�
);

-- ���� ���� ���� ���� ��� ����. ��Ʈ������ ȭ�鿡 Ȱ��
CREATE TABLE tbl_holding (
  holding_no NUMBER(10) PRIMARY KEY, 					-- ���� ���� ���� ��ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- ������
  asset_no NUMBER(10) REFERENCES tbl_asset(asset_no), 				-- �ڻ� ID
  portfolio_no NUMBER(10) REFERENCES tbl_portfolio(portfolio_no), 			-- �Ҽ� ��Ʈ������
  holding_asset_quantity NUMBER(15,6) NOT NULL, 				-- ���� ����
  holding_avg_price NUMBER(15,2) NOT NULL 					-- ��� ���Դܰ�
);

-- ����� ���� ���� �� �� �ڻ� �򰡾� ����
CREATE TABLE tbl_wallet (
  wallet_no NUMBER(10) PRIMARY KEY, 						-- ���� ������ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no),		 		-- ������
  wallet_cash_balance NUMBER(15,2) DEFAULT 0 NOT NULL, 				-- ���� �ܾ�
  wallet_total_valuation NUMBER(15,2) DEFAULT 0 NOT NULL 				-- �� �� �ݾ�
);

-- �ֹ� ��û (������, ���尡 ��) ����. �ŷ� ���� �� ���� ����
CREATE TABLE tbl_trade_order (
  order_no NUMBER(10) PRIMARY KEY, 						-- �ֹ� ���� ��ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- �����
  asset_no NUMBER(10) REFERENCES tbl_asset(asset_no), 				-- �ڻ�
  order_type VARCHAR2(10) CHECK (order_type IN ('LIMIT', 'MARKET')), 			-- �ֹ� ����
  order_status VARCHAR2(10) CHECK (order_status IN ('PENDING', 'FILLED', 'CANCELLED')) -- �ֹ� ����
);

-- ����ڰ��� ī��Ʈ���̵� ���� ����
CREATE TABLE tbl_copy_trading (
  copy_trading_no NUMBER(10) PRIMARY KEY, 					-- ī��Ʈ���̵� ���� ID
  copier_no NUMBER(10) REFERENCES tbl_user(user_no) NOT NULL, 			-- ī���� �����
  copied_no NUMBER(10) REFERENCES tbl_user(user_no) NOT NULL, 			-- ��� �����
  copy_amount NUMBER(15,2) NOT NULL 					-- ���� �ݾ�
);

-- �ȷο� ����. �Խñ� �ǵ� ���͸��� ���
CREATE TABLE tbl_follow (
  follow_no NUMBER(10) PRIMARY KEY, 						-- �ȷο� ���� ID
  follower_no NUMBER(10) REFERENCES tbl_user(user_no) NOT NULL, 			-- �ȷο�
  followee_type VARCHAR2(30) CHECK (followee_type IN ('ASSET', 'USER')) NOT NULL, 	-- ��� ����
  followee_no NUMBER(10) NOT NULL 						-- ��� ID
);


-- ���� ������ �׷�ȭ�� ����� ���� ��� (��: �� ����, AI ������)
CREATE TABLE tbl_watchlist (
  watchlist_no NUMBER(10) PRIMARY KEY, 					-- ��ġ����Ʈ ��ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no),			 	-- ������
  watchlist_name VARCHAR2(100) UNIQUE NOT NULL 				-- ��ġ����Ʈ �̸�
);

-- �� ��ġ����Ʈ�� ���� �����. ���� ���� �߰�/���� �� ���
CREATE TABLE tbl_watchlist_item (
  watchlist_item_no NUMBER(10) PRIMARY KEY, 					-- �׸� ������ȣ
  watchlist_no NUMBER(10) REFERENCES tbl_watchlist(watchlist_no), 			-- �Ҽ� ��ġ����Ʈ
  watchlist_item_type VARCHAR2(30) NOT NULL, 					-- �׸� ���� (ASSET ��)
  watchlist_item_id NUMBER(10) NOT NULL 					-- �׸� ��� ������ȣ
);

-- Ư�� ������ �������� ���� �� �˸��� ������ ���� ���� ���̺�
CREATE TABLE tbl_asset_alert (
  alert_no NUMBER(10) PRIMARY KEY, 						-- �˸� ���� ������ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- �����
  asset_no NUMBER(10) REFERENCES tbl_asset(asset_no), 				-- �ڻ�
  alert_target_price NUMBER(15,2) NOT NULL 					-- ��ǥ����
);

-- �˸� ������ ����. ����� �˸�â�� ǥ�õǴ� ����
CREATE TABLE tbl_notification (
  notification_no NUMBER(10) PRIMARY KEY, 					-- �˸� ������ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- ��� �����
  notification_content VARCHAR2(400) NOT NULL, 					-- �˸� ����
  notification_is_read CHAR(1) DEFAULT 'N' CHECK (notification_is_read IN ('Y', 'N')), 	-- ���� ����
  notification_date DATE DEFAULT SYSDATE 					-- �˸� ���� ����
);

-- Ŀ�´�Ƽ �Խñ� ���̺�. ����/���� ���, �̹���, ��ǥ ���� ����
CREATE TABLE tbl_post (
  post_no NUMBER(10) PRIMARY KEY, 						-- �Խñ� ������ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- �ۼ���
  post_content VARCHAR2(4000) NOT NULL, 					-- ����
  post_date DATE DEFAULT SYSDATE, 						-- �ۼ���
  post_comment_cnt NUMBER DEFAULT 0, 					-- ��� ��
  post_like_cnt NUMBER DEFAULT 0 						-- ���ƿ� ��
);

-- �Խñۿ� �޸� ���
CREATE TABLE tbl_comment (
  comment_no NUMBER(10) PRIMARY KEY, 					-- ��� ������ȣ
  post_no NUMBER(10) REFERENCES tbl_post(post_no), 				-- �Ҽ� �Խñ�
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- �ۼ���
  comment_content VARCHAR2(4000) NOT NULL, 					-- ����
  comment_date DATE DEFAULT SYSDATE, 					-- �ۼ���
  parent_comment_no NUMBER(10) REFERENCES tbl_comment(comment_no), 		-- �θ� ��� (����)
  comment_like_cnt NUMBER DEFAULT 0 					-- ���ƿ� ��
);

-- �Խñ� �̹��� ���̺�
CREATE TABLE tbl_post_image (
  post_img_no NUMBER(10) PRIMARY KEY, 					-- �Խñ� �̹��� ������ȣ
  post_no NUMBER(10) REFERENCES tbl_post(post_no) ON DELETE CASCADE, 		-- �Խñ�
  post_img_path VARCHAR2(500) NOT NULL,				 	-- �̹��� ���(URL)
  post_img_name VARCHAR2(500) NOT NULL,				 	-- �̹��� �����
  post_img_upload_date DATE DEFAULT SYSDATE,					 -- ���ε� ��¥
  post_img_file_order NUMBER(3) DEFAULT 1				 	-- �̹��� ����
);

-- ��� �̹��� ���̺�
CREATE TABLE tbl_comment_image (
  comment_img_no NUMBER(10) PRIMARY KEY, 					-- ��� �̹��� ������ȣ
  comment_no NUMBER(10) REFERENCES tbl_comment(comment_no) ON DELETE CASCADE, -- ���
  comment_img_path VARCHAR2(500) NOT NULL, 					-- �̹��� ���
  comment_img_name VARCHAR2(500) NOT NULL, 					-- �̹��� �����
  comment_img_upload_date DATE DEFAULT SYSDATE 				-- ���ε� ��¥
);

-- ���ƿ� ���̺� (�Խñ�, ��� ���� ����)
CREATE TABLE tbl_like (
  like_no NUMBER(10) PRIMARY KEY, 						-- ���ƿ� ������ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- �����
  like_target_type VARCHAR2(10) CHECK (like_target_type IN ('POST', 'COMMENT')), 	-- ��� ����
  like_target_id NUMBER(10), 							-- ��� ID
  CONSTRAINT unique_like_once UNIQUE (user_no, like_target_type, like_target_id) 	-- �ߺ� ����
);

-- �Խñۿ� ��ǵ� ����/����� ���� ����
CREATE TABLE tbl_post_mention (
  mention_no NUMBER(10) PRIMARY KEY,			 		-- ��� ������ȣ
  post_no NUMBER(10) REFERENCES tbl_post(post_no),		 		-- �Խñ�
  mention_type VARCHAR2(10) CHECK (mention_type IN ('ASSET', 'USER')), 		-- ��� ����
  mention_target_no NUMBER(10) 						-- ��� ��� ID
);

-- �Խñۿ� ���Ե� ��ǥ
CREATE TABLE tbl_vote (
  vote_no NUMBER(10) PRIMARY KEY, 						-- ��ǥ ������ȣ
  post_no NUMBER(10) REFERENCES tbl_post(post_no),				 -- �Խñ�
  vote_question VARCHAR2(200) NOT NULL 					-- ��ǥ ����
);

-- ��ǥ �ɼ� ����
CREATE TABLE tbl_vote_option (
  option_no NUMBER(10) PRIMARY KEY, 						-- �ɼ� ���� ��ȣ
  vote_no NUMBER(10) REFERENCES tbl_vote(vote_no), 				-- ��ǥ
  option_text VARCHAR2(200) NOT NULL, 					-- �ɼ� �ؽ�Ʈ
  option_count NUMBER DEFAULT 0 						-- ���� Ƚ��
);

-- ���� ���� ���� ���� ����
CREATE TABLE tbl_vote_result (
  vote_result_no NUMBER(10) PRIMARY KEY, 					-- ���� ������ȣ
  vote_no NUMBER(10) REFERENCES tbl_vote(vote_no), 				-- ��ǥ
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- �����
  option_no NUMBER(10) REFERENCES tbl_vote_option(option_no) 			-- ������ �ɼ�
);

-- �Խñ�/��� �Ű� ���� ����
CREATE TABLE tbl_report (
  report_no NUMBER(10) PRIMARY KEY, 						-- �Ű� ������ȣ
  reporter_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- �Ű���
  report_target_type VARCHAR2(10) CHECK (report_target_type IN ('POST', 'COMMENT')), 	-- ��� ����
  report_target_no NUMBER(10) NOT NULL, 					-- ��� ID
  report_reason VARCHAR2(400) NOT NULL, 					-- �Ű� ����
  report_date DATE DEFAULT SYSDATE, 						-- �Ű� ��¥
  report_is_handled CHAR(1) DEFAULT 'N' CHECK (report_is_handled IN ('Y', 'N')), 		-- ó�� ����
  report_handle_date DATE 							-- ó�� ����
);

-- ����� ���ͷ� ���
CREATE TABLE tbl_profit_stat (
  stat_no NUMBER(10) PRIMARY KEY, 						-- ��� ������ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no), 				-- �����
  stat_period VARCHAR2(20) NOT NULL, 						-- �Ⱓ (��: 2024-Q2)
  stat_return_rate NUMBER(7,2) NOT NULL 					-- ���ͷ�(%)
);

-- �����ڻ� ���� ��û ���
CREATE TABLE tbl_recovery_request (
  recovery_no NUMBER(10) PRIMARY KEY, 					-- ���� ��û ������ȣ
  user_no NUMBER(10) REFERENCES tbl_user(user_no) NOT NULL, 			-- ��û��
  post_no NUMBER(10) UNIQUE REFERENCES tbl_post(post_no), 			-- 1ȸ�� ��� (�Խñ� 1�Ǵ� 1ȸ)
  recovery_is_approved CHAR(1) DEFAULT 'N' CHECK (recovery_is_approved IN ('Y', 'N')), 	-- ���� ����
  recovery_request_date DATE DEFAULT SYSDATE, 					-- ��û ����
  recovery_approve_date DATE 							-- ���� ����
);

-- KRW ���� ȯ�� ���� ����. �ż�/�ŵ� �� ȯ�꿡 ���
CREATE TABLE tbl_exchange_rate (
  exchange_no NUMBER(10) PRIMARY KEY, 					-- ȯ�� ������ȣ
  exchange_target_currency VARCHAR2(10) NOT NULL, 				-- ȯ�� ��� ��ȭ (��: USD)
  exchange_rate_to_krw NUMBER(15,6) NOT NULL, 					-- �����ȭ 1������ KRW ȯ�갪
  exchange_date DATE DEFAULT TRUNC(SYSDATE) NOT NULL, 			-- ȯ�� ���� ��¥ (�� ����)
  CONSTRAINT uq_exchange_date_currency UNIQUE (exchange_target_currency, exchange_date) -- ��¥�� ��ȭ ����ũ
);



-- 1. �����
CREATE SEQUENCE seq_user_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 2. ����
CREATE SEQUENCE seq_asset_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 3. �ü� �̷�
CREATE SEQUENCE seq_price_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 4. �ŷ� ����
CREATE SEQUENCE seq_trade_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 5. ���� ����
CREATE SEQUENCE seq_holding_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 6. ��Ʈ������
CREATE SEQUENCE seq_portfolio_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 7. ����
CREATE SEQUENCE seq_wallet_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 8. �ֹ� ��û
CREATE SEQUENCE seq_order_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 9. ī��Ʈ���̵�
CREATE SEQUENCE seq_copy_trading_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 10. �ȷο�
CREATE SEQUENCE seq_follow_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 11. ��ġ����Ʈ
CREATE SEQUENCE seq_watchlist_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 12. ��ġ����Ʈ �׸�
CREATE SEQUENCE seq_watchlist_item_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 13. �ڻ� �˸�
CREATE SEQUENCE seq_alert_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 14. �˸�
CREATE SEQUENCE seq_notification_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 15. �Խñ�
CREATE SEQUENCE seq_post_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 16. ���
CREATE SEQUENCE seq_comment_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 17. �Խñ� �̹���
CREATE SEQUENCE seq_post_img_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 18. ��� �̹���
CREATE SEQUENCE seq_comment_img_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 19. ���ƿ�
CREATE SEQUENCE seq_like_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 20. �Խñ� ���
CREATE SEQUENCE seq_mention_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 21. ��ǥ
CREATE SEQUENCE seq_vote_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 22. ��ǥ �ɼ�
CREATE SEQUENCE seq_option_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 23. ��ǥ ���
CREATE SEQUENCE seq_vote_result_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 24. �Ű�
CREATE SEQUENCE seq_report_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 25. ���ͷ� ���
CREATE SEQUENCE seq_stat_no START WITH 1 INCREMENT BY 1 NOCACHE;

-- 26. ���� ��û
CREATE SEQUENCE seq_recovery_no START WITH 1 INCREMENT BY 1 NOCACHE;

--27. ȯ��
CREATE SEQUENCE seq_exchange_no START WITH 1 INCREMENT BY 1 NOCACHE;



