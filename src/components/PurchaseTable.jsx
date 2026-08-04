import {
  Cable,
  Headphones,
  Laptop,
  Mouse,
  Settings,
  TabletSmartphone,
} from "lucide-react";
import { categories } from "../assets/data";

function CategoryIcon({ category }) {
  const iconClassName = "category-icon";
  const iconProps = { className: iconClassName, "aria-label": category.title };

  switch (category.icon) {
    case "mouse":
      return <Mouse {...iconProps} />;
    case "laptop":
      return <Laptop {...iconProps} />;
    case "tablet-smartphone":
      return <TabletSmartphone {...iconProps} />;
    case "headphones":
      return <Headphones {...iconProps} />;
    case "cable":
      return <Cable {...iconProps} />;
    default:
      return <Settings {...iconProps} />;
  }
}

function calculateSubtotal(item) {
  const discountedPrice = item.sellPrice * (1 - item.discount / 100);
  return discountedPrice * item.amount;
}

function displayNumber(number) {
  return Number.isInteger(number) ? number : number.toFixed(2);
}

export default function PurchaseTable({ purchasedItems }) {
  const grandTotal = purchasedItems.reduce(
    (total, item) => total + calculateSubtotal(item),
    0,
  );

  return (
    <>
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
                  <td>
                    <CategoryIcon category={category} />
                  </td>
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
    </>
  );
}
