import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect, useMemo } from 'react';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function UserList(props){
    const userList = props.userList; // 부모에서 받은 userList

    console.log(userList)

    // ag-Grid 컬럼 정의 (유저 DTO에 맞게 수정)
    const [colDefs] = useState([
        { headerName: "회원번호", field: "userNo" },
        { headerName: "아이디", field: "userId" },
        { headerName: "닉네임", field: "userNickname" },
        { headerName: "이메일", field: "userEmail" },
        { headerName: "가입일", field: "userJoinDate" },
        { headerName: "로그인분류", field: "userSocialType" },
        { 
            headerName: "회원등급", 
            field: "userRole",
            valueFormatter: function(params) {
            // params.value가 userRole 값임
            if(params.value == '1') return '관리자';
            if(params.value == '2') return '회원';
            if(params.value == '3') return '정지';
            return params.value; // 그 외 값은 그대로 표시
            }
        }
        ]);

    const defaultColDef = useMemo(() => ({
    filter: true, // Enable filtering on all columns
    editable: true // Enable editing on all cells
}))    

    return (
        <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
            <AgGridReact
                rowData={userList} // 여기에 부모에서 받은 userList 사용
                columnDefs={colDefs}
                pagination={true}
                paginationPageSize={10}
                defaultColDef={defaultColDef}
                onCellValueChanged={event => console.log(`New Cell Value: ${event.value}`)}
            />
        </div>
    )
}
