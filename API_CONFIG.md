# 🔌 Configuración de APIs para App Finanzas

## Estado Actual
✅ **CoinGecko** (Crypto) - FUNCIONANDO (sin key)
✅ **Metals API** (Metales) - FUNCIONANDO (sin key)  
❌ **Alpha Vantage** (Índices) - PENDIENTE
❌ **EODHD** (Agro, Energía) - PENDIENTE

---

## 📚 APIs Recomendadas

### 1. **CoinGecko** - Criptomonedas ✅
- **Estado**: ACTIVO
- **URL**: `https://api.coingecko.com/api/v3`
- **Key**: NO REQUERIDA
- **Límite**: 10-50 calls/min sin key
- **Datos**: Bitcoin, Ethereum, XRP, etc.
- **Docs**: https://docs.coingecko.com/reference/introduction

### 2. **Metals API** - Metales Preciosos ✅
- **Estado**: ACTIVO
- **URL**: `https://api.metals.live/v1/spot`
- **Key**: NO REQUERIDA
- **Datos**: Oro (gold), Plata (silver), Cobre (copper) en USD/oz
- **Docs**: https://metals.live/api

### 3. **Alpha Vantage** - Índices, Acciones, Forex
- **URL**: `https://www.alphavantage.co/query`
- **Key**: REQUERIDA (registrarse gratis)
- **Límite**: 5 calls/min, 500/día (gratis)
- **Datos**: S&P500, Nasdaq, Dow Jones, EUR/USD, GBP/USD, etc.
- **Docs**: https://www.alphavantage.co/documentation/
- **Registrarse**: https://www.alphavantage.co/

**Ejemplo de uso**:
```
https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=YOUR_KEY
```

### 4. **EODHD** - Commodities, Energía, Tasas
- **URL**: `https://eodhd.com/api`
- **Key**: REQUERIDA (5 queries gratis/día)
- **Datos**: Petróleo (WTI, Brent), Soja, Trigo, Maíz, Gas Natural
- **Docs**: https://eodhd.com/
- **Registrarse**: https://eodhd.com/register

**Ejemplo de uso**:
```
https://eodhistoricaldata.com/api/real-time/WTI.FUTURES?api_token=YOUR_KEY&fmt=json
```

### 5. **Bluelytics** - Dólar Argentina ✅ (Ya configurado)
- **Estado**: ACTIVO
- **URL**: `https://api.bluelytics.com.ar/v2/latest`
- **Key**: NO REQUERIDA
- **Datos**: Dólar Blue, Oficial, EUR/ARS

---

## 🚀 Cómo Configurar

### Para **Alpha Vantage**:
1. Registrarse en https://www.alphavantage.co/
2. Copiar tu API Key
3. En `script.js`, buscar `API_CONFIG.ALPHA_VANTAGE_KEY` y reemplazar `'demo'` por tu key:
```javascript
ALPHA_VANTAGE_KEY: 'YOUR_API_KEY_HERE',
```

### Para **EODHD**:
1. Registrarse en https://eodhd.com/
2. Copiar tu API Token
3. En `script.js`, buscar `API_CONFIG.EODHD_KEY` y reemplazar `'demo'` por tu key:
```javascript
EODHD_KEY: 'YOUR_API_KEY_HERE',
```

---

## 📊 Categorías y APIs Asignadas

| Categoría | Simbolos | API | Key |
|-----------|----------|-----|-----|
| **Índices** | S&P500, Nasdaq, Dow, FTSE, DAX, Nikkei | Alpha Vantage | ⚠️ PENDIENTE |
| **Tasas** | 10Y, 30Y, 13W USA | Alpha Vantage | ⚠️ PENDIENTE |
| **Energía** | WTI, Brent, Gas Natural | EODHD | ⚠️ PENDIENTE |
| **Metales** | Oro, Plata, Cobre | Metals API | ✅ OK |
| **Agro** | Soja, Trigo, Maíz | EODHD | ⚠️ PENDIENTE |
| **Crypto** | Bitcoin, Ethereum, XRP | CoinGecko | ✅ OK |
| **Monedas** | EUR/USD, GBP/USD, JPY/USD | Alpha Vantage | ⚠️ PENDIENTE |
| **Dólar AR** | Blue, Oficial | Bluelytics | ✅ OK |

---

## 🔄 Actualización Automática

Los precios se actualizan automáticamente en estos intervalos:
- **Dólar**: Cada 1 minuto
- **Índices/Crypto/Metales**: Cada 5 minutos  
- **Noticias**: Cada 10 minutos

Si una API falla, la app usa datos mock automáticamente (fallback).

---

## 💡 Alternativas Gratuitas

Si prefieres no registrarte:
- Usa solo **CoinGecko** (crypto) + **Metals API** (metales) + **Bluelytics** (dólar AR)
- Mantén datos mock para el resto
- Actualizable cuando hagas upgrade a paid

---

## ⚠️ Notas Importantes

1. **Libre de Costo**: CoinGecko y Metals API son completamente gratis
2. **Fallback**: Si las APIs fallan, el app sigue funcionando con datos mock
3. **Rate Limits**: Alpha Vantage = 5 req/min. Staggerear si necesitas más símbolos
4. **Timeout**: Configurado a 5 segundos para no bloquear la UI
5. **Producción**: Para producción, usar backend propio para gestionar keys (no exponer en frontend)

---

## 📝 Próximos Pasos

1. Registrarse en **Alpha Vantage** (5 min) - Gratis
2. Registrarse en **EODHD** (5 min) - Gratis (5 queries/día)
3. Agregar las keys en `script.js`
4. Descomentar las funciones en `obtenerPreciosIndices()` y `obtenerPreciosAgro()`
5. ¡Listo! Los precios se actualizarán en vivo

---

¿Necesitas ayuda para configurar alguna API?
