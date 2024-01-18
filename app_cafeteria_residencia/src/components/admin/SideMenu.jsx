import { useNavigate, useLocation, Link } from "react-router-dom";

const SideMenu = () => {
  let { state } = useLocation()
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/admin/alimentos" state={state}><button className="btn btn-primary">Alimentos</button></Link>
        </li>
        <li>
          <Link to="/admin/pedidos" state={state}><button className="btn btn-primary">Pedidos</button></Link>
        </li>
        <li>
          <Link to="/admin/carritos" state={state}><button className="btn btn-primary">Carritos</button></Link>
        </li>
        <li>
          <Link to="/admin/usuarios" state={state}><button className="btn btn-primary">Usuarios</button></Link>
        </li>
        <li>
          <Link to="/admin/categorias" state={state}><button className="btn btn-primary">Categorias</button></Link>
        </li>
      </ul>

    </div>

  )
};


export default SideMenu;
