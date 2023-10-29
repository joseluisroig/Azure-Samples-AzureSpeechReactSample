import React from 'react';
import "./css/theme.css"

// Componente para cada tarjeta individual
const Tarjeta = ({ imagen, titulo, subtitulo, descripcion, enlace, textoBoton, onButtonClick }) => {
  return (
    <div className="item features-image col-12 col-md-6 col-lg-4">
      <div className="item-wrapper">
        <div className="item-img">
          <img src={imagen} alt={titulo} title={titulo} />
        </div>
        <div className="item-content">
          <h5 className="item-title texto-margin-tarjetas">{titulo}</h5>
          {subtitulo && <h6 className="item-subtitle texto-margin-tarjetas">{subtitulo}</h6>}
          <p className="mbr-text texto-margin-tarjetas">{descripcion}</p>
        </div>
        <div className="mbr-section-btn item-footer">
          <a href={enlace} className="btn item-btn" target="_blank" rel="noopener noreferrer" onClick={onButtonClick}>
            {textoBoton}
          </a>
        </div>
      </div>
    </div>
  );
};

// Componente principal que contiene todas las tarjetas
const Tarjetas = ({ navigate }) => {
  // Datos de las tarjetas
  const tarjetas = [
    {
      imagen: 'assets/images/camarera5-816x816.png',
      titulo: 'Camarero Digital',
      descripcion: 'Desarrollamos tu humano digital personalizado con Inteligencia Artificial...',
      enlace: 'https://camarerodigital.com',
      textoBoton: 'Más info'
    },
    {
      imagen: 'assets/images/ciudadano-816x825.jpg',
      titulo: 'Atención Ciudadano',
      subtitulo: 'Policía',
      descripcion: 'Información genérica para el ciudadano ofrecida por servicios públicos.',
      enlace: 'https://asistenteciudadanodigital.com/',
      textoBoton: 'Más info'
    },
    {
      imagen: 'assets/images/teacher1-816x816.png',
      titulo: 'Profesor Inglés',
      descripcion: 'Aprende inglés online con un profesor exclusivamente para ti, cualquier nivel.',
      enlace: '',
      textoBoton: 'Start Now'
    },
    {
      imagen: 'assets/images/entrevistador4-2-816x816.png',
      titulo: 'Entrevistador',
      descripcion: 'Entrénate para entrevistas de trabajo si estás buscando...',
      enlace: '',
      textoBoton: 'Start Now'
    },
    {
      imagen: 'assets/images/aistente1-816x816.png',
      titulo: 'Asistente Personal',
      descripcion: 'Necesitas un asistente personal que te gestione agenda, reuniones y te libere de tiempo.',
      enlace: 'https://youtu.be/IqDU_slfwhc?autoplay=1',
      textoBoton: 'Start Now'
    },
    {
      imagen: 'assets/images/asistente11-816x816.png',
      titulo: 'Ayudante Banca',
      descripcion: 'Asistente para ayudar a nuestros mayores con los trámites bancarios en los cajeros automáticos.',
      enlace: '',
      textoBoton: 'Start Now'
    },
    {
      imagen: 'assets/images/dependienta1-816x816.png',
      titulo: 'Asistente Compras',
      descripcion: 'Pon en tu negocio un asistente que ayude a tus clientes a realizar las compras online, más eficientes.',
      enlace: '',
      textoBoton: 'Start Now'
    },
    {
      imagen: 'assets/images/dentista1-816x816.png',
      titulo: 'Cita Médica',
      descripcion: 'Asistente para gestionar las citas de consultas médicas, farmacia, clínicas odontológicas ..',
      enlace: '',
      textoBoton: 'Start Now'
    },
    {
      imagen: 'assets/images/reservations1-816x816.png',
      titulo: 'GastroWeb',
      descripcion: 'Reserva de cita en restaurantes, o solicitud de comida a domicilio con IA.',
      enlace: 'https://camarerodigital.com/gastro3concierge.html',
      textoBoton: 'Start Now'
    }
  ];

  const goToPageTwo = () => {
    navigate("/teachers");
  };

  return (
    <section className="features4">
      <div className="container">
        <div className="mbr-section-head">
          <h4 className="mbr-section-title">Servicios Human3Digital</h4>
          <h5 className="mbr-section-subtitle">Puedes solicitar un Human3 a medida para tu negocio.</h5>
        </div>
        <div className="row mt-4">
          {tarjetas.map((tarjeta, index) => (
            <Tarjeta 
              key={index} 
              {...tarjeta} 
              onButtonClick={tarjeta.titulo === 'Profesor Inglés' ? goToPageTwo : null} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Tarjetas;
