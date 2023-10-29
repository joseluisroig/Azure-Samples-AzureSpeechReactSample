import React from 'react';
import "./css/theme.css"

const TeachersGallery = () => {

      const cards = [
        {
          title: 'Modal verbs',
          text: 'In this beginner\'s English course, we\'ll focus on "modal verbs" such as can, could, should, and must. You\'ll learn how to use them to express ability, possibility, obligation, and advice.',
          imgSrc: 'assets/images/teacher1-2-816x816.png',
          btnText: 'Prueba',
          btnLink: '/avatar/?avatar=profesor_ingles&usuario=leo',
          isInternalLink: true,
        },
        {
          title: 'Modal verbs',
          text: 'In this beginner\'s English course, we\'ll focus on "modal verbs" such as can, could, should, and must. You\'ll learn how to use them to express ability, possibility, obligation, and advice.',
          imgSrc: 'assets/images/ingles6-596x596.png',
          btnText: 'Prueba',
          btnLink: 'https://metaversolab.es/?avatar=profesor_ingles&usuario=leo'
        },
        {
          title: 'Modal verbs',
          text: 'In this beginner\'s English course, we\'ll focus on "modal verbs" such as can, could, should, and must. You\'ll learn how to use them to express ability, possibility, obligation, and advice.',
          imgSrc: 'assets/images/ingles14-596x596.png',
          btnText: 'Prueba',
          btnLink: 'https://metaversolab.es/?avatar=profesor_ingles&usuario=leo'
        },
        {
          title: 'Modal verbs',
          text: 'In this beginner\'s English course, we\'ll focus on "modal verbs" such as can, could, should, and must. You\'ll learn how to use them to express ability, possibility, obligation, and advice.',
          imgSrc: 'assets/images/ingles5-596x596.png',
          btnText: 'Prueba',
          btnLink: 'https://metaversolab.es/?avatar=profesor_ingles&usuario=leo'
        },
        {
          title: 'Modal verbs',
          text: 'In this beginner\'s English course, we\'ll focus on "modal verbs" such as can, could, should, and must. You\'ll learn how to use them to express ability, possibility, obligation, and advice.',
          imgSrc: 'assets/images/teacher1-2-816x816.png',
          btnText: 'Prueba',
          btnLink: 'https://metaversolab.es/?avatar=profesor_ingles&usuario=leo'
        },
        {
          title: 'Modal verbs',
          text: 'In this beginner\'s English course, we\'ll focus on "modal verbs" such as can, could, should, and must. You\'ll learn how to use them to express ability, possibility, obligation, and advice.',
          imgSrc: 'assets/images/teacher1-2-816x816.png',
          btnText: 'Prueba',
          btnLink: 'https://metaversolab.es/?avatar=profesor_ingles&usuario=leo'
        },
        {
          title: 'Modal verbs',
          text: 'In this beginner\'s English course, we\'ll focus on "modal verbs" such as can, could, should, and must. You\'ll learn how to use them to express ability, possibility, obligation, and advice.',
          imgSrc: 'assets/images/teacher1-2-816x816.png',
          btnText: 'Prueba',
          btnLink: 'https://metaversolab.es/?avatar=profesor_ingles&usuario=leo'
        },
        {
          title: 'Modal verbs',
          text: 'In this beginner\'s English course, we\'ll focus on "modal verbs" such as can, could, should, and must. You\'ll learn how to use them to express ability, possibility, obligation, and advice.',
          imgSrc: 'assets/images/teacher1-2-816x816.png',
          btnText: 'Prueba',
          btnLink: 'https://metaversolab.es/?avatar=profesor_ingles&usuario=leo'
        },
        // ...añadir otros objetos de tarjeta aquí
      ];
    
      return (
        <>
          <section data-bs-version="5.1" className="gallery3 cid-tSXLDp0shU" id="gallery3-2v">
            <div className="container">
              <div className="mbr-section-head">
                <h4 className="mbr-section-title mbr-fonts-style align-left mb-0 display-2">1 hour English assistants</h4>
              </div>
              <div className="row mt-5">
                {cards.slice(0, 8).map((card, index) => (
                  <div key={index} className="item features-image col-12 col-md-6 col-lg-3">
                    <div className="item-wrapper">
                      <div className="item-img">
                        <img src={card.imgSrc} alt={card.title} />
                      </div>
                      <div className="item-content">
                        <h5 className="item-title mbr-fonts-style display-5">{card.title}</h5>
                        <p className="mbr-text mbr-fonts-style mt-3 display-7">{card.text}</p>
                      </div>
                      <div className="mbr-section-btn item-footer mt-2">
                        <a href={card.btnLink} className="btn item-btn btn-info display-4" target="_blank" rel="noopener noreferrer">{card.btnText}</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      );
    }
    
    export default TeachersGallery;
    

    
