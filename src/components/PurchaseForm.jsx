import { categories } from "../assets/data";

export default function PurchaseForm({
  selectedCategoryId,
  selectedProductId,
  purchaseAmount,
  products,
  errorMessage,
  onCategoryChange,
  onProductChange,
  onAmountChange,
  onSubmit,
}) {
  const hasSelectedProduct = selectedProductId !== "";
  const isAddButtonDisabled =
    !hasSelectedProduct || Number(purchaseAmount) <= 0;

  return (
    <form className="purchase-form" onSubmit={onSubmit}>
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
          {products.map((product) => (
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
          disabled={!hasSelectedProduct}
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
  );
}
