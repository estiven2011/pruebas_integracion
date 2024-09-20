const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Lista temporal para almacenar carritos válidos (simulación de base de datos)
let carts = [];

// Endpoint para agregar productos al carrito
app.post('/cart/add', (req, res) => {
  const { cartId, items, totalPrice } = req.body;

  // Imprimir los datos recibidos en la terminal
  console.log("Datos recibidos al agregar carrito:", req.body);

  if (!cartId) {
    console.log("Error: El cartId no es válido o está ausente.");
    return res.status(400).json({
      error: 'Invalid cartId',
      message: 'The cartId provided is invalid or missing.'
    });
  }

  // Agregamos el cartId a la lista de carritos válidos
  carts.push({ cartId, items, totalPrice });

  res.status(200).json({
    message: 'Items added to cart',
    cartId: cartId,
    totalPrice: totalPrice
  });


});

// Endpoint para procesar el pago
app.post('/cart/pay', (req, res) => {
  const { cartId, paymentMethod, amount } = req.body;

  // Imprimir los datos recibidos en la terminal
  console.log("Datos recibidos al procesar pago:", req.body);

  // Verificar si el cartId existe en la lista de carritos válidos
  const cart = carts.find(c => c.cartId === cartId);
  if (!cart) {
    console.log(`Error: El cartId ${cartId} no coincide con ningún carrito activo.`);
    return res.status(400).json({
      error: 'CartId mismatch',
      message: 'The cartId provided does not match any active cart.'
    });
  }

  // Pago exitoso
  res.status(200).json({
    message: 'Payment successful',
    paymentId: 'pay5678',
    cartId: cartId,
    status: 'paid'
  });

  // Imprimir mensaje de éxito en la consola
  console.log(`Pago exitoso procesado para el cartId ${cartId} con el método de pago ${paymentMethod} y el monto de ${amount}.`);

  // Eliminar el carrito de la lista después de procesar el pago
  carts = carts.filter(c => c.cartId !== cartId);

});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
