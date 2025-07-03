import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center text-gray-600 text-sm py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} DataHex. All rights reserved.</p>
        <p className="mt-1">123 Example Street, Your City, Country</p>
        <p className="mt-1">Contact: support@datahex.com | +91 98765 43210</p>
      </div>
    </footer>
  );
};

export default Footer;
