# 🦸‍♂️ RIU Frontend

Aplicación desarrollada en Angular 20 siguiendo principios de **Clean Architecture**. Permite gestionar entidades de tipo `Hero` conectándose a una API mockeada con `json-server`.

---

## 🚀 Cómo levantar el proyecto

### 1. Instalar dependencias

```bash
yarn install
```

### 2. Levantar la API (en una terminal aparte)

```bash
yarn api
```

### 3. Levantar la aplicación Angular

```bash
ng serve
```

La app estará disponible en: [http://localhost:4200](http://localhost:4200)

---

## 🧪 Comandos útiles

- **Lint**
  ```bash
  yarn lint
  ```

- **Tests unitarios (Jest)**
  ```bash
  yarn test:watch      # Para ejecutar tests en modo watch
  yarn test:coverage   # Para ver cobertura de código
  ```

---

## 🧱 Arquitectura

Este proyecto aplica **Clean Architecture** y Angular moderno con `standalone components`, `signals` y organización por funcionalidades.

```
src/
└── app/
    ├── app.config.ts         # Configuración principal de la app
    ├── app.routes.ts         # Definición de rutas
    ├── app.ts                # Bootstrap
    ├── heroes/               # Feature principal
    │   ├── adapters/         # Adaptadores entre infraestructura y dominio
    │   ├── components/       # Componentes de UI (formularios, tablas, etc.)
    │   ├── domain/           
    │   │   ├── models/       # Entidades y tipos (hero.ts, filter, etc.)
    │   │   ├── hero-provider.ts
    │   │   └── hero-repository.ts
    │   ├── services/         # Implementaciones (ej: cliente HTTP)
    └── shared/
        ├── models/           # Tipos y utilidades comunes
        └── utils/            # Helpers generales (patch-object, etc.)
```

---

## 📦 Convenciones y buenas prácticas

- Se utiliza **Conventional Commits** para mantener un historial limpio.
- Estructura basada en separación de responsabilidades: presentación, aplicación, dominio e infraestructura.
- Testing con **Jest** y buenas prácticas con **ESLint**.

---

## 🛠 Stack

- Angular 20 (standalone, signals)
- TypeScript
- json-server (API mock)
- Jest (testing)
- ESLint