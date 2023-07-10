import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="container">
      <div className="header">
        <span className="logo">Reyfood</span>
      </div>
      <ul className="list">
        <li className="item">
          <Link href="/" className="link">
            Home
          </Link>
        </li>
        <li className="item">
          <Link href="/makanan" className="link">
            Makanan
          </Link>
        </li>

        <li className="item">
          <Link href="/about" className="link">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
