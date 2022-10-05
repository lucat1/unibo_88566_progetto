import * as React from "react";
import { Link } from "react-router-dom";

export const pages = ["Store", "Services", "Boards", "Leaderboard"];

const Index: React.FC = () => {
  const links = pages.map((page: string) =>
    <li><Link to={page.toLowerCase()}>{page}</Link></li>);
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
