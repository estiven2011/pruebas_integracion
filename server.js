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

// Endpoint para obtener un carrito por ID
app.get('/cart/:cartId', (req, res) => {
  const { cartId } = req.params;

  // Buscar el carrito en la lista
  const cart = carts.find(c => c.cartId === cartId);
  
  if (!cart) {
      return res.status(404).json({
          error: 'Cart not found',
          message: `No cart found with the ID: ${cartId}`
      });
  }

  res.status(200).json(cart);
});


// Endpoint para actualizar el carrito
app.put('/cart/update/:cartId', (req, res) => {
  const { cartId } = req.params;
  const { items, totalPrice } = req.body;

  // Buscar el carrito en la lista
  const cartIndex = carts.findIndex(c => c.cartId === cartId);
  
  if (cartIndex === -1) {
      return res.status(404).json({
          error: 'Cart not found',
          message: `No cart found with the ID: ${cartId}`
      });
  }

  // Actualizar los items y el precio total del carrito
  carts[cartIndex].items = items;
  carts[cartIndex].totalPrice = totalPrice;

  res.status(200).json({
      message: 'Cart updated successfully',
      cartId: cartId,
      totalPrice: totalPrice
  });
});

app.put('/cart/update/:cartId', (req, res) => {
  const { cartId } = req.params;
  const { items, totalPrice } = req.body;

  // Buscar el carrito en la lista
  const cartIndex = carts.findIndex(c => c.cartId === cartId);
  
  if (cartIndex === -1) {
      return res.status(404).json({
          error: 'Cart not found',
          message: `No cart found with the ID: ${cartId}`
      });
  }

  // Actualizar solo los campos que se envían en el cuerpo de la solicitud
  if (items) {
    carts[cartIndex].items = items;
  }
  if (totalPrice) {
    carts[cartIndex].totalPrice = totalPrice;
  }

  res.status(200).json({
      message: 'Cart updated successfully',
      cartId: cartId,
      items: carts[cartIndex].items,
      totalPrice: carts[cartIndex].totalPrice
  });
});

// Endpoint para actualizar el cartId de un carrito
app.put('/cart/update-id/:cartId', (req, res) => {
  const { cartId } = req.params;
  const { newCartId } = req.body;

  // Buscar el carrito en la lista
  const cartIndex = carts.findIndex(c => c.cartId === cartId);
  
  if (cartIndex === -1) {
      return res.status(404).json({
          error: 'Cart not found',
          message: `No cart found with the ID: ${cartId}`
      });
  }

  // Actualizar el cartId
  carts[cartIndex].cartId = newCartId;

  res.status(200).json({
      message: `Cart ID updated successfully from ${cartId} to ${newCartId}`,
      cart: carts[cartIndex]
  });
});


// Endpoint para eliminar un carrito
app.delete('/cart/delete/:cartId', (req, res) => {
  const { cartId } = req.params;

  // Verificar si el carrito existe
  const cartIndex = carts.findIndex(c => c.cartId === cartId);
  if (cartIndex === -1) {
      return res.status(404).json({
          error: 'Cart not found',
          message: `No cart found with the ID: ${cartId}`
      });
  }

  // Eliminar el carrito de la lista
  carts.splice(cartIndex, 1);

  res.status(200).json({
      message: `Cart with ID: ${cartId} deleted successfully`
  });
});

// Endpoint para obtener todos los carritos
app.get('/cart', (req, res) => {
  if (carts.length === 0) {
      return res.status(404).json({
          error: 'No carts available',
          message: 'No carts have been added yet.'
      });
  }
  res.status(200).json(carts);
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
