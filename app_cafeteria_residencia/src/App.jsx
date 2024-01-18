import { useEffect } from "react";
import { AppRouter } from "./router/AppRouter"

function App() {
  //generamos un identificador para el carrito
  useEffect(() => {

    const delay = 2000;
    const peticionWebhook = async () => {
      //vamos a ver si tenemos un identificador unico 
      const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL +"/webhook/token/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()

      const fechaExpiracionDia = new Date();
      fechaExpiracionDia.setTime(fechaExpiracionDia.getTime() + (1 * 24 * 60 * 60 * 1000)); // 1 día en milisegundos
      const cadenaExpiracionDia = `expires=${fechaExpiracionDia.toUTCString()}`;
      document.cookie = `carritoId=${data.token}; ${cadenaExpiracionDia}; path=/`;
      localStorage.setItem("carritoId", data.token)
    }

    const timeoutId = setTimeout(() => {
      peticionWebhook()
    }, delay);

    return () => clearTimeout(timeoutId);


  }, [])

  return <>
    <AppRouter />
  </>
}

export default App;
