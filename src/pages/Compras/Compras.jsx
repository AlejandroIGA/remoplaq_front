import "./compras.css"

import Layout from "../../components/Layout/Layout"
import SideBar from "../../components/SideBar"


const Compras = () => {
    return (
        <Layout
            aside = {<SideBar/>}
            main = {
                <div className="compras-page">
                    <div className="header-compras">
                        <h2>Compras</h2>
                    </div>
                    <div className="body-compras">
                        <div className="search-bar">

                        </div>
                        <div classname = "table-compras">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Proveedor</th>
                                        <th>Fecha</th>
                                        <th>Total</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Proveedor 1</td>
                                        <td>2023-10-01</td>
                                        <td>$1000</td>
                                        <td> 
                                            <button> ver </button>
                                            <button> editar </button>
                                            <button> eliminar </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }
        />
    ) 
}

export default Compras