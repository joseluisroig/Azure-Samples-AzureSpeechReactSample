
import React from 'react';
import './css/theme.css';  // Asegúrate de que la ruta sea la correcta
//import './css/smart-cart/minicart-theme.css'

import './css/mbr-additional.css'


const Header = () => {
  return (
  <section data-bs-version="5.1" className="header15 cid-tRE6AH6upE" id="header15-z">
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md">
          <div className="text-wrapper">
            <h2 className="mbr-section-title  display-2">
              <strong>
                Personaliza la atención en tu negocio con Human3&nbsp;
              </strong>
            </h2>
            <p className="mbr-text display-7">
              Human3 Digital ofrece Inteligencia Artificial para ayudar a las empresas a mejorar y personalizar la atención a sus clientes. Utilizando Humanos Digitales, las empresas pueden ofrecer a sus clientes una experiencia de atención amigable y personalizada.
            </p>
          </div>
        </div>
        <div className="mbr-figure col-12 col-md-7">
          <iframe
            title="Video de Vimeo"
            className="mbr-embedded-video"
            src="https://player.vimeo.com/video/874547739?autoplay=1&amp;loop=0"
            width="1280"
            height="720"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Header;
