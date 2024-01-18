import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import './carrito.css';  // Asegúrate de tener el archivo CSS correspondiente
import ItemCarrito from './itemCarrito';

const Carrito = ({ alimentos }) => {

  const { items } = alimentos.carrito


  const [showCart, setShowCart] = useState(false);
  const handleCartButtonClick = () => {
    setShowCart(true);
  };

  const handleMenuClose = () => {
    setShowCart(false);
  };

  return (
    <>
      <Button variant="outline-light" onClick={handleCartButtonClick}>
        <i className="fas fa-shopping-cart"></i> Carrito
      </Button>

      {showCart && (
        <div className="cart-menu">
          <div className="cart-menu-header">
            <span className='h4'>Carrito</span>
            <button className="btn btn-danger" onClick={handleMenuClose}><i class="fa fa-times" aria-hidden="true"></i></button>
          </div>
          <div className="cart-menu-items">

            <table className='table text-white'>
              <thead>

                <th>Item</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>

              </thead>
              <tbody>
                {/* Renderizar los elementos del carrito aquí */}
                {items.map((item) => (
                  <tr key={item.id} className="cart-item">
                    {/* Renderizar detalles del producto */}
                    <ItemCarrito item={item} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-menu-footer">
            <div className="container">

              <div className="row">
                <div className="total">
                  <span className='text-white h3'>Subtotal:  <span className='text-success h2'> ${1} MXN</span></span>
                </div>
              </div>
              <div className="row">

                <button type='submit' className='btn btn-success mt-5'>Comprar</button>
              </div>

            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default Carrito;
