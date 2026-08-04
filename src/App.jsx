import { useState } from "react";
import { products } from "./assets/data";
import PurchaseForm from "./components/PurchaseForm";
import PurchaseTable from "./components/PurchaseTable";
import "./App.css";

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
        <PurchaseForm
          selectedCategoryId={selectedCategoryId}
          selectedProductId={selectedProductId}
          purchaseAmount={purchaseAmount}
          products={filteredProducts}
          errorMessage={errorMessage}
          onCategoryChange={onCategoryChange}
          onProductChange={onProductChange}
          onAmountChange={onAmountChange}
          onSubmit={addPurchasedItem}
        />

        <PurchaseTable purchasedItems={purchasedItems} />
      </section>
    </main>
  );
}
