import { React, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { useAlimentos } from "../../customHooks/useAlimentos"
const TablaAlimentos = () => {

    //TODO: Paginar alimentos en la tabla y api
    //TODO: Buscador de alimentos
    const { alimentos, setAlimentos } = useAlimentos()
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL +"/productos"

    //modal de notificacion guardado
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false)
    };

    const handleDelete = (alimentoID) => {

        //borrar de la base de datos el alimento

        //verificamos que se haya podido borrar el alimento

        fetch(apiUrl + "/" + alimentoID, {
            method: "DELETE"

        })
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                if (datos.estado == "1") {
                   handleShowModal()
                }
            })
            .catch((err) => console.log(err));

        setAlimentos(alimentos.filter((alimento) => alimento.id !== alimentoID));

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
                            <th>Categoria</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alimentos.map((alimento) => (
                            <tr key={alimento.id}>
                                <td>{alimento.id}</td>
                                <td><img width={80} height={80} src={import.meta.env.VITE_REACT_APP_API_URL + alimento.imagen} alt={alimento.nombre} /></td>
                                <td>{alimento.nombre}</td>
                                <td>{alimento.categoria}</td>
                                <td>{alimento.precio}</td>
                                <td>{alimento.stock}</td>
                                <td>{alimento.descripcion}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(alimento.id)}>
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
                    <Modal.Title className="text-success">Alimento guardado correctamente!</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <p>Tu alimento se ha eliminado correctamente en la base de datos.</p>
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

export default TablaAlimentos