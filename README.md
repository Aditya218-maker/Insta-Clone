# Full-Stack Media Application

A decoupled, full-stack media sharing application designed to master enterprise design patterns, secure asynchronous data flow, and server-side route protection. The primary focus of this project was enforcing a strict separation of concerns and establishing a secure backend infrastructure, bypassing reliance on visual UI frameworks.

---

##  Architecture

### 1. Express.js Routing & Middleware Pipeline
Components interact with the server through a secure, gated routing layer. Before hitting core business controllers, requests are intercepted by custom identity verification middleware to enforce authorization boundaries, parse user state, and protect sensitive application logic.

### 2. Relational Schema Design (MongoDB)
To handle the user social graph (Followers/Following network) efficiently within a document database, the data model relies on a decoupled design strategy. Transactional relationships are abstracted into dedicated schema definitions, separating entity metadata from structural lookup indexes to optimize data queries.

---

## Technical Implementations

* **Strict 4-Layer Frontend Architecture:** Organized the React client into distinct operational layers: UI/Components, Custom State Hooks, Network/Axios Services, and Core Data Processing to eliminate component bloat and keep files modular.
* **Deterministic State Management:** Leveraged `useRef` and `useState` hooks to manage persistent DOM instances and handle state tracking across rendering lifecycles without inducing redundant UI re-renders.
* **Network Isolation & Security:** Implemented custom backend middleware to handle stateless token authorization. Configured strict Cross-Origin Resource Sharing (CORS) rules on the Express application to securely isolate data mutations.
* **Centralized API Handling:** Integrated Axios instances to decouple client-side network logic from UI layouts, allowing clean, reusable, global configurations for backend REST API endpoints.

---

## Tech Stack

* **Frontend:** React.js, HTML5, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Networking:** Axios, REST APIs

---

