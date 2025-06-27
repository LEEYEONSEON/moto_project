import Sidebar from "./common/Sidebar";

export default function Main(){

    return (
        <>
         <section className="section" style={{width:"80%", backgroundColor:"black", display:"flex"}}>
        <Sidebar />
            <div className="page-title" style={{color:"white"}}>메인페이지</div>
            
        </section>
        </>
    )
}