import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

export default function PostView(){

    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});    
    const [postInfo, setPostInfo] = useState([]);
    const {loginMember} = useUserStore();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    useEffect(function(){
        let options = {}
        options.url = serverUrl + "/post/getList/" + reqPage;
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
          
          const newPostInfo = res.data.resData.postInfo;
          setPostInfo([...postInfo, newPostInfo]);
        })
    },[reqPage])

    return (
  <>
    <div className="post-list-wrap">
      <div className="post-item-wrap">
        <div className="post-item">
          
        </div>
      </div>
    </div>
  </>
);
}