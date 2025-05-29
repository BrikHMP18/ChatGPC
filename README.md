# ChatGPC 🏥💬

**Chat con Guías de Práctica Clínica** - Sistema de chat inteligente que utiliza RAG (Retrieval-Augmented Generation) para consultar guías de práctica clínica públicas de EsSalud.

## 📋 Descripción

ChatGPC permite a profesionales de la salud consultar de manera interactiva las guías de práctica clínica oficiales mediante un chat inteligente. Utiliza **LangChain**, **LangGraph** y **RAG** para proporcionar respuestas precisas basadas en documentos verificados.

### 🎯 Características

- **RAG con LangChain/LangGraph**: Recuperación y generación aumentada
- **Chat Inteligente**: Interfaz conversacional moderna
- **Búsqueda Semántica**: Embeddings vectoriales para encontrar información relevante
- **Fuentes Verificadas**: Referencias a documentos oficiales
- **Responsive Design**: Modo claro/oscuro, optimizado para móviles

## 🏗️ Stack Tecnológico

**Backend:**
- LangChain + LangGraph para orquestación de agentes
- OpenAI GPT-4 para generación de respuestas
- Express.js + Vector Store para API y búsqueda semántica

**Frontend:**
- React 19 + TypeScript + Vite
- CSS moderno con sistema de temas

**Deployment:**
- Genezio (plataforma serverless)

## 📚 Guías Incluidas

1. **Crisis Asmática en niños y adolescentes** (EsSalud 2023)
2. **Hipertensión Arterial Pulmonar** (EsSalud 2024)

## 🚀 Instalación

```bash
# Backend
cd server && npm install
# Configurar OPENAI_API_KEY en .env

# Frontend  
cd client && npm install

# Desarrollo
npm run dev # en ambas carpetas
```

## 📖 Uso

Escribe consultas como:
- "¿Tratamiento para crisis asmática severa?"
- "¿Criterios ecocardiográficos para HAP?"

## 🎓 Desarrollo

Este proyecto fue construido siguiendo el tutorial de [notJust․dev](https://www.youtube.com/watch?v=kEtGm75uBes&t=7942s&ab_channel=notJust%E2%80%A4dev), con modificaciones en el frontend y funcionalidades específicas para el dominio médico.

## 🤝 Contribuciones

1. Fork el repositorio
2. Crea tu feature branch
3. Commit y push
4. Abre un Pull Request

## 📞 Contacto

- **Desarrollador**: BrikHMP18
- **Email**: a20202489@pucp.edu.pe
- **GitHub**: [BrikHMP18](https://github.com/BrikHMP18)

---

**Nota**: Proyecto educativo basado en guías públicas de EsSalud. Consulte profesionales para decisiones médicas.
