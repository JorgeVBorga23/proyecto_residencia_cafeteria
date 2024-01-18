import "./custom.css"
import Carousel from 'react-bootstrap/Carousel';
import carouseIMG1 from "../../assets/carousel-1.jpg"
import carouselIMG2 from "../../assets/carousel-2.jpg"
function Carrusel() {
  return (
    <>
     <div className="container-fluid p-0 mb-5">
     <div id="carouselExample" className="carousel slide  overlay-bottom" data-bs-ride="carousel">
    <div className="carousel-inner">
        <div className="carousel-item active">
            <img src={carouseIMG1}className="d-block w-100" alt="First Slide"/>
            <div  className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                        <h2 className=" font-weight-medium m-0" style={{color: "#df9b56"}}>Servimos el mejor</h2>
                        <h1 className="display-1 text-white m-0">Café de la ciudad</h1>
                        <h2 className="text-white m-0">* Desde 1995 *</h2>
                    </div>
        </div>
        <div className="carousel-item">
            <img src={carouselIMG2} className="d-block w-100" alt="Second Slide"/>
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                        <h2 className="font-weight-medium m-0" style={{color: "#df9b56"}} >Disfruta de nuestro</h2>
                        <h1 className="display-1 text-white m-0">Menu variado</h1>
                        <h2 className="text-white m-0">No somos una simple cafeteria </h2>
                    </div>
        </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
    </button>
</div>
</div>
   
    </>
  );
}

export default Carrusel;
