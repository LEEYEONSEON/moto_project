import { useRef, useState } from "react";
import useUserStore from "../store/useUserStore";
import Sidebar from "./common/Sidebar";
import createInstance from "../axios/Interceptor";
import PostWrite from "./post/PostWrite";
import PostView from "./post/PostView";
export default function PageMain(){



    return (
        <>
         <section className="section" style={{width:"100%", backgroundColor:"black", display:"flex"}}>
           <div className="main-content" style={{width:"700px"}}>
           <PostWrite />
           <hr />
           <PostView/>
            
           
           </div>
        </section>
        </>
    )
    
}
