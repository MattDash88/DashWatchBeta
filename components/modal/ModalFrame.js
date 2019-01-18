import React from 'react';

// Import css
import '../css/single.css';
import '../css/style.css';
import '../css/modal.css'

const ModalFrame = ({ show, children }) => {

    
    const showHideClassName = show ? "modal display-block" : "modal display-none";
  
  
    return (
      <div className={showHideClassName} id="outside">
        <section className="modal-main">
          {children}
        </section>
      </div>
    );
    
  };

  export default ModalFrame