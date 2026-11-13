import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://www.raydelto.org/agenda.php';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre: '', apellido: '', telefono: '' });
  const [status, setStatus] = useState({ text: '', isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showStatus = (text, isError = false) => {
    setStatus({ text, isError });
    setTimeout(() => {
      setStatus({ text: '', isError: false });
    }, 4000);
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener los datos.');
      const data = await response.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      showStatus('Error al cargar los contactos.', true);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, apellido, telefono } = formData;

    if (!nombre.trim() || !apellido.trim() || !telefono.trim()) {
      showStatus('Por favor complete todos los campos.', true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ nombre, apellido, telefono }),
      });

      if (!response.ok) throw new Error('No se pudo guardar el contacto.');

      showStatus('¡Contacto guardado exitosamente!');
      setFormData({ nombre: '', apellido: '', telefono: '' });
      await loadContacts();
    } catch (error) {
      console.error(error);
      showStatus('Error al intentar guardar el contacto.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container">
      <h1>Agenda Multicapas (React)</h1>

      {/* Formulario contactos */}
      <section className="card">
        <h2>Nuevo Contacto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej. Juan"
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              placeholder="Ej. Pérez"
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              placeholder="Ej. 8095550199"
            />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Contacto'}
            </button>
          </div>
        </form>
        {status.text && (
          <div id="statusMessage" className={status.isError ? 'error' : 'success'}>
            {status.text}
          </div>
        )}
      </section>

      {/* Listado de contactos */}
      <section className="card">
        <div className="contact-list-header">
          <h2>Listado de Contactos</h2>
          <button type="button" onClick={loadContacts}>Actualizar</button>
        </div>
        <div className="contact-grid">
          {loading ? (
            <div className="empty-state">Cargando contactos...</div>
          ) : contacts.length === 0 ? (
            <div className="empty-state">No hay contactos registrados.</div>
          ) : (
            contacts.map((contact, index) => (
              <div className="contact-card" key={index}>
                <div className="contact-name">
                  {`${contact.nombre || ''} ${contact.apellido || ''}`.trim() || 'Sin Nombre'}
                </div>
                <div className="contact-phone">
                  Tel: {contact.telefono || 'Sin teléfono'}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}