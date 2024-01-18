
import ItemCategoria from "./ItemCategoria";
import { useCategorias } from "../../customHooks/useCategorias"
import "./custom.css"
function Categorias() {

  const {categorias} = useCategorias()

  const tarjeta = {
    textDecoration: "none",
    color: "black",
  };
  return (
    <>
      
      <h2 className="text-center">Nuestro Menú</h2>
     
        <div className="category-list">
          {categorias.map((cat) => {
            return (
              <a key={cat.id} style={tarjeta} href={"/categoria/" + cat.id}>
                <ItemCategoria
                  className="col-1"
                  id={cat.id}
                  nombre={cat.nombre}
                  imagen={cat.imagen}
                />
              </a>
            );
          })}
        </div>
      
    </>
  );
}

export default Categorias;
