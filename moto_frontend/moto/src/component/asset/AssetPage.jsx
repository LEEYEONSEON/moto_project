import { Route, Routes } from "react-router-dom";
import AssetList from "./AssetList";

export default function AssetPage() {

    return(
        <>
        <Routes>
            <Route path="" element={<AssetList />} />
        </Routes>
            
       </>     
    )
}