import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";

export default function PostView(){

    const [postList, setPostList] = useState([]);
    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});
    const [postFileList, setPostFileList] = useState([]);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    useEffect(function(){
        let options = {}
        options.url = serverUrl + "/post/getList/" + reqPage;
        options.method = "get";

        axiosInstance(options)
        .then(function(res){
            console.log(res.data.resData.pageInfo);
            console.log(res.data.resData.postList);
            console.log(res.data.resData.postFileList);
        })
    },[])

    return (
        <>
        


        </>
    )
}