import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

export default function PostView(){

    const [postList, setPostList] = useState([]);
    const [reqPage, setReqPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});
    const [postFileList, setPostFileList] = useState([]);

    const {loginMember} = useUserStore();

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

            setPageInfo(res.data.resData.pageInfo);
            setPostList(res.data.resData.postList);
            setPostFileList(res.data.resData.postFileList);
        })
    },[])
    
    return (
  <>
    <div className="post-list-wrap">
      <div className="post-item-wrap">
        <div className="post-item">
          <table>
            <thead>
              <tr>
                <td>
                  <img
                    src={
                      loginMember
                        ? loginMember.userProfileImg
                          ? serverUrl + "/user/profile" + loginMember.userProfileImg.substring(0, 8) +"/" + loginMember.userProfileImg
                          : "/images/default_img.png"
                        : "/images/default_img.png"
                    }
                    style={{ height: "50px", width: "50px" }}
                  />
                </td>
                <td>{loginMember.userNickname}</td>
              </tr>
            </thead>
            <tbody>
              {postList.map(function(post, index) {
                return (
                  <tr key={"post" + index}>
                    <td>{post.postContent}</td> {/* 게시글 내용 */}
                    {postFileList.map(function(postFile, fIndex) {
                      return (
                        <td key={"postFile" + fIndex}>
                          {post.postNo == postFile.postNo 
                          ? 
                            postFile.postImgPath
                            ?<img src={serverUrl + "/board/" + postFile.postImgPath.substring(0, 8) + "/" + postFile.postImgPath} />
                            :""
                            : ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>
);
}