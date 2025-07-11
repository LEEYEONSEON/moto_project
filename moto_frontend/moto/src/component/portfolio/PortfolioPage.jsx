import { Route, Routes } from "react-router-dom";
import Portfolio from "./Portfolio";

export default function PortfolioPage() {

    return(
        <>
        <Routes>
            <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
            
       </>     
    )
}