import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import "./App.css";

// Redux Slice for Cart
const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const item = state.find((i) => i.id === action.payload.id);
      if (!item) state.push({ ...action.payload, quantity: 1 });
    },
    increase: (state, action) => {
      const item = state.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrease: (state, action) => {
      const item = state.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    remove: (state, action) => state.filter((i) => i.id !== action.payload),
  },
});

const { addToCart, increase, decrease, remove } = cartSlice.actions;
const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// Sample plant data
const plants = [
  {
    id: 1,
    name: "Monstera",
    price: 20,
    category: "Tropical",
    thumbnail: "/plant_1.jpg",
  },
  {
    id: 2,
    name: "Fiddle Leaf Fig",
    price: 25,
    category: "Tropical",
    thumbnail: "/plant_2.jpg",
  },
  {
    id: 3,
    name: "Snake Plant",
    price: 15,
    category: "Succulent",
    thumbnail: "/plant_3.jpeg",
  },
  {
    id: 4,
    name: "Aloe Vera",
    price: 12,
    category: "Succulent",
    thumbnail: "/plant_4.jpg",
  },
  {
    id: 5,
    name: "English Ivy",
    price: 18,
    category: "Vine",
    thumbnail: "/plant_5.jpeg",
  },
  {
    id: 6,
    name: "Pothos",
    price: 14,
    category: "Vine",
    thumbnail: "/plant_6.jpg",
  },
];

// Header Component
const Header = () => {
  const cart = useSelector((state) => state.cart);
  return (
    <header
      className="header"
      style={{ backgroundImage: "url(/bg_image.jpg)" }}
    >
      <h1>GreenThumb</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/products">Products</Link> |
        <Link to="/cart">Cart 🛒 ({cart.length})</Link>
      </nav>
    </header>
  );
};

// Landing Page
const LandingPage = () => (
  <div
    className="landing"
    style={{
      backgroundImage: "url(/bg_image.jpg)",
      padding: "50px",
      color: "#fff",
    }}
  >
    <h2>Welcome to GreenThumb!</h2>
    <p>Your one-stop shop for beautiful houseplants.</p>
    <Link to="/products">
      <button>Get Started</button>
    </Link>
  </div>
);

// Product Listing Page
const ProductListingPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const categories = [...new Set(plants.map((p) => p.category))];

  return (
    <div>
      {categories.map((cat) => (
        <div key={cat}>
          <h3>{cat}</h3>
          <div className="products">
            {plants
              .filter((p) => p.category === cat)
              .map((plant) => (
                <div key={plant.id} className="product">
                  <img
                    src={plant.thumbnail}
                    alt={plant.name}
                    style={{ height: "400px", width: "400px" }}
                  />
                  <h4>{plant.name}</h4>
                  <p>${plant.price}</p>
                  <button
                    onClick={() => dispatch(addToCart(plant))}
                    disabled={cart.some((item) => item.id === plant.id)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Shopping Cart Page
const ShoppingCartPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>Total Items: {totalItems}</p>
      <p>Total Cost: ${totalPrice}</p>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.thumbnail} alt={item.name} />
            <h4>{item.name}</h4>
            <p>Unit Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => dispatch(increase(item.id))}>+</button>
            <button onClick={() => dispatch(decrease(item.id))}>-</button>
            <button onClick={() => dispatch(remove(item.id))}>Delete</button>
          </div>
        ))}
      </div>
      <button onClick={() => alert("Coming Soon")}>Checkout</button>
      <Link to="/products">
        <button>Continue Shopping</button>
      </Link>
    </div>
  );
};

// Main App
const App = () => (
  <Provider store={store}>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;
