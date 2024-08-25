import "./index.css";
import Layout from "./Layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Introduce from "./pages/Introduce";
import ContentBlog from "./pages/ContentBlog";
import ProductList from "./pages/ProductList";
import ItemProduct from "./pages/ItemProduct";
import Contact from "./pages/Contact";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="introduce" element={<Introduce />} />
          <Route path="contentblog/:id" element={<ContentBlog />} />
          <Route path="product-list" element={<ProductList />} />
          <Route path="product/:id" element={<ItemProduct />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
