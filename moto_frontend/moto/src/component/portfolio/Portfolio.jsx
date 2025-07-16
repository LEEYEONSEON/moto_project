import { useEffect, useState } from "react";
import "./portfolio.css"; // 필요 시 스타일 작성
import useWsStore from "../../store/useWsStore";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useUserStore from '../../store/useUserStore';
import createInstance from '../../axios/Interceptor';


export default function Portfolio() {
  
  const [myAsset, setMyAsset] = useState([]); //내 보유 자산 불러오기
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tradeType, setTradeType] = useState("");
  const [amount, setAmount] = useState(1);
  const [walletCash, setWalletCash] = useState(0);
  const { loginMember, kakaoMember } = useUserStore();
  const member = loginMember || kakaoMember;

  // 총 거래 금액 계산
  const totalPrice = selectedAsset != null ? selectedAsset.currentPrice * amount : 0;

  // 매수 시 보유 현금 부족 여부
  const notEnoughCash = tradeType === "BUY" && totalPrice > walletCash;


  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();
  const navigate = useNavigate();

   let userNo;
  
  if(loginMember){
    userNo = loginMember.userNo
  }else if(kakaoMember){
    userNo = kakaoMember.userNo
  }else{
    userNo = null;
  }

    //보유중인 자산 불러오기
    useEffect(function() {


        if (member == null) {
        //로그인 하지 않은 회원인 경우
            Swal.fire({
                title : "알림",
                text:"로그인후 이용 가능합니다.",
                icon: "warning",
                confirmButtonText:"확인"
            });

            navigate("/login");

        }else{
                
        //console.log(userNo);
        let options = {
            url: serverUrl + "/portfolio/" + userNo, // ← userNo path로 전달
            method: "get"
        }
        
        axiosInstance(options) 
        .then(function(res) {

            if (res.data.resData!=null) {
            
            const assetList = res.data.resData;

            const updatedAssetList = assetList.map(function(asset) {
                
                return {
                    ...asset,
                    currentPrice: 0,
                    profit: 0,
                    profitRate: 0
                };

            
            });
            
            setMyAsset(updatedAssetList); // ← 리스트 저장
        
            }

            setLoading(false);
        })
        .catch(function(err) {
            console.error("포트폴리오 조회 실패", err);
            setLoading(false);
        });
    }
    
    }, []);
    

    
    // SSE 실시간 가격 업데이트
    useEffect (function () {
        const eventSource = new EventSource(serverUrl + "/asset/price-stream");
        eventSource.addEventListener("asset", function (event) {
        if (!event || !event.data) return;

        const priceData = JSON.parse(event.data);
        if (!priceData.assetCode || priceData.currentPrice == null) return;

        setMyAsset(function (prevList) {
            return prevList.map(function (asset) {
            if (asset.assetCode === priceData.assetCode) {
                const newPrice = priceData.currentPrice;
                const profit = (newPrice - asset.avgBuyPrice) * asset.quantity;
                const profitRate = asset.avgBuyPrice === 0 ? 0 : ((newPrice - asset.avgBuyPrice) / asset.avgBuyPrice) * 100;

                return {
                    ...asset,
                    currentPrice: newPrice,
                    profit: profit,
                    profitRate: profitRate.toFixed(2)
                };
            }
            
            return asset;
            });
        });
        });

    }, []);

    // 로그인 회원 지갑 정보 조회
      useEffect(function () {
        if (!userNo) return; // userNo 없으면 요청 안 함
    
        const options = {
          url: serverUrl + "/wallet/" + userNo,
          method: "get",
        };
    
        axiosInstance(options)
          .then(function (res) {
            setWalletCash(res.data.resData.walletCashBalance);
          })
          .catch(function (err) {
            console.error("지갑 조회 오류:", err);
          });
      }, [userNo]);



    // 주식 시장 마감 여부 판단
    function isMarketClosed() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        return hour < 9 || (hour === 15 && minute > 30) || hour > 15;

    }   

    
    // 거래 요청 함수 (컴포넌트 내부에 선언)
            function handleTradeSubmit(e) {
                if (selectedAsset == null) return;
                if (notEnoughCash) return;
    
                alert(tradeType + " 요청 완료 (총 금액: " + totalPrice + ")");
                setSelectedAsset(null);
                
                    if(tradeType == 'BUY'){
                    const options = {
                    url: serverUrl + "/watchlist/insert", 
                    method: "post",
                    data: {
                        userNo: userNo,
                        tradeType: tradeType,
                        amount: amount,
                        currentPrice: selectedAsset.currentPrice,
                        assetCode : selectedAsset.assetCode
                    },
                    };
        
            axiosInstance(options)
              .then(function (res) {
                Swal.fire({
                  title : "알림",
                  text : res.data.clientMsg,
                  icon : res.data.alertIcon,
                  confirmButtonText : "확인"
                }).then(function(res){
                  if(res.isConfirmed){
                      window.location.reload();
                  }
            })
       })
        
        }else if(tradeType == "SELL"){
      const options = {
                url: serverUrl + "/watchlist/sellAsset", 
                method: "patch",
                data: {
                    userNo: userNo,
                    tradeType: 'SELL',
                    amount: amount,
                    currentPrice: selectedAsset.currentPrice,
                    assetCode : selectedAsset.assetCode
                },
                };
    
        axiosInstance(options)
          .then(function (res) {
             Swal.fire({
                title : "알림",
                text : res.data.clientMsg,
                icon : res.data.alertIcon,
                confirmButtonText : "확인"
            }).then(function(res){
              if(res.isConfirmed){
                 window.location.reload();
              }
                })
      })      
    }
        }

  return (
    <section className="section asset-list">
        <div className="page-title portfolio-title">내 포트폴리오</div>
        <table className="tbl asset-table asset-list">
        <thead>
            <tr>
            <th style={{ textAlign : "center", width : "10%"  }}>종목명</th>
            <th style={{ textAlign : "center", width : "10%"  }}>현재가 <span className="wallet-currency">KRW</span></th>
            <th style={{ textAlign : "center", width : "6%"  }}>보유수량 </th>
            <th style={{ textAlign : "center", width : "10%"  }}>평균단가 <span className="wallet-currency">KRW</span></th>
            <th style={{ textAlign : "center", width : "10%"  }}>손익(P/L) <span className="wallet-currency">KRW</span></th>
            <th style={{ textAlign : "center", width : "10%"  }}>손익률(%)</th>
            <th style={{ textAlign : "center", width: "10%" }}>매수/매도</th>
            </tr>
        </thead>
        <tbody>
            {myAsset.map(function (item) {
            const profit = (item.currentPrice - item.avgBuyPrice) * item.quantity;
            const profitRate = (
                ((item.currentPrice - item.avgBuyPrice) / item.avgBuyPrice) *
                100
            ).toFixed(2);

            let className = "";
            
            if (profit > 0) {
                className = "positive";
            } else if (profit == 0) {
                className = isMarketClosed() ? "closed" : "zero";
            } else if (item.currentPrice == 0) {
                className = "zero";
            } else {
                className = "negative";
            }

            return (
                <tr key={item.assetCode}>
                <td style={{ textAlign : "center"  }}>{item.assetName}</td>
                <td  style={{ textAlign : "right", paddingRight : "80px" }}className={item.currentPrice ? "" : "zero"}>{item.currentPrice ? item.currentPrice.toLocaleString() : "로딩 중..."}</td>
                <td style={{ textAlign : "center"  }}>{item.quantity}</td>
                <td style={{ textAlign : "right", paddingRight : "80px" }}>{item.avgBuyPrice.toLocaleString()}</td>
                <td style={{ textAlign : "right", paddingRight : "80px"  }} className={className}>
                    {item.currentPrice 
                    ?
                    profit.toLocaleString()
                    : "로딩 중..."}
                </td>
                <td style={{ textAlign : "center"  }} className={className}>
                    {item.currentPrice 
                    ?
                    profitRate + "%"
                    : "로딩 중..."
                    }
                    
                </td>
                <td style={{ textAlign : "center"  }}>
                      <button className='trade-button buy-button'
                        onClick={function () {
                          setSelectedAsset(item);
                          setTradeType("BUY");
                          setAmount(1);
                        }}
                      >
                        매수
                      </button>
                      <button className='trade-button sell-button'
                        onClick={function () {
                          setSelectedAsset(item);
                          setTradeType("SELL");
                          setAmount(1);
                        }}
                      >
                        매도
                      </button>
                    </td>
                </tr>
            );
            })}
        </tbody>
        </table>
        {selectedAsset != null  &&(
          <div className="modal">
            <div className="modal-content">
              <h3>{tradeType === "BUY" ? "매수" : "매도"} 확인</h3>
              <p>종목명: {selectedAsset.assetName}</p>
              <p>현재가: {selectedAsset.currentPrice.toLocaleString()} 원</p>
              <p>현재 회원 자산: {walletCash.toLocaleString()} 원</p>

              <label>
                수량:
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={function (e) {
                    setAmount(parseInt(e.target.value));
                  }}
                />
              </label>


              <p>총 금액: {totalPrice.toLocaleString()} 원</p>

              {notEnoughCash && <p style={{ color: "red" }}>보유 현금이 부족합니다.</p>}

              <button onClick={handleTradeSubmit} disabled={notEnoughCash}>
                {tradeType == "BUY" ? "매수" : "매도"} 실행
              </button>
              <button
                onClick={function () {
                  setSelectedAsset(null);
                }}
              >
                취소
              </button>
            </div>
          </div>
        )}
    </section>
    );

}
