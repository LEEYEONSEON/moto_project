import { useRef, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './postWrite.css';

function PostWrite() {

    const [content, setContent] = useState("");
    const [uploadFile, setUploadFile] = useState([]);
    const axiosInstance = createInstance();
    const uploadFileEl = useRef(null);
    const navigate = useNavigate();

    const { loginMember, kakaoMember } = useUserStore();

    let member = null;
    if (loginMember != null) {
        member = loginMember;
    } else if (kakaoMember != null) {
        member = kakaoMember;
    }

    let userNo = null;
    if (member != null) {
        userNo = member.userNo;
    }

    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    function openModal() {
        if (loginMember != null || kakaoMember != null) {
            document.getElementById("modal").style.display = "flex";
        } else {
            Swal.fire({
                title: "알림",
                text: "로그인후 이용 가능합니다.",
                icon: "warning",
                confirmButtonText: "확인"
            });
            navigate("/login");
        }
    }

    function closeModal() {
        document.getElementById("modal").style.display = "none";
    }

    function chgContent(e) {
        setContent(e.target.value);
    }

    function chgPostFile(e) {
        const files = e.target.files;
        const fileArr = [];

        for (let i = 0; i < files.length; i++) {
            fileArr.push(files[i]);
        }

        setUploadFile([...uploadFile, ...fileArr]);

        openModal();
    }

    function uploadPost() {
        if (content != '') {
            const form = new FormData();
            form.append("postContent", content);
            form.append("userNo", userNo);
            form.append("loginMember", member);

            if (uploadFile.length > 0) {
                for (let i = 0; i < uploadFile.length; i++) {
                    form.append("postFile", uploadFile[i]);
                }
            }

            let options = {
                url: serverUrl + "/post/insert",
                method: "post",
                data: form,
                headers: {
                    contentType: "multipart/form-data",
                    processData: false
                }
            };

            axiosInstance(options).then(function (res) {
                setContent("");
                setUploadFile([]);
                closeModal();
                window.location.reload();
            });
        }
    }

    return (
        <div className="notice-write">
            <form onSubmit={function (e) {
                e.preventDefault();
                uploadPost();
            }}>
                <table className="write-table">
                    <thead>
                        <tr>
                            <td>
                                <img
                                    src={
                                        member
                                            ? member.userProfileImg
                                                ? serverUrl + "/user/profile" + member.userProfileImg.substring(0, 8) + loginMember.userProfileImg
                                                : "/images/default_img.png"
                                            : "/images/default_img.png"
                                    }
                                    className="profile-img"
                                />
                            </td>
                            <td>
                                <div>
                                    <input
                                        type="text"
                                        id="write"
                                        placeholder="무엇을 생각하고 계신가요?"
                                        className="write-input"
                                        onClick={openModal}
                                        readOnly
                                    />

                                    <div id="modal" className="modal-overlay">
                                        <div className="modal-box">
                                            <h4 className="modal-title">무엇을 생각하고 계신가요?</h4>
                                            <hr />
                                            <textarea
                                                id="content"
                                                name="content"
                                                className="modal-textarea"
                                                value={content}
                                                onChange={chgContent}
                                            ></textarea>
                                            <hr />
                                            <div className="file-upload-wrap">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="24px"
                                                    viewBox="0 -960 960 960"
                                                    width="24px"
                                                    fill="#e3e3e3"
                                                    className="file-icon"
                                                    onClick={function () {
                                                        uploadFileEl.current.click();
                                                    }}
                                                >
                                                    <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
                                                </svg>
                                                <label htmlFor="inputFile" style={{color:"white"}}>파일선택</label>
                                                <input
                                                    type="file"
                                                    id="inputFile"
                                                    multiple
                                                    ref={uploadFileEl}
                                                    onChange={chgPostFile}
                                                    style={{ display: "none" }}
                                                />
                                            </div>
                                            <div className="file-list">
                                                <h4 style={{color:"white"}}>첨부파일 목록</h4>
                                                {uploadFile.map(function (file, index) {
                                                    function deleteFile() {
                                                        const newUploadFile = uploadFile.filter(function (fFile) {
                                                            return file != fFile;
                                                        });
                                                        setUploadFile(newUploadFile);
                                                    }

                                                    return (
                                                        <p key={"file" + index}>
                                                            <span style={{color:"white"}}>{file.name}</span>
                                                            <span className="material-icons del-file-icon" onClick={deleteFile}>
                                                                delete
                                                            </span>
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                            <div className="modal-buttons">
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
                                <div className="file-upload-wrap">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#e3e3e3"
                                        className="file-icon"
                                        onClick={function () {
                                            uploadFileEl.current.click();
                                        }}
                                    >
                                        <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
                                    </svg>
                                    <label htmlFor="inputFile">파일선택</label>
                                </div>
                            </td>
                            <td>
                                <input
                                    type="file"
                                    id="inputFile"
                                    multiple
                                    ref={uploadFileEl}
                                    onChange={chgPostFile}
                                    style={{ display: "none" }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default PostWrite;
