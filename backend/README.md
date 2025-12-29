# DAB-Form Backend

FastAPI Backend für DAB-Form Webanwendung.

## Setup

1. Virtual Environment:

```bash
   python3 -m venv venv
   source venv/bin/activate
```

1. Dependencies:

```bash
   pip install -r requirements.txt
```

1. Environment:

```bash
   cp .env.example .env
   # Dann .env anpassen
```

1. Server starten:

```bash
   uvicorn app.main:app --reload
```

1. API Docs:

```js
   http://localhost:8000/docs
```
