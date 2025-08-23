import { BrowserRouter, Route, Routes } from "react-router-dom";

import Materiales from "../pages/Materiales/Materiales";
import Cotizaciones from "../pages/Cotizaciones/Cotizaciones";
import Requerimientos from "../pages/Requerimientos/Requerimientos";
import Compras from "../pages/Compras/Compras";
import Proveedores from "../pages/Proveedores/Proveedores";

const RouteManager = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/materiales" element={<Materiales />} />
            <Route path="/cotizaciones" element={<Cotizaciones />} />  
            <Route path="/requerimientos" element={<Requerimientos />} />
            <Route path="/compras" element={<Compras />} /> 
            <Route path="/proveedores" element={<Proveedores />} />
        </Routes>
    </BrowserRouter>
  )
}

export default RouteManager;