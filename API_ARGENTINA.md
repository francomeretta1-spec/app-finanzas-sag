# 🇦🇷 APIs Argentinas - App Finanzas

## ✅ **CONFIGURADO Y ACTIVO**

Todas las APIs están ya integradas. **No requiere configuración adicional.**

---

## 📚 Fuentes de Datos Argentinas

### 1. **Bluelytics** - Dólar Argentino ✅
- **URL**: `https://api.bluelytics.com.ar/v2/latest`
- **Key**: ❌ NO REQUERIDA
- **Datos**: 
  - Dólar Blue (compra/venta)
  - Dólar Oficial (compra/venta)
  - EUR/ARS
- **Actualización**: Cada 60 segundos
- **Docs**: https://www.bluelytics.com.ar/

### 2. **ArgentinaDatos** - Finanzas Argentinas ✅
- **URL**: `https://api.argentinadatos.com`
- **Key**: ❌ NO REQUERIDA
- **Datos**: 
  - Riesgo País (CDS)
  - Plazo Fijo (tasas de 30+ bancos)
  - BCRA, valores históricos
- **Actualización**: Cada 5 minutos
- **Docs**: https://www.argentina-datos.com/

### 3. **data912** - Bonos, LECAPs, ONs ✅
- **URL**: `https://data912.com/live`
- **Key**: ❌ NO REQUERIDA
- **Datos**: 
  - **Bonos Soberanos**: AL29, AL30, AL35, GD29, GD30 (con TIR y Duration)
  - **LECAPs/BONCAPs**: Precios, rendimiento, OHLC
  - **Bonos CER**: Valores con índice de inflación
  - **ONs Corporativas**: Obligaciones negociables (con OHLC)
- **Actualización**: Cada 5 minutos
- **Docs**: https://data912.com/

### 4. **BCRA** - Banco Central de Argentina ⏳
- **URL**: `https://www.estadisticasbcra.com/api` (API tercero)
- **Key**: ❌ NO REQUERIDA
- **Datos posibles**: Tasas de referencias, base monetaria, etc.
- **Estado**: En desarrollo
- **Nota**: BCRA no tiene API oficial. Se usa API tercero: estadisticasbcra.com

### 5. **CAFCI** - Cámara de Fintech ❌
- **URL**: https://www.cafci.org.ar
- **Estado**: SIN API PÚBLICA
- **Alternativa**: Usar datos de ArgentinaDatos

---

## 🔄 Actualización Automática

```
Inicio de la app
     ↓
cargarDolar() → Bluelytics (cada 60 segundos)
     ↓
actualizarTodosPreciosAPIs()
  ├─ obtenerDolarArgentina() 
  ├─ obtenerDatosArgentinaDatos()
  ├─ obtenerBonosONs()
  └─ obtenerDatosBCRA()
  (cada 5 minutos)
     ↓
cargarNewsTicker() (cada 10 minutos)
```

---

## ✨ Categorías Cubiertas

| Categoría | Fuente | Status |
|-----------|--------|--------|
| 💵 Dólar Argentina | Bluelytics | ✅ Activo |
| 📊 Riesgo País | ArgentinaDatos + BCRA | ✅ Activo |
| 🏦 Plazo Fijo | ArgentinaDatos | ✅ Activo |
| 🏛️ Bonos Soberanos | data912 | ✅ Activo |
| 📈 LECAPs/BONCAPs | data912 | ✅ Activo |
| 🔄 Bonos CER | data912 | ✅ Activo |
| 🏢 ONs Corporativas | data912 | ✅ Activo |
| 🌐 Índices Globales | Mock (demo) | 📝 Demo |

---

## 🎯 Ventajas del Setup Argentino

✅ **100% Gratuito** - Todas las APIs son públicas y sin costo  
✅ **Sin registración** - Excepto BCRA si se necesita  
✅ **Datos locales** - Enfocado en mercado argentino  
✅ **Actualizaciones automáticas** - Cada 5 minutos  
✅ **Fallback inteligente** - Si falla una API, usa marca previa  
✅ **Responsive** - No bloquea UI (5s timeout máximo)  

---

## 🚀 Status Actual

**✅ LISTO PARA USAR** - Todas las APIs están integradas y funcionando

No se requiere:
- ❌ Registración en plataformas
- ❌ API Keys
- ❌ Configuración adicional
- ❌ Backend

---

## 📝 Notas

1. Los datos se actualizan automáticamente cada 5 minutos
2. Si una API no responde, la app usa datos previos (fallback)
3. Los índices globales usan datos mock (para demo)
4. Para producción: agregar verifica HTTPS y caché de datos

---

**Última actualización**: 26 de marzo de 2026
