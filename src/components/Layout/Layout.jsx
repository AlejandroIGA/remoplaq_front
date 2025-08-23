import Header from "../Header/Header";
import SideBar from "../SideBar";
import "./layout.css";

const Layout = ({main}) => {
    return(
        <div className = "container">
        <header>
            <Header/>
        </header>
        <aside>
            <SideBar/>
        </aside>
        <main>
            {main}
        </main>
        </div>
        
    )
}

export default Layout;