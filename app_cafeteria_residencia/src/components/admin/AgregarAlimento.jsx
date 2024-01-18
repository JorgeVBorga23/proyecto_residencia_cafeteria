import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import React from "react";
import { useCategorias } from "../../customHooks/useCategorias"
import { Alert } from "react-bootstrap";

const AgregarAlimento = () => {

  //modal de formulario
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  //modal de notificacion guardado
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false)
    handleClose()
    handleCloseAlert()
  };

  const [existeAlimento, setExisteAlimento] = useState(false);
  const { categorias } = useCategorias()
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL+"/productos/"

  const handleCloseAlert = () => {
    setExisteAlimento(false);
  };


  //referencias para cada input del formulario
  const idRef = React.createRef()
  const nombreRef = React.createRef()
  const categoriaRef = React.createRef()
  const stockRef = React.createRef()
  const precioRef = React.createRef()
  const descripcionRef = React.createRef()
  const imagenRef = React.createRef()

  const guardarAlimento = (e) => {
    e.preventDefault()
    const idVal = idRef.current.value
    const nombreVal = nombreRef.current.value
    const categoriaVal = categoriaRef.current.value
    const stockVal = stockRef.current.value
    const precioVal = precioRef.current.value
    const descripcionVal = descripcionRef.current.value
    const imagenVal = imagenRef.current.files[0]
    console.log(
     imagenVal)

     const formData = new FormData()
     formData.append("id", idVal) 
     formData.append("nombre", nombreVal)
     formData.append("stock", stockVal)
     formData.append("categoria", categoriaVal)
     formData.append("precio", precioVal)
     formData.append("imagen", imagenVal)
     formData.append("descripcion", descripcionVal)

   /*  const alimento = {
      "id": idVal,
      "nombre": nombreVal,
      "stock": stockVal,
      "categoria": categoriaVal,
      "precio": precioVal,
      "imagen": imagenVal,
      "descripcion": descripcionVal
    } */
    //verificamos si ya existe en la bd el producto
    fetch(API_URL, {
      method: "POST",
      headers: {
       
      },
      body: formData,
    }).then((respuesta) => respuesta.json())
      .then((data) => {
        // Manejar la respuesta de la API
        console.log(data)
        if (data.existe) {
          //existe el producto, notificar al usuario que ya existe ese producto
          console.log(existeAlimento)
          setExisteAlimento(true)

        } else if (data.estado == "1") {
          // el producto fue guardado correctamente, notificar al usuario
          handleShowModal()
          handleCloseAlert()
          setActualizacion(true)
        }
      })
      .catch((error) => {
        //algo fallo TODO: Notificar mejor
        console.error("Error de red:", error);
      });
  }
  return (
    <>
      <div className="container">
        <br />
        <button onClick={handleShow} className="btn btn-success">Nuevo Alimento</button>
      </div>
    
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar un nuevo Alimento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={guardarAlimento} > 

            {existeAlimento && (
              <Alert variant="danger" onClose={handleCloseAlert} dismissible>
                <Alert.Heading>Este alimento ya existe en la base de datos!</Alert.Heading>
                <p>
                  Por favor, ingresa un alimento diferente.
                </p>
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="form.id">
              <Form.Label className="text-primary">Id:</Form.Label>
              <Form.Control
                ref={idRef}
                type="text"
                placeholder='ejemplo: COD123, 10, CODIGO1"'
                autoFocus
                required
                maxLength={100}
              />
            </Form.Group>


            <Form.Group className="mb-3" controlId="form.nombre">
              <Form.Label className="text-primary">Nombre:</Form.Label>
              <Form.Control
                ref={nombreRef}
                type="text"
                placeholder='ejemplo: "Baguette de..."'
                required
                maxLength={100}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="form.categoria"
            >
              <Form.Label className="text-primary">Categoria:</Form.Label>
              <Form.Select required ref={categoriaRef}>
                {categorias.map((cat) => {
                  return (
                    <option key={cat.id} value={cat.id} >{cat.nombre}</option>
                  )
                })}
              </Form.Select>
            </Form.Group>


            <Form.Group className="mb-3" controlId="form.stock">
              <Form.Label className="text-primary" >Stock:</Form.Label>
              <Form.Control
                ref={stockRef}
                type="number"
                required
                min={1}
                max={10000}
                placeholder="ejemplo: 255"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="form.precio">
              <Form.Label className="text-primary">Precio de venta (MXN):</Form.Label>
              <Form.Control
                ref={precioRef}
                type="number"
                required
                min={1}
                max={10000}
                placeholder="ejemplo: 25.00"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="form.precio">
              <Form.Label className="text-primary">Descripción:</Form.Label>
              <Form.Control
                ref={descripcionRef}
                as="textarea"
                placeholder="Acerca de tu alimento"
                style={{ height: '100px' }}
                required
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Imagen del Alimento:</Form.Label>
              <Form.Control ref={imagenRef} type="file" accept="image/png, image/jpeg, image/jpg" />
            </Form.Group>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" >
                Guardar Alimento
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>

      </Modal>
      { /*modal para alimento guardado correctamente*/}

      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title className="text-success">Alimento guardado correctamente!</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <p>Tu alimento se ha guardado correctamente en la base de datos.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>



    </>
  )



}

export default AgregarAlimento