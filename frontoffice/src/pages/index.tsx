import * as React from "react";
import { Link } from "react-router-dom";

export const pages = [{
  name: "Store",
  url: '/products',
}, {
  name: "Services",
  url: '/services',
},
{
  name: "Boards",
  url: '/boards'
}];

const Index: React.FC = () => {
  const links = pages.map((page) =>
    <li><Link to={page.url}>{page.name}</Link></li>);
  return (<div className="container">
    <aside className="menu">
      <p className="menu-label">Index</p>
      <ul className="menu-list">
        {links}
      </ul>
    </aside>
  </div>);
};

export default Index;
