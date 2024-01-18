import sandwich from "../../assets/sandwich.jpg";
import hamburguesa from "../../assets/hamburguesa.jpg";
import cafe from "../../assets/cafe.jpg";

function CarruselPromociones() {
  return (
    <>
      <br />
      <h2 className="text-center">Promociones</h2>
      {/*carrusel de promociones (debe ser un componente)*/}
      <div
        id="carouselExampleControls"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={sandwich} class="d-block w-100" alt="promocion 1" />
          </div>
          <div className="carousel-item">
            <img src={cafe} class="d-block w-100" alt="promocion 2" />
          </div>
          <div className="carousel-item">
            <img src={hamburguesa} className="d-block w-100" alt="promocion 3" />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
}

export default CarruselPromociones;
