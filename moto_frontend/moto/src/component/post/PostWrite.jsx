import { useRef, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function PostWrite(){

        const [content, setContent] = useState();
        const [uploadFile, setUploadFile] = useState([]);
        const axiosInstance = createInstance();
        const {loginMember} = useUserStore();
        
        const userNo = loginMember.userNo;
    
         const uploadFileEl = useRef(false);
         const serverUrl = import.meta.env.VITE_BACK_SERVER;

        const navigate = useNavigate();

        // 모달을 여는 함수
        function openModal() {
            if(loginMember !=null){
                document.getElementById("modal").style.display = "flex";
            }else{
                Swal.fire({
                    title : "알림",
                    text:"로그인후 이용 가능합니다.",
                    icon: "warning",
                    confirmButtonText:"확인"
                });
                navigate("/login");
            }
        }
    
        // 모달을 닫는 함수
        function closeModal() {

            document.getElementById("modal").style.display = "none";
        }    
    
        function chgContent(e){
            setContent(e.target.value);
        }
    
        function chgPostFile(e){
            const files = e.target.files;
            const fileArr = new Array();

            for(let i=0; i<files.length; i++){
                fileArr.push(files[i]);
                console.log(fileArr);
            }
    
            setUploadFile([...uploadFile,...fileArr]);
        }

        function uploadPost(e){
            
        if(content != ''){
            const form = new FormData();    // 파일 업로드시 사용하는 자바스크립트 내장 객체

            form.append("postContent", content);
            form.append("userNo", userNo);
            form.append("loginMember", loginMember);

            if(uploadFile.length>0){
                for(let i=0; i<uploadFile.length; i++){
                    form.append("postFile", uploadFile[i]);
                }
            }
            
            let options = {};
            options.url = serverUrl + "/post/insert";
            options.method = "post";
            options.data = form;
            options.headers = {};
            options.headers.contentType = "multipart/form-data";
            options.headers.processData = false;

            axiosInstance(options)
            .then(function(res){
                setContent("");
                setUploadFile([]);
                closeModal();
            })

        }

    }

    return (
        <>
        <div className="notice-write" style={{width:"500px", height:"100px" }}>
                <form onSubmit={function(e){
                    e.preventDefault();
                    uploadPost();
                    
                }}>
                <table style={{border:"1", background:"white", borderRadius:"5px", width:"400px", marginLeft:"150px"}}>
                    <thead>
                    <tr>
                        <td><img src={loginMember
                                ?
                                    loginMember.userProfileImg
                                    ? serverUrl + "/user/profile" + loginMember.userProfileImg.substring(0,8) + loginMember.userProfileImg
                                    : "/images/default_img.png"
                                :"/images/default_img.png"
                                } style={{height:"50px", width:"50px"}}/>
                        </td>
                        <td>
                            <div>
                                {/* 게시글 작성 버튼 */}
                                
                                <input type="text" id="write" placeholder="무엇을 생각하고 계신가요?" style={{width:"170px", height:"30px",border:"none", }} onClick={openModal} readOnly/>
                                

                            {/* 모달 */}
                            <div id="modal" style={styles.modalOverlay}>
                                <div style={styles.modal}>
                            <h4 style={{textAlign:"left"}}>무엇을 생각하고 계신가요?</h4>
                            <br />
                            <hr />
                            <br />
                            
                                <div>
                                    <textarea id="content" name="content" style={{width: "100%", height: "150px",resize: "none",}}  value={content} onChange={chgContent}></textarea>
                                </div>
                                <br />
                                <hr />
                                <br />

                                <div style={{display:"flex"}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3" style={{cursor:"pointer"}} onClick={function(){
                                        uploadFileEl.current.click();
                                    }}>
                                    <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
                                    <label htmlFor="inputFile" style={{marginRight:"30px"}}>upload</label>
                                    <input type="file" id="inputFile" style={{display:"none"}} multiple ref={uploadFileEl} onChange={chgPostFile} />
                                    
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-80q-33 0-56.5-23.5T120-160v-182l110-125 57 57-80 90h546l-78-88 57-57 108 123v182q0 33-23.5 56.5T760-80H200Zm0-80h560v-80H200v80Zm225-225L284-526q-23-23-22.5-56.5T285-639l196-196q23-23 57-24t57 22l141 141q23 23 24 56t-22 56L538-384q-23 23-56.5 22.5T425-385Zm255-254L539-780 341-582l141 141 198-198ZM200-160v-80 80Z"/></svg>
                                    vote
                                </div>
                                <div>
                                    <h4 style={{textAlign:"left"}}>첨부파일 목록</h4>
                                    {uploadFile.map(function(file,index){
                                        function deleteFile(){
                                            const newUploadFile = uploadFile.filter(function(fFile, findex){
                                                return file != fFile;
                                            })
                                                setUploadFile(newUploadFile);
                                        }

                                        return <p key={"file" + index} style={{textAlign:"left"}}>

                                            


                                            <span>{file.name}</span>
                                            <span className="material-icons del-file-icon" onClick={deleteFile}>
                                                 delete
                                            </span>
                                        </p>

                                    })}
                                </div>
                                <br />
                                <div>
                                    <button type="submit">작성하기</button>
                                <button type="button" onClick={closeModal}>닫기</button>
                                </div>
                            
                                </div>
                            </div>
                            </div> 
                            
                        </td>
                        
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                             <div style={{display:"flex", marginLeft:"20px"}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3" style={{cursor:"pointer"}} onClick={function(){
                                        uploadFileEl.current.click();
                                    }}>
                                    <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
                                    <label htmlFor="inputFile">upload</label>
                                </div>
                        </td>
                        <td>
                             <input type="file" id="inputFile" style={{display:"none"}}  multiple ref={uploadFileEl} onChange={chgPostFile}/>
                                    
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-80q-33 0-56.5-23.5T120-160v-182l110-125 57 57-80 90h546l-78-88 57-57 108 123v182q0 33-23.5 56.5T760-80H200Zm0-80h560v-80H200v80Zm225-225L284-526q-23-23-22.5-56.5T285-639l196-196q23-23 57-24t57 22l141 141q23 23 24 56t-22 56L538-384q-23 23-56.5 22.5T425-385Zm255-254L539-780 341-582l141 141 198-198ZM200-160v-80 80Z"/></svg>
                                    vote
                        </td>
                    </tr>
                    </tbody>
                </table>
                                        </form>
            </div>
        </>
    )
}


const styles = {
  modalOverlay: {
    position: 'fixed', 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    display: 'none', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1000, 
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '100%',
  },
};  