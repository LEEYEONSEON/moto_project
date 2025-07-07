import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore"
import createInstance from "../../axios/Interceptor";

export default function WalletMainPage(){

<<<<<<< HEAD
    const [walletCount, setWalletCount] = useState(0);
=======
>>>>>>> master
    const [walletInfo, setWalletInfo] = useState("");
    
    const {loginMember} = useUserStore();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const userNo = loginMember.userNo;

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/wallet/" + userNo;
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
<<<<<<< HEAD
            if(res.data.resData > 0){
                setWalletCount(res.data.resData);
            }else{
                setWalletCount(res.data.resData);
            }
=======
            
            setWalletInfo(res.data.resData);
            
>>>>>>> master
        })
    },[])

    function createWallet(){

    }

    return (
        <>
<<<<<<< HEAD
        {walletCount == 0
        ? <button type="button" onClick={createWallet}>지갑 만들기</button>
        :""}
=======
         {walletInfo.walletNo > 0 
         ? ""
         : <button type="button" onClick={createWallet}>지갑 만들기</button> }
>>>>>>> master
        </>
    )
}