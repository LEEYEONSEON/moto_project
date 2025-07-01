import { Route, Routes } from "react-router-dom";
import AssetList from "./AssetList";
import AssetDetail from "./AssetDetail";

export default function AssetPage() {

    return(
        <>
        <Routes>
            <Route path=":assetCode" element={<AssetDetail />} />
            <Route path="" element={<AssetList />} />
        </Routes>
            
       </>     
    )
}