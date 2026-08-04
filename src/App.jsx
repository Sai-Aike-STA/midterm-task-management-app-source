import { useState } from "react";
import {
  Cable,
  Headphones,
  Laptop,
  Mouse,
  Settings,
  TabletSmartphone,
} from "lucide-react";
import { categories, products } from "./assets/data";
import "./App.css";

function CategoryIcon(category) {
  const iconClassName = "category-icon";

  switch (category.icon) {
    case "mouse":
      return <Mouse className={iconClassName} aria-label={category.title} />;
    case "laptop":
      return <Laptop className={iconClassName} aria-label={category.title} />;
    case "tablet-smartphone":
      return (
        <TabletSmartphone
          className={iconClassName}
          aria-label={category.title}
        />
      );
    case "headphones":
      return (
        <Headphones className={iconClassName} aria-label={category.title} />
      );
    case "cable":
      return <Cable className={iconClassName} aria-label={category.title} />;
    default:
      return <Settings className={iconClassName} aria-label={category.title} />;
  }
}

function calculateSubtotal(item) {
  const discountedPrice = item.sellPrice * (1 - item.discount / 100);
  return discountedPrice * item.amount;
}

function displayNumber(number) {
  return Number.isInteger(number) ? number : number.toFixed(2);
}

export default function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [availableProducts, setAvailableProducts] = useState(products);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredProducts =
    selectedCategoryId === "all"
      ? availableProducts
      : availableProducts.filter(
          (product) => product.category === Number(selectedCategoryId),
        );

  const selectedProduct = availableProducts.find(
    (product) => product.id === Number(selectedProductId),
  );

  const grandTotal = purchasedItems.reduce(
    (total, item) => total + calculateSubtotal(item),
    0,
  );

  const isAmountDisabled = !selectedProduct;
  const isAddButtonDisabled =
    !selectedProduct || Number(purchaseAmount) <= 0;

  function onCategoryChange(event) {
    setSelectedCategoryId(event.target.value);

    // Changing the category resets the dependent form fields.
    setSelectedProductId("");
    setPurchaseAmount(0);
    setErrorMessage("");
  }

  function onProductChange(event) {
    setSelectedProductId(event.target.value);
    setPurchaseAmount(0);
    setErrorMessage("");
  }

  function onAmountChange(event) {
    setPurchaseAmount(event.target.value);
    setErrorMessage("");
  }

  function addPurchasedItem(event) {
    event.preventDefault();

    const amount = Number(purchaseAmount);

    if (!selectedProduct || !Number.isInteger(amount) || amount <= 0) {
      setErrorMessage("Please enter a valid whole-number amount.");
      return;
    }

    if (amount > selectedProduct.inventory) {
      setErrorMessage(
        `Not enough item, only ${selectedProduct.inventory} left`,
      );
      return;
    }

    setPurchasedItems((previousItems) => {
      const productAlreadyPurchased = previousItems.some(
        (item) => item.id === selectedProduct.id,
      );

      if (productAlreadyPurchased) {
        // map updates the matching row without creating a duplicate row.
        return previousItems.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, amount: item.amount + amount }
            : item,
        );
      }

      // The spread operator adds a new row while keeping the previous rows.
      return [...previousItems, { ...selectedProduct, amount }];
    });

    // map deducts the purchased amount from the selected product inventory.
    setAvailableProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, inventory: product.inventory - amount }
          : product,
      ),
    );

    setErrorMessage("");
  }

  return (
    <main className="app-shell">
      <h1 className="visually-hidden">Point of Sale</h1>

      <section className="pos-card" aria-label="Point of sale item manager">
        <form className="purchase-form" onSubmit={addPurchasedItem}>
          <div className="controls-grid">
            <label className="category-label" htmlFor="category">
              Select Category:
            </label>
            <select
              className="category-select"
              id="category"
              value={selectedCategoryId}
              onChange={onCategoryChange}
            >
              <option value="all">All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>

            <label className="product-label" htmlFor="product">
              Select Product:
            </label>
            <select
              className="product-select"
              id="product"
              value={selectedProductId}
              onChange={onProductChange}
            >
              <option value="">Please Select An Item</option>
              {filteredProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </select>

            <label className="amount-label" htmlFor="amount">
              Amount:
            </label>
            <input
              className="amount-input"
              id="amount"
              type="number"
              min="0"
              step="1"
              value={purchaseAmount}
              onChange={onAmountChange}
              disabled={isAmountDisabled}
            />

            <button
              className="add-button"
              type="submit"
              disabled={isAddButtonDisabled}
            >
              Add Item
            </button>

            <p className="error-message" role="alert">
              {errorMessage}
            </p>
          </div>
        </form>

        <hr />

        <div className="table-wrapper">
          <table>
            <caption className="visually-hidden">Purchased products</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">ID</th>
                <th scope="col">Item</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Discount</th>
                <th scope="col">Amount</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {purchasedItems.map((item, index) => {
                const category = categories.find(
                  (currentCategory) => currentCategory.id === item.category,
                );

                return (
                  <tr key={item.id}>
                    <td>{index}</td>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{CategoryIcon(category)}</td>
                    <td>{item.sellPrice}</td>
                    <td>{item.discount}%</td>
                    <td>{item.amount}</td>
                    <td>{displayNumber(calculateSubtotal(item))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <hr />

        <p className="grand-total">Total: {displayNumber(grandTotal)}</p>
      </section>
    </main>
  );
}
