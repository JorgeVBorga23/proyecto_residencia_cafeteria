import { useListaAlimentos } from "../../customHooks/useListaAlimentos"
import { useCategoria } from "../../customHooks/useCategoria";
import Navegacion from "./Navegacion";
import { useParams } from "react-router-dom";
import ItemProducto from "./ItemProducto"
import "./restaurante.css"
import "./custom.css"
import Footer from "./Footer"

function DetalleCategoria() {
  const { id } = useParams()
  const { alimentos } = useListaAlimentos(id)
  const { categoria } = useCategoria(id)


  return (
    <>
      <Navegacion />

      <div class="container-fluid page-header mb-5 position-relative overlay-bottom">
      <div class="d-flex flex-column align-items-center justify-content-center pt-0 pt-lg-5" >
            <h1 class="display-4 mb-3 mt-0 mt-lg-5 text-white text-uppercase">Menu</h1>
            <div class="d-inline-flex mb-lg-5">
                <p class="m-0 text-white"><a class="text-white" href="/">Inicio</a></p>
                <p class="m-0 text-white px-2">/</p>
                <p class="m-0 text-white">{categoria.nombre}</p>
            </div>
        </div>

      </div>
       
      <div className="category-list">
          {alimentos.map(alimento => {
            return <ItemProducto key={alimento.id} id={alimento.id} nombre={alimento.nombre} precio={alimento.precio} imagen={alimento.imagen} />
          })}
        </div>




    </>
  );
}

export default DetalleCategoria;
