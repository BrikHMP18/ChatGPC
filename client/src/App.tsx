import { useState, useRef, useEffect } from 'react';
import './App.css';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<number>(Date.now());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Aplicar tema al documento
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Reset textarea height
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.text,
          thread_id: threadId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now(),
        text: data.answer,
        isUser: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);

      const errorMessage = {
        id: Date.now(),
        text: 'Lo siento, hubo un error procesando tu consulta. Por favor, inténtalo de nuevo.',
        isUser: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setThreadId(Date.now());
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Icono de PDF mejorado
  const PDFIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="currentColor"/>
      <path d="M14 2V8H20" stroke="white" strokeWidth="1.5" fill="none"/>
      <text x="12" y="16" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">PDF</text>
    </svg>
  );

  // Iconos para el tema
  const SunIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="app-container">
      {/* Overlay para móvil */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Solo un botón de tema en la esquina superior derecha */}
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {darkMode ? <SunIcon /> : <MoonIcon />}
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="info-card">
            <h3>¿Qué es una Guía de Práctica Clínica?</h3>
            <p>
              Una Guía de Práctica Clínica (GPC) es un documento técnico que contiene recomendaciones 
              desarrolladas de forma sistemática para apoyar a profesionales y pacientes en la toma de 
              decisiones sobre cuidados de salud. Están orientadas a seleccionar las mejores opciones 
              diagnósticas y terapéuticas para una condición clínica específica, basándose en la mejor 
              evidencia disponible.
            </p>
          </div>

          <div className="guides-section">
            <h3>Guías Disponibles</h3>
            <ul className="guide-list">
              <li className="guide-item">
                <div className="guide-icon">
                  <PDFIcon />
                </div>
                <span className="guide-title">
                  Guía de Práctica Clínica para el manejo de la Crisis Asmática en niños y adolescentes
                </span>
              </li>
              <li className="guide-item">
                <div className="guide-icon">
                  <PDFIcon />
                </div>
                <span className="guide-title">
                  Guía de Práctica Clínica para el Diagnóstico y Seguimiento de la Hipertensión Arterial Pulmonar
                </span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <div className='chat-container'>
        <header className='chat-header'>
          <div className="title-group">
            <h1>ChatGPC</h1>
            <p className="subtitle">Chat con Guías de Práctica Clínica</p>
          </div>
          {/* Solo el botón de reset, sin botón de tema redundante */}
          <button className='reset-button' onClick={resetChat}>
            <svg
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M8 3V1L4 5L8 9V7C10.21 7 12 8.79 12 11C12 13.21 10.21 15 8 15C5.79 15 4 13.21 4 11H2C2 14.31 4.69 17 8 17C11.31 17 14 14.31 14 11C14 7.69 11.31 5 8 5V3Z'
                fill='currentColor'
              />
            </svg>
            Nueva Consulta
          </button>
        </header>

        <div className='messages-container'>
          {messages.length === 0 ? (
            <div className='empty-state'>
              <p>Inicie una consulta sobre las guías clínicas</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.isUser ? 'user-message' : 'ai-message'
                }`}
              >
                <div className='message-avatar'>
                  {message.isUser ? 'Tú' : 'GPC'}
                </div>
                <div className='message-content'>{message.text}</div>
              </div>
            ))
          )}
          {isLoading && (
            <div className='message ai-message'>
              <div className='message-avatar'>GPC</div>
              <div className='message-content loading'>
                <span className='dot'></span>
                <span className='dot'></span>
                <span className='dot'></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className='input-container'>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder='Escribe tu consulta sobre las guías clínicas...'
            disabled={isLoading}
            rows={1}
          />
          <button
            className='send-button'
            onClick={sendMessage}
            disabled={inputText.trim() === '' || isLoading}
            aria-label="Enviar mensaje"
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z'
                fill='currentColor'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;