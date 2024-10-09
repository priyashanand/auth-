import React from 'react';

const SecondaryNavbar = () => {
  return (
    <>
      <nav className="navbar sticky-top bg-dark">
        <div className="container-fluid">
          {/* Offcanvas Toggle Button */}
          <button 
            className="btn btn-primary" 
            type="button" 
            data-bs-toggle="offcanvas" 
            data-bs-target="#offcanvasWithBothOptions" 
            aria-controls="offcanvasWithBothOptions"
          >
            Enable both scrolling & backdrop
          </button>

          {/* Brand/Title */}
          <a className="navbar-brand" href="/">Sticky top</a>
        </div>
      </nav>

      {/* Offcanvas Menu */}
      <div 
        className="offcanvas offcanvas-start" 
        data-bs-scroll="true" 
        tabIndex="-1" 
        id="offcanvasWithBothOptions" 
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Backdrop with scrolling</h5>
          <button 
            type="button" 
            className="btn-close" 
            data-bs-dismiss="offcanvas" 
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <p>Try scrolling the rest of the page to see this option in action.</p>
        </div>
      </div>
    </>
  );
};

export default SecondaryNavbar;
