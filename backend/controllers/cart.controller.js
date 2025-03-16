import Product from "../models/product.model.js";


export const getCartProducts = async (req, res) => {
  try {
    // Extrair apenas os IDs dos produtos dos itens do carrinho
    const productIds = req.user.cartItem.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    // Adicionar quantidade para cada produto
    const cartItem = products.map((product) => {
      const item = req.user.cartItem.find((cartItem) => 
        cartItem.product.toString() === product._id.toString());
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.json(cartItem);
  } catch (error) {
    console.log("Erro no controlador getCartProducts", error);
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Verifica se o productId existe
    if (!productId) {
      return res.status(400).json({ message: "ID do produto é obrigatório" });
    }

    // Procura item existente com verificação para evitar erros
    const existingItem = user.cartItem.find((item) => 
      item.product && item.product.toString() === productId.toString());

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // Adiciona o produto com quantidade inicial 1
      user.cartItem.push({ product: productId, quantity: 1 });
    }

    await user.save();
    res.status(200).json({ message: "Produto adicionado ao carrinho" });
  } catch (error) {
    console.log("Erro no controlador addToCart:", error);
    res.status(500).json({ message: error.message });
  }
};



export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    
    // Adicionar verificação para evitar errors com toString()
    const existingItem = user.cartItem.find(item => 
      item.product && item.product.toString() === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItem = user.cartItem.filter(item => 
          !item.product || item.product.toString() !== productId);
        await user.save();
        return res.json(user.cartItem);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItem);
    } else {
      res.status(404).json({ message: "Produto não encontrado no carrinho" });
    }
  } catch (error) {
    console.log("Erro no controlador updateQuantity", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeAllfromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      // Se nenhum productId for enviado, limpa o carrinho
      user.cartItem = [];
    } else {
      // Remove item específico com verificação para evitar erros com toString()
      user.cartItem = user.cartItem.filter(item => 
        !item.product || item.product.toString() !== productId);
    }

    await user.save();
    res.status(200).json({ message: "Produto removido do carrinho" });
  } catch (error) {
    console.log("Erro no controlador removeAllfromCart", error);
    res.status(500).json({ message: error.message });
  }
};