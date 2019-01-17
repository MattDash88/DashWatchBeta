import Link from 'next/link';
import shortid from 'shortid';
import React from 'react';
import '../css/single.css';
import '../css/style.css';
import '../css/modal.css'
import TabMain from '../tabs/TabMain'
import TabPerformance from '../tabs/TabPerformance'
import TabFunding from '../tabs/TabFunding'
import TabReports from '../tabs/TabReports'

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