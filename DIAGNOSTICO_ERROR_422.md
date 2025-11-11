# 🔍 Diagnóstico Error 422 - Endpoint `/api/history`

## ⚠️ Problema Identificado

**Error:** `GET /api/history?limit=50` → **422 Unprocessable Content**

El error **422** significa que la petición llega al backend correctamente, pero el servidor **no puede procesarla** debido a:
- Problemas de validación
- Autenticación incorrecta
- Falta un parámetro requerido
- El formato del token JWT no es el esperado

---

## ✅ Frontend - Ya Verificado

El frontend está **configurado correctamente**:
- ✅ Token se guarda en `localStorage` después del login
- ✅ Interceptor de Axios agrega automáticamente `Authorization: Bearer <token>`
- ✅ La petición se hace correctamente a `/api/history?limit=50`

**Logs agregados para debugging** - Revisa la consola del navegador para ver:
- 🔐 Si el token está presente
- 🔐 Primeros caracteres del token
- ❌ Detalles completos del error
- ❌ Headers de la petición

---

## 🔴 Backend - NECESITA REVISIÓN

### Problemas Comunes en el Endpoint `/api/history`

#### 1. **Decorador de Autenticación Faltante o Incorrecto**

```python
# ❌ INCORRECTO - Sin autenticación
@app.route('/api/history', methods=['GET'])
def get_history():
    limit = request.args.get('limit', 50)
    # ...

# ✅ CORRECTO - Con autenticación JWT
from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route('/api/history', methods=['GET'])
@jwt_required()  # ← ESTO ES CRÍTICO
def get_history():
    user_id = get_jwt_identity()  # Obtener ID del usuario
    limit = request.args.get('limit', 50, type=int)
    # ...
```

#### 2. **Validación de Parámetros Incorrecta**

```python
# ❌ INCORRECTO - Validación estricta que falla
limit = request.args.get('limit')  # Puede ser None o string
if limit > 100:  # TypeError si es string
    return jsonify({'error': 'Invalid limit'}), 422

# ✅ CORRECTO - Validación con defaults y conversión
limit = request.args.get('limit', 50, type=int)
limit = min(limit, 100)  # Límite máximo
```

#### 3. **Headers CORS Faltantes**

```python
# Verificar que CORS esté configurado para el endpoint
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://backend-api-calculo-multivariado-lix21q0m2-felipengs-projects.vercel.app",
            "https://tu-dominio.vercel.app"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False
    }
})
```

#### 4. **Schema de Validación con Flask-RESTX o Marshmallow**

Si usas schemas de validación:

```python
# Asegúrate que el schema permite parámetros opcionales
from flask_restx import fields

history_params = api.parser()
history_params.add_argument('limit', type=int, required=False, default=50, location='args')
```

---

## 🛠️ Cómo Solucionarlo

### Paso 1: Verificar el Endpoint en el Backend

Busca el archivo donde está definido `/api/history` (probablemente `app.py` o similar) y verifica:

```python
@app.route('/api/history', methods=['GET'])
@jwt_required()  # ← ¿TIENE ESTE DECORADOR?
def get_history():
    try:
        user_id = get_jwt_identity()  # ← ¿OBTIENE EL USER_ID?
        limit = request.args.get('limit', 50, type=int)
        
        # Consultar historial de operaciones del usuario
        operations = Operation.query.filter_by(user_id=user_id)\
            .order_by(Operation.created_at.desc())\
            .limit(limit)\
            .all()
        
        return jsonify({
            'operations': [op.to_dict() for op in operations]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### Paso 2: Verificar la Configuración JWT

```python
from flask_jwt_extended import JWTManager

# Verifica que JWT esté configurado
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'tu-secret-key')
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

jwt = JWTManager(app)
```

### Paso 3: Test Manual con cURL

Prueba el endpoint manualmente desde la terminal:

```bash
# 1. Obtener un token (hacer login)
curl -X POST https://backend-api-calculo-multivariado.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tu-email@example.com","password":"tu-password"}'

# 2. Usar el token para obtener historial
curl -X GET "https://backend-api-calculo-multivariado.onrender.com/api/history?limit=50" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -v
```

La opción `-v` (verbose) te mostrará los headers completos y el error exacto.

### Paso 4: Revisar Logs del Backend en Render

1. Ve a tu dashboard de Render
2. Selecciona tu servicio backend
3. Ve a la pestaña "Logs"
4. Busca errores cuando hagas la petición a `/api/history`

Los logs te dirán **exactamente** qué está fallando.

---

## 🔍 Debugging desde el Frontend

Después de desplegar los cambios al frontend, abre la **consola del navegador** cuando intentes ver el historial. Verás:

```
🔐 Token presente: Sí
🔐 Primeros caracteres del token: eyJhbGciOiJIUzI1NiIs...
❌ Error completo: {...}
❌ Response status: 422
❌ Response data: { "error": "..." }  ← MENSAJE DEL BACKEND
❌ Request headers: { "Authorization": "Bearer ..." }
```

Esta información te dirá:
- ✅ Si el token se está enviando
- ✅ Qué error exacto devuelve el backend
- ✅ Si los headers están correctos

---

## 📋 Checklist de Solución

### En el Backend (Render)

- [ ] El endpoint `/api/history` tiene el decorador `@jwt_required()`
- [ ] Se obtiene el `user_id` con `get_jwt_identity()`
- [ ] El parámetro `limit` se valida correctamente
- [ ] CORS permite el header `Authorization`
- [ ] JWT está configurado correctamente
- [ ] Existe la tabla/modelo de operaciones en la BD
- [ ] Los logs de Render no muestran errores

### En el Frontend (Vercel)

- [x] Token se guarda después del login
- [x] Interceptor agrega el header `Authorization`
- [x] Logs de debugging están habilitados
- [ ] Desplegar cambios a Vercel

---

## 🎯 Solución Más Probable

El problema más común es que **falta el decorador `@jwt_required()` en el endpoint `/api/history`** del backend.

```python
# AÑADE ESTO AL ENDPOINT EN TU BACKEND
@app.route('/api/history', methods=['GET'])
@jwt_required()  # ← AÑADIR ESTA LÍNEA
def get_history():
    user_id = get_jwt_identity()  # ← OBTENER USER_ID DEL TOKEN
    # ... resto del código
```

Si el backend **no tiene implementado el endpoint `/api/history`**, necesitas crearlo siguiendo el ejemplo anterior.

---

## 📞 Próximos Pasos

1. **Despliega los cambios del frontend a Vercel** (para tener los logs de debugging)
2. **Revisa los logs en la consola** del navegador
3. **Copia el mensaje de error exacto** que devuelve el backend
4. **Revisa el código del backend** en el endpoint `/api/history`
5. **Revisa los logs de Render** para ver el error del lado del servidor

Con esa información podremos identificar y solucionar el problema exacto. 🚀

