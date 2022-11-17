import * as React from "react";
import { Link } from "react-router-dom";

export const pages = [
  {
    name: "Products",
    url: "/products",
  },
  {
    name: "Pets",
    url: "/pets",
  },
  {
    name: "Services",
    url: "/services",
  },
  {
    name: "Boards",
    url: "/boards",
  },
];

const Index: React.FC = () => {
  return (
    <div className="container">
      <aside className="menu">
        <p className="menu-label">Index</p>
        <ul className="menu-list">
          {pages.map((page, i) => (
            <li key={i}>
              <Link to={page.url}>{page.name}</Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Index;
