import React from 'react';

export default function Footer() {
  return (
    <footer className="container site-footer">
      <div>
        <strong>RAJAN SHARMA</strong> — SOFTWARE ENGINEER
      </div>
      <div>&copy; {new Date().getFullYear()} • BUILT WITH MODERN WEB STANDARDS</div>
      <div>
        <a href="#header">Back To Top &uarr;</a>
      </div>
    </footer>
  );
}
