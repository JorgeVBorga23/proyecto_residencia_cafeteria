import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import React from "react";
import { useCategorias } from "../../customHooks/useCategorias"
import { Alert } from "react-bootstrap";

const AgregarCategorias = () => {

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

  const [existeCategoria, setExisteCategoria] = useState(false);
  const { categorias } = useCategorias()
  const API_URL =  import.meta.env.VITE_REACT_APP_API_URL +"/categoria/"

  const handleCloseAlert = () => {
    setExisteAlimento(false);
  };
  //referencias para cada input del formulario
  const idRef = React.createRef()
  const nombreRef = React.createRef()
  const imagenRef = React.createRef()

  const guardarAlimento = (e) => {
    e.preventDefault()
    const idVal = idRef.current.value
    const nombreVal = nombreRef.current.value
    const imagenVal = imagenRef.current.files[0]
    console.log(
     imagenVal)

     const formData = new FormData()
     formData.append("id", idVal) 
     formData.append("nombre", nombreVal)
     formData.append("imagen", imagenVal)

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
          //existe el producto, notificar al usuario que ya existe esa categoria
          console.log(existeCategoria)
          setExisteAlimento(true)

        } else if (data.estado == "1") {
          // la categoria fue guardada correctamente, notificar al usuario
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
        <button onClick={handleShow} className="btn btn-success">Nueva Categoria</button>
      </div>
    
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar una nueva Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={guardarAlimento} > 

            {existeCategoria && (
              <Alert variant="danger" onClose={handleCloseAlert} dismissible>
                <Alert.Heading>Esta categoria ya existe en la base de datos!</Alert.Heading>
                <p>
                  Por favor, ingresa una categoria diferente.
                </p>
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="form.id">
              <Form.Label className="text-primary">Id:</Form.Label>
              <Form.Control
                ref={idRef}
                type="number"
                placeholder='ejemplo: 1,2,100"'
                autoFocus
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="form.nombre">
              <Form.Label className="text-primary">Nombre:</Form.Label>
              <Form.Control
                ref={nombreRef}
                type="text"
                placeholder='ejemplo: "Hamburguesas"'
                required
              />
            </Form.Group>
     
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Imagen de la Categoria:</Form.Label>
              <Form.Control ref={imagenRef} type="file" accept="image/png, image/jpeg, image/jpg" />
            </Form.Group>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" >
                Guardar Categoria
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>

      </Modal>
      { /*modal para alimento guardado correctamente*/}

      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title className="text-success">Categoria guardada correctamente!</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <p>Tu categoria se ha guardado correctamente en la base de datos.</p>
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

export default AgregarCategorias