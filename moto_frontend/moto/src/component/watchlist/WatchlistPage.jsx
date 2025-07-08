import { Route, Routes } from "react-router-dom";
import Watchlist from "./Watchlist";

export default function WatchlistPage() {

    return(
        <>
        <Routes>
            <Route path="" element={<Watchlist />} />
        </Routes>
            
       </>     
    )
}