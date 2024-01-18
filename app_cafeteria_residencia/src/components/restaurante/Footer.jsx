import "./custom.css"
const Footer = () => {
    return (<>
        <div className="container-fluid footer text-white mt-5 pt-5 px-0 position-relative overlay-top bg">
            <div className="container-fluid text-center text-white border-top mt-4 py-4 px-sm-3 px-md-5" style={{"border-color": "rgba(256, 256, 256, .1)"}}>
                <p className="mb-2 text-white">Copyright &copy; <a className="font-weight-bold" href="#">Cafeteria.com</a>. Todos los derechos reservados.</p>
           
            </div>
        </div>
    </>
    )

}
export default Footer
