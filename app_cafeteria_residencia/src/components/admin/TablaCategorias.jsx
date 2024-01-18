import { React, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';

import { useCategorias } from '../../customHooks/useCategorias';
const TablaCategorias = () => {

    //TODO: Paginar alimentos en la tabla y api
    //TODO: Buscador de alimentos
    const { categorias, setCategorias } = useCategorias()
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL +"/categorias"

    //modal de notificacion guardado
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false)
    };

    const handleDelete = (categoriaId) => {

        //borrar de la base de datos el categoria

        //verificamos que se haya podido borrar el categoria

        fetch(apiUrl + "/" + categoriaId, {
            method: "DELETE"

        })
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                if (datos.estado == "1") {
                   handleShowModal()
                }
            })
            .catch((err) => console.log(err));

        setCategorias(categorias.filter((categoria) => categoria.id !== categoriaId));

    };

    return (
        <>
            <br />
            <div className="container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                          
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td>{categoria.id}</td>
                                <td><img width={80} height={80} src={import.meta.env.VITE_REACT_APP_API_URL + categoria.imagen} alt={categoria.nombre} /></td>
                                <td>{categoria.nombre}</td>
                               
                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(categoria.id)}>
                                        Eliminar
                                    </Button>
                                    {/* Agrega más botones de acciones según tus necesidades */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>


            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-success">Categoria eliminada correctamente!</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <p>Tu categoria se ha eliminado correctamente en la base de datos.</p>
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

export default TablaCategorias