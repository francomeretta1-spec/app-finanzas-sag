// ==============================
// APIS CONFIGURATION - Fuentes Argentinas + Alpha Vantage
// ==============================
const API_CONFIG = {
  // BCRA - Banco Central de la República Argentina
  BCRA_API: 'https://www.estadisticasbcra.com/api',
  
  // ArgentinaDatos - Datos financieros argentinos
  ARGENTINA_DATOS_API: 'https://api.argentinadatos.com',
  
  // data912 - Datos de bonos, LECAPs, ONs
  DATA912_API: 'https://data912.com/live',
  
  // Bluelytics - Dólar Argentina
  BLUELYTICS_API: 'https://api.bluelytics.com.ar/v2/latest',
  
  // Alpha Vantage - Índices globales
  // Registrarse gratis en: https://www.alphavantage.co/
  // Reemplazar 'demo' con tu API key cuando sea necesario
  ALPHA_VANTAGE_KEY: 'demo',
  ALPHA_VANTAGE_API: 'https://www.alphavantage.co/query'
};

// Timeout para no bloquear UI
const FETCH_TIMEOUT = 5000;

function init() {
  setupTabs();
  cargarDolar();
  actualizarTodosPreciosAPIs(); // Nueva línea: obtener precios de APIs
  cargarNewsTicker();
  
  // Intervalos de actualización
  setInterval(cargarDolar, 60000);           // Dólar cada 1 min
  setInterval(actualizarTodosPreciosAPIs, 300000); // APIs cada 5 min
  setInterval(cargarNewsTicker, 600000);    // Noticias cada 10 min
}

// ==============================
// LOCALSTORAGE - Persistencia
// ==============================

// ==============================
// SISTEMA DE TABS
// ==============================

function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      // Remover active de todos
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      // Agregar active
      btn.classList.add('active');
      const section = document.getElementById(tabName + '-section');
      if (section) {
        section.classList.add('active');
        
        // Cargar datos específicos del tab
        if (tabName === 'ars') {
          cargarARS();
        }
      }
    });
  });
}

// ==============================
// COTIZACIONES (Bluelytics API)
// ==============================

async function cargarDolar() {
  try {
    // Cargar Bluelytics
    const response = await fetch("https://api.bluelytics.com.ar/v2/latest");
    const data = await response.json();

    const blue = data.blue.value_sell;
    const oficial = data.oficial.value_sell;

    // Actualiza valores en cards
    document.getElementById("blue").textContent = "$ " + blue.toFixed(2);
    document.getElementById("oficial").textContent = "$ " + oficial.toFixed(2);
    document.getElementById("mep").textContent = "$ " + blue.toFixed(2);
    document.getElementById("ccl").textContent = "$ " + blue.toFixed(2);

    // Actualiza strip
    document.getElementById("strip-oficial").textContent = "$ " + oficial.toFixed(2);
    document.getElementById("strip-ccl").textContent = "$ " + blue.toFixed(2);
    document.getElementById("strip-mep").textContent = "$ " + blue.toFixed(2);

    // Cargar Riesgo País (ArgentinaDatos)
    try {
      const riesgoResp = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo");
      const riesgoData = await riesgoResp.json();
      if (riesgoData.valor) {
        document.getElementById("strip-riesgo").textContent = riesgoData.valor + " pb";
      }
    } catch (e) {
      console.warn("Error riesgo país:", e);
    }

    // Actualiza hora
    document.getElementById("hora").textContent = new Date().toLocaleTimeString("es-AR");

  } catch (error) {
    console.error("Error al cargar cotizaciones:", error);
  }
}

// ==============================
// MONITOR GLOBAL
// ==============================

const MUNDO_SYMBOLS = {
  indices: [
    { id: 'sp500', symbol: '^GSPC', name: 'S&P 500', icon: '📈', apiSymbol: 'SPY' },
    { id: 'nasdaq', symbol: '^IXIC', name: 'Nasdaq', icon: '💻', apiSymbol: 'QQQ' },
    { id: 'dow', symbol: '^DJI', name: 'Dow Jones', icon: '🏢', apiSymbol: 'IVV' },
    { id: 'ftse', symbol: '^FTSE', name: 'FTSE 100', icon: '🇬🇧', apiSymbol: 'EWU' },
    { id: 'dax', symbol: '^GDAXI', name: 'DAX', icon: '🇩🇪', apiSymbol: 'EWG' },
    { id: 'nikkei', symbol: '^N225', name: 'Nikkei 225', icon: '🇯🇵', apiSymbol: 'EWJ' },
  ],
  tasas: [
    { id: 'tnx', symbol: '^TNX', name: '10Y USA', icon: '📊', apiSymbol: 'TLT', isRate: true },
    { id: 'tyx', symbol: '^TYX', name: '30Y USA', icon: '📈', apiSymbol: 'TLH', isRate: true },
    { id: 'irx', symbol: '^IRX', name: '13W USA', icon: '📉', apiSymbol: 'SHV', isRate: true },
  ],
  energia: [
    { id: 'oil', symbol: 'CL=F', name: 'Petróleo WTI', icon: '🛢️', apiSymbol: 'USO' },
    { id: 'brent', symbol: 'BZ=F', name: 'Petróleo Brent', icon: '⛽', apiSymbol: 'BNO' },
    { id: 'gas', symbol: 'NG=F', name: 'Gas Natural', icon: '🔥', apiSymbol: 'UNG' },
  ],
  metales: [
    { id: 'gold', symbol: 'GC=F', name: 'Oro', icon: '🥇', apiSymbol: 'GLD' },
    { id: 'silver', symbol: 'SI=F', name: 'Plata', icon: '⚪', apiSymbol: 'SLV' },
    { id: 'copper', symbol: 'HG=F', name: 'Cobre', icon: '🟠', apiSymbol: 'JJC' },
  ],
  agro: [
    { id: 'wheat', symbol: 'ZWH=F', name: 'Trigo', icon: '🌾', apiSymbol: 'ZWH' },
    { id: 'soy', symbol: 'ZSH=F', name: 'Soja', icon: '🫘', apiSymbol: 'ZS' },
    { id: 'corn', symbol: 'ZCH=F', name: 'Maíz', icon: '🌽', apiSymbol: 'ZC' },
  ],
  crypto: [
    { id: 'btc', symbol: 'BTC-USD', name: 'Bitcoin', icon: '₿', apiSymbol: 'BTC' },
    { id: 'eth', symbol: 'ETH-USD', name: 'Ethereum', icon: 'Ξ', apiSymbol: 'ETH' },
    { id: 'xrp', symbol: 'XRP-USD', name: 'XRP', icon: '🪙', apiSymbol: 'XRP' },
  ],
  monedas: [
    { id: 'eurusd', symbol: 'EURUSD=X', name: 'EUR/USD', icon: '🇪🇺', apiSymbol: 'EURUSD' },
    { id: 'gbpusd', symbol: 'GBPUSD=X', name: 'GBP/USD', icon: '🇬🇧', apiSymbol: 'GBPUSD' },
    { id: 'jpyusd', symbol: 'JPYUSD=X', name: 'JPY/USD', icon: '🇯🇵', apiSymbol: 'JPYUSD' },
  ]
};

// Datos de demostración (se actualizan con APIs reales)
const MUNDO_MOCK = {
  'SPY': { price: 6549.5, change: 0.38 },
  'QQQ': { price: 23869, change: 0.31 },
  'IVV': { price: 46423, change: 0.42 },
  'EWU': { price: 8420, change: 0.25 },
  'EWG': { price: 28640, change: 0.19 },
  'EWJ': { price: 27850, change: -0.15 },
  'TLT': { price: 4.416, change: 2.03 },
  'TLH': { price: 4.839, change: 2.15 },
  'SHV': { price: 5.12, change: 1.85 },
  'USO': { price: 93.15, change: -1.41 },
  'BNO': { price: 98.42, change: -1.25 },
  'UNG': { price: 28.45, change: -2.30 },
  'GLD': { price: 4395.5, change: 0.44 },
  'SLV': { price: 68.03, change: 1.15 },
  'JJC': { price: 4.28, change: -0.55 },
  'ZWH': { price: 604.75, change: 1.25 },
  'ZS': { price: 1171.50, change: -0.92 },
  'ZC': { price: 466.50, change: -1.45 },
  'BTC': { price: 68734.7, change: -3.60 },
  'ETH': { price: 2060.52, change: -4.96 },
  'XRP': { price: 2.45, change: -5.20 },
  'EURUSD': { price: 1.0835, change: 0.12 },
  'GBPUSD': { price: 1.2678, change: 0.08 },
  'JPYUSD': { price: 0.0067, change: -0.30 }
};

// ==============================
// FUNCIONES PARA OBTENER DATOS DE APIs ARGENTINAS
// ==============================

// Helper: Fetch con timeout
async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    return null;
  }
}

// 1. DÓLAR ARGENTINA - Bluelytics API ✅
async function obtenerDolarArgentina() {
  try {
    const response = await fetchWithTimeout(API_CONFIG.BLUELYTICS_API);
    if (!response?.ok) return null;
    
    const data = await response.json();
    // Retornar solo para logging, ya se usa en cargarDolar()
    console.log('✅ Dólar desde Bluelytics:', {
      blue_venta: data.blue.value_sell,
      oficial_venta: data.oficial.value_sell
    });
    return data;
  } catch (error) {
    console.log('Error Bluelytics:', error);
    return null;
  }
}

// 2. DATOS FINANCIEROS ARGENTINOS - ArgentinaDatos API ✅
async function obtenerDatosArgentinaDatos() {
  try {
    // Obtener Riesgo País
    const riesgoRes = await fetchWithTimeout(
      `${API_CONFIG.ARGENTINA_DATOS_API}/v1/finanzas/indices/riesgo-pais/ultimo`
    );
    
    // Obtener Plazo Fijo
    const plazoRes = await fetchWithTimeout(
      `${API_CONFIG.ARGENTINA_DATOS_API}/v1/finanzas/tasas/plazoFijo`
    );
    
    const riesgoData = riesgoRes?.ok ? await riesgoRes.json() : null;
    const plazoData = plazoRes?.ok ? await plazoRes.json() : null;
    
    console.log('✅ Datos ArgentinaDatos obtenidos');
    return { riesgoData, plazoData };
  } catch (error) {
    console.log('Error ArgentinaDatos:', error);
    return null;
  }
}

// 3. BONOS Y ONs - data912 API ✅
async function obtenerBonosONs() {
  try {
    const [bonos, lecaps, ons] = await Promise.all([
      fetchWithTimeout(`${API_CONFIG.DATA912_API}/arg_bonds`),
      fetchWithTimeout(`${API_CONFIG.DATA912_API}/arg_notes`),
      fetchWithTimeout(`${API_CONFIG.DATA912_API}/arg_corp`)
    ]);
    
    const bonosData = bonos?.ok ? await bonos.json() : null;
    const lecapsData = lecaps?.ok ? await lecaps.json() : null;
    const onsData = ons?.ok ? await ons.json() : null;
    
    console.log('✅ Bonos/LECAPs/ONs obtenidos desde data912');
    return { bonosData, lecapsData, onsData };
  } catch (error) {
    console.log('Error data912:', error);
    return null;
  }
}

// 4. BCRA - Datos económicos de Argentina
async function obtenerDatosBCRA() {
  try {
    // BCRA tiene endpoint de tasas, inflación, etc.
    // Endpoint: https://www.estadisticasbcra.com/api/tasa_servicios_bancos/{cuil}/archivos
    // Para datos generales públicos
    const response = await fetchWithTimeout(
      `${API_CONFIG.BCRA_API}/tasas`
    );
    
    if (!response?.ok) return null;
    const data = await response.json();
    
    console.log('✅ Datos BCRA obtenidos');
    return data;
  } catch (error) {
    console.log('Error BCRA API:', error);
    return null;
  }
}

// 5. ÍNDICES GLOBALES - Alpha Vantage (para Yahoo Finance)
async function obtenerIndicesAlphaVantage() {
  try {
    // Símbolos a obtener (representantes de índices)
    const simbolos = {
      'SPY': { display: 'S&P 500', realSymbol: 'GSPC' },
      'QQQ': { display: 'Nasdaq', realSymbol: 'CCMP' },
      'IVV': { display: 'Dow Jones', realSymbol: 'DJI' }
    };
    
    const resultados = {};
    
    // Obtener datos de cada símbolo
    for (const [simbolo, info] of Object.entries(simbolos)) {
      try {
        const url = `${API_CONFIG.ALPHA_VANTAGE_API}?function=GLOBAL_QUOTE&symbol=${info.realSymbol}&apikey=${API_CONFIG.ALPHA_VANTAGE_KEY}`;
        const response = await fetchWithTimeout(url);
        
        if (!response?.ok) continue;
        
        const data = await response.json();
        
        // Alpha Vantage retorna: price, change, change percent
        if (data['Global Quote'] && data['Global Quote']['05. price']) {
          const quote = data['Global Quote'];
          resultados[simbolo] = {
            price: parseFloat(quote['05. price']) || MUNDO_MOCK[simbolo].price,
            change: parseFloat(quote['09. change percent']?.replace('%', '')) || MUNDO_MOCK[simbolo].change
          };
        }
      } catch (e) {
        // Si falla este símbolo, continuar con el siguiente
        console.log(`Error obteniendo ${simbolo}:`, e);
      }
      
      // Esperar entre requests para no exceder rate limit
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    if (Object.keys(resultados).length > 0) {
      console.log('✅ Índices de Alpha Vantage obtenidos:', resultados);
      return resultados;
    }
    
    return null;
  } catch (error) {
    console.log('Error Alpha Vantage:', error);
    return null;
  }
}

// FUNCIÓN PRINCIPAL: Actualizar todos los datos
async function actualizarTodosPreciosAPIs() {
  console.log('🔄 Actualizando precios desde APIs...');
  
  const results = await Promise.allSettled([
    obtenerDolarArgentina(),
    obtenerDatosArgentinaDatos(),
    obtenerBonosONs(),
    obtenerDatosBCRA(),
    obtenerIndicesAlphaVantage()  // ← NUEVO
  ]);
  
  // Extraer valores con fallback a null
  const [dolar, argDatos, bonos, bcra, indices] = results.map(r => 
    r.status === 'fulfilled' ? r.value : null
  );
  
  // Log de estado
  if (dolar) console.log('✅ Dólar: OK');
  else console.log('❌ Dólar: ERROR o timeout');
  
  if (argDatos) console.log('✅ ArgentinaDatos: OK');
  else console.log('❌ ArgentinaDatos: ERROR o timeout');
  
  if (bonos) console.log('✅ Bonos/ONs: OK');
  else console.log('❌ Bonos/ONs: ERROR o timeout');
  
  if (bcra) console.log('✅ BCRA: OK');
  else console.log('❌ BCRA: ERROR o timeout');
  
  if (indices) {
    console.log('✅ Índices (Alpha Vantage): OK');
    // Actualizar MUNDO_MOCK con los datos reales de Alpha Vantage
    Object.assign(MUNDO_MOCK, indices);
  } else {
    console.log('❌ Índices (Alpha Vantage): ERROR o timeout');
  }
  
  console.log('📊 Precios actualizados (con mock como fallback)');
  
  // Redibujar sección Mundo con nuevos precios
  cargarMundo();
}

// ==============================
// CARGAR SECCIÓN MUNDO
// ==============================

function cargarMundo() {
  const container = document.getElementById('mundo-categories');
  if (!container) return;
  
  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando mercados globales...</p></div>';

  try {
    const categoriesConfig = [
      { key: 'indices', titulo: '📈 Índices Principales', emoji: '📊' },
      { key: 'tasas', titulo: '📊 Tasas de Interés', emoji: '🏛️' },
      { key: 'energia', titulo: '⚡ Energía', emoji: '🛢️' },
      { key: 'metales', titulo: '🥇 Metales Preciosos', emoji: '💎' },
      { key: 'agro', titulo: '🌾 Commodities Agrícolas', emoji: '🌱' },
      { key: 'crypto', titulo: '₿ Criptomonedas', emoji: '💰' },
      { key: 'monedas', titulo: '💱 Mercado de Divisas', emoji: '🌍' }
    ];

    container.innerHTML = '';
    let allItems = [];

    for (const category of categoriesConfig) {
      const symbols = MUNDO_SYMBOLS[category.key];
      if (!symbols) continue;

      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'mundo-category';
      
      const title = document.createElement('h3');
      title.textContent = category.titulo;
      categoryDiv.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'mundo-grid';

      symbols.forEach((sym, idx) => {
        const data = MUNDO_MOCK[sym.apiSymbol] || { price: 0, change: 0 };
        const item = { ...sym, price: data.price, change: data.change };
        allItems.push(item);

        const isUp = item.change >= 0;
        const arrow = isUp ? '▲' : '▼';
        const color = isUp ? 'up' : 'down';
        
        // Generar ID único para el canvas del sparkline
        const canvasId = `spark-${category.key}-${idx}`;

        const card = document.createElement('div');
        card.className = 'mundo-card';
        
        // Formattear precio según tipo
        let priceDisplay;
        if (item.isRate) {
          priceDisplay = `${item.price.toFixed(3)}%`;
        } else {
          priceDisplay = formatPrice(item.price);
        }
        
        card.innerHTML = `
          <div class="icon">${item.icon}</div>
          <div class="name">${item.name}</div>
          <div class="price">${priceDisplay}</div>
          <canvas id="${canvasId}" class="spark-chart" width="120" height="30"></canvas>
          <p class="change ${color}">${arrow} ${Math.abs(item.change).toFixed(2)}%</p>
        `;
        card.addEventListener('click', () => mostrarGraficoDetalle(item));
        grid.appendChild(card);
        
        // Dibujar sparkline después de agregarlo al DOM
        setTimeout(() => generarSparkline(canvasId, data), 0);
      });

      categoryDiv.appendChild(grid);
      container.appendChild(categoryDiv);
    }
  } catch (error) {
    console.error("Error cargarMundo:", error);
    container.innerHTML = '<div class="loading"><p>Error al cargar datos</p></div>';
  }
}

function generarSparkline(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Generar datos históricos simulados (14 puntos para sparkline)
  const historicalData = [];
  const basePrice = data.price || 100;
  const volatility = Math.abs(data.change) / 2;
  
  for (let i = 0; i < 14; i++) {
    const variation = (Math.random() - 0.5) * volatility * 2;
    historicalData.push(basePrice * (1 + variation / 100));
  }
  
  // Encontrar min/max para escalar
  const min = Math.min(...historicalData);
  const max = Math.max(...historicalData);
  const range = max - min || 1;
  
  // Dibujar fondo basado en direction
  const isUp = data.change >= 0;
  const lineColor = isUp ? '#10b981' : '#ef4444';
  const bgColor = isUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
  
  // Dibujar área bajo la línea
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.moveTo(0, height);
  
  for (let i = 0; i < historicalData.length; i++) {
    const x = (i / (historicalData.length - 1)) * width;
    const normalized = (historicalData[i] - min) / range;
    const y = height - (normalized * height * 0.8);
    if (i === 0) ctx.lineTo(x, y);
    else ctx.lineTo(x, y);
  }
  
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
  
  // Dibujar línea
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let i = 0; i < historicalData.length; i++) {
    const x = (i / (historicalData.length - 1)) * width;
    const normalized = (historicalData[i] - min) / range;
    const y = height - (normalized * height * 0.8);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  
  ctx.stroke();
}

function mostrarGraficoDetalle(item) {
  alert(`Gráfico detallado de ${item.name}: ${formatPrice(item.price)} (${item.change}%)\n\nPróximamente: gráficos interactivos avanzados`);
}

function formatPrice(value) {
  // Formato con separador de miles y decimales
  if (value >= 1) {
    return value.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  return value.toFixed(4);
}

// ==============================
// ARS (Finanzas Argentinas)
// ==============================

async function cargarARS() {
  // Cargar acciones argentinas
  await cargarAccionesArgentinas();
  // Cargar Plazo Fijo
  await cargarPlazoFijo();
  // Cargar Fondos Comunes de Inversión
  await cargarFondosComunes();
  // Cargar preview de bonos
  await cargarBonosPreview();
}

// ==============================
// ACCIONES ARGENTINAS - MERVAL
// ==============================

const MERVAL_DATA = {
  index: { ticker: 'MERVAL', price: 29450.25, change: 1.34 },
  acciones: [
    { ticker: 'MELI', nombre: 'Mercado Libre', sector: 'E-Commerce', price: 2145.50, change: 3.25 },
    { ticker: 'YPF', nombre: 'YPF S.A.', sector: 'Energía', price: 11450.50, change: 0.85 },
    { ticker: 'GGAL', nombre: 'Grupo Galicia', sector: 'Financiero', price: 8200.00, change: -0.45 },
    { ticker: 'BBVA', nombre: 'BBVA Banco Francés', sector: 'Financiero', price: 6320.25, change: 0.75 },
    { ticker: 'JSJP', nombre: 'Banco Supervielle', sector: 'Financiero', price: 4850.75, change: 1.20 },
    { ticker: 'PAMP', nombre: 'Pampa Energía', sector: 'Energía', price: 5620.00, change: -1.10 },
    { ticker: 'TECO', nombre: 'Telecom Argentina', sector: 'Telecomunicaciones', price: 1890.75, change: 0.30 },
    { ticker: 'CEPU', nombre: 'Cel Fijo Telefónica', sector: 'Telecomunicaciones', price: 2340.50, change: -0.65 },
    { ticker: 'ALUA', nombre: 'Agua y Saneamientos', sector: 'Servicios', price: 3720.00, change: 2.15 },
    { ticker: 'EDN', nombre: 'Empresa Dist. Norte', sector: 'Servicios', price: 1560.25, change: 1.45 },
    { ticker: 'CRES', nombre: 'Cresud S.A.', sector: 'Agropecuario', price: 7890.50, change: 1.85 },
    { ticker: 'DISC', nombre: 'Distribuidora de Gas', sector: 'Utilidades', price: 2890.50, change: -0.92 },
    { ticker: 'BBAR', nombre: 'Banco Barclays', sector: 'Financiero', price: 3450.00, change: 0.55 },
    { ticker: 'AUPA', nombre: 'Grupo Aupa', sector: 'Retail', price: 4120.75, change: 2.30 },
    { ticker: 'MIRG', nombre: 'Mirgor', sector: 'Manufactura', price: 2670.00, change: -1.20 },
    { ticker: 'TXAR', nombre: 'Ternium Argentina', sector: 'Siderurgia', price: 8950.50, change: 1.15 },
    { ticker: 'FERR', nombre: 'Ferrum S.A.', sector: 'Manufactura', price: 1340.25, change: 0.40 },
    { ticker: 'LONG', nombre: 'Longvie', sector: 'Alimentos', price: 890.50, change: -0.35 },
    { ticker: 'POLL', nombre: 'Pollera S.A.', sector: 'Consumo', price: 1250.75, change: 1.75 },
    { ticker: 'GONE', nombre: 'Grupo Inversiones', sector: 'Holding', price: 3890.00, change: 0.90 },
    { ticker: 'NQUI', nombre: 'Nexo Inmobiliario', sector: 'Inmobiliario', price: 2145.25, change: 2.65 },
    { ticker: 'INDU', nombre: 'Industrias', sector: 'Manufactura', price: 1675.50, change: -0.70 },
    { ticker: 'PRIO', nombre: 'Petrorio', sector: 'Energía', price: 4520.00, change: 1.35 },
    { ticker: 'SAMI', nombre: 'Sami Cía General', sector: 'Holding', price: 2310.75, change: 0.65 },
    { ticker: 'VALO', nombre: 'Valor Asesoramiento', sector: 'Servicios Financieros', price: 1820.50, change: 1.05 }
  ]
};

async function cargarAccionesArgentinas() {
  // Actualizar MERVAL
  const mervalPrice = document.getElementById('merval-price');
  const mervalChange = document.getElementById('merval-change');
  
  if (mervalPrice && mervalChange) {
    const isUp = MERVAL_DATA.index.change >= 0;
    const arrow = isUp ? '▲' : '▼';
    const changeClass = isUp ? 'up' : 'down';
    
    mervalPrice.textContent = MERVAL_DATA.index.price.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    mervalChange.textContent = `${arrow} ${Math.abs(MERVAL_DATA.index.change).toFixed(2)}%`;
    mervalChange.className = `change ${changeClass}`;
    
    // Dibujar sparkline del MERVAL
    generarSparkline('merval-sparkline', MERVAL_DATA.index);
  }
  
  // Renderizar acciones
  const container = document.getElementById('acciones-argentina-container');
  if (!container) return;
  
  let html = '';
  
  for (const accion of MERVAL_DATA.acciones) {
    const isUp = accion.change >= 0;
    const arrow = isUp ? '▲' : '▼';
    const changeClass = isUp ? 'up' : 'down';
    
    const priceFormatted = accion.price.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    html += `
      <div class="accion-card">
        <h5>${accion.ticker}</h5>
        <div class="ticker">${accion.sector}</div>
        <div class="price">$ ${priceFormatted}</div>
        <div class="change ${changeClass}">${arrow} ${Math.abs(accion.change).toFixed(2)}%</div>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

async function cargarPlazoFijo() {
  const container = document.getElementById('plazo-fijo-container');
  if (!container) return;

  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando tasa...</p></div>';

  try {
    const response = await fetch('https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo');
    let bancos = await response.json();

    // Filtrar solo Banco de la Nación Argentina
    let bancNacion = bancos.find(b => 
      b.entidad && b.entidad.toUpperCase().includes('NACION ARGENTINA')
    );

    // Si no encuentra, usar dato mock
    if (!bancNacion) {
      bancNacion = {
        entidad: 'BANCO DE LA NACION ARGENTINA',
        tnaClientes: 0.22  // 22% anual
      };
    }

    const tnaClientes = bancNacion.tnaClientes 
      ? (bancNacion.tnaClientes * 100).toFixed(2) 
      : '22.00';

    const html = `
      <div class="plazo-fijo-card">
        <div class="pf-header">
          <h4>${bancNacion.entidad}</h4>
          <span class="badge-pf">30 días</span>
        </div>
        <div class="pf-rate">
          <div class="rate-label">TNA Clientes</div>
          <div class="rate-value">${tnaClientes}%</div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
  } catch (error) {
    console.error("Error cargarPlazoFijo:", error);
    // Mostrar datos mock en caso de error
    const html = `
      <div class="plazo-fijo-card">
        <div class="pf-header">
          <h4>BANCO DE LA NACION ARGENTINA</h4>
          <span class="badge-pf">30 días</span>
        </div>
        <div class="pf-rate">
          <div class="rate-label">TNA Clientes</div>
          <div class="rate-value">22.00%</div>
        </div>
      </div>
    `;
    container.innerHTML = html;
  }
}

// ==============================
// FONDOS COMUNES DE INVERSIÓN
// ==============================

const FONDOS_DATA = [
  { 
    nombre: 'Fondo de Renta Fija Corto Plazo', 
    administrador: 'Banco Galicia',
    banco: 'Grupo Galicia',
    plazo: '30 días',
    tna: 22.50, 
    categoria: 'Renta Fija' 
  },
  { 
    nombre: 'Fondo Mixto Balanceado', 
    administrador: 'Santander Argentina',
    banco: 'Banco Santander',
    plazo: '60 días',
    tna: 20.75, 
    categoria: 'Mixto' 
  },
  { 
    nombre: 'Fondo de Dinero Liquid', 
    administrador: 'App Mercado Pago',
    banco: 'Mercado Pago',
    plazo: 'A Demanda',
    tna: 21.00, 
    categoria: 'Dinero' 
  }
];

async function cargarFondosComunes() {
  const container = document.getElementById('fondos-container');
  if (!container) return;

  try {
    let html = `
      <div class="fondos-grid">
    `;

    for (const fondo of FONDOS_DATA) {
      html += `
        <div class="fondo-card">
          <div class="fondo-header">
            <h5>${fondo.nombre}</h5>
            <span class="categoria-badge">${fondo.categoria}</span>
          </div>
          <div class="fondo-bank">🏦 ${fondo.banco}</div>
          <div class="fondo-admin">Administrador: ${fondo.administrador}</div>
          <div class="fondo-content">
            <div class="fondo-row">
              <span class="label">Plazo:</span>
              <span class="value">${fondo.plazo}</span>
            </div>
            <div class="fondo-row">
              <span class="label">TNA:</span>
              <span class="value tna">${fondo.tna.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;
  } catch (error) {
    console.error("Error cargarFondosComunes:", error);
    container.innerHTML = '<p style="padding:20px;color:#ef4444;">Error al cargar fondos</p>';
  }
}

// ==============================
// BONOS PREVIEW (en sección ARS)
// ==============================

async function cargarBonosPreview() {
  const container = document.getElementById('bonos-preview-container');
  if (!container) return;

  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando bonos...</p></div>';

  try {
    // Obtener datos reales de data912
    let bonosData = await fetchData912('arg_bonds');

    // Si no hay datos de data912, usar mock
    let bonosMock = [
      { symbol: 'AL29', name: 'Bono Argentino 2029', c: 0.78, tir: 15.2 },
      { symbol: 'AL30', name: 'Bono Argentino 2030', c: 0.75, tir: 14.8 },
      { symbol: 'AL35', name: 'Bono Argentino 2035', c: 0.70, tir: 13.5 },
      { symbol: 'GD29', name: 'Bono Global 2029', c: 0.83, tir: 12.5 },
      { symbol: 'GD30', name: 'Bono Global 2030', c: 0.81, tir: 12.1 }
    ];

    if (!bonosData || !Array.isArray(bonosData)) {
      bonosData = bonosMock;
    } else {
      // Filtrar solo los bonos soberanos
      bonosData = bonosData.filter(b => 
        b.symbol && ['AL29', 'AL30', 'AL35', 'GD29', 'GD30'].includes(b.symbol)
      );
    }

    // Mapear y tomar precios correctos en ARS (campo c de data912 viene en pesos)
    const bonos = bonosData.map(b => {
      const precioARS = parseFloat(b.c || b.px_bid || b.px_ask || 0) || 0;
      const nombre = b.name || `Bono ${b.symbol}`;
      const tir = parseFloat(b.tir || b.t) || 0;
      
      return {
        ticker: b.symbol,
        nombre: nombre,
        precioARS: precioARS,
        tir: tir
      };
    });

    let html = `
      <table class="bonos-table">
        <thead>
          <tr>
            <th>TICKER</th>
            <th>BONO</th>
            <th>PRECIO ARS</th>
            <th>TIR (%)</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (const bono of bonos) {
      const precioARSFormato = bono.precioARS.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      html += `
        <tr>
          <td><strong>${bono.ticker}</strong></td>
          <td>${bono.nombre}</td>
          <td>$${precioARSFormato}</td>
          <td>${bono.tir.toFixed(2)}%</td>
        </tr>
      `;
    }

    html += `
        </tbody>
      </table>
    `;

    container.innerHTML = html;
    console.log('✅ Bonos cargados desde API');
  } catch (error) {
    console.error("Error cargarBonosPreview:", error);
    container.innerHTML = '<p style="padding:20px;color:#ef4444;">Error al cargar bonos</p>';
  }
}

// ==============================
// API REAL: data912
// ==============================

async function fetchData912(endpoint) {
  try {
    const response = await fetch(`https://data912.com/live/${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Error data912 ${endpoint}:`, error.message);
    return null;
  }
}

// ==============================
// BONOS
// ==============================

let soberanosChart = null;
let lecapsChart = null;

async function cargarBonos() {
  // Cargar todos los bonos en paralelo
  const [soberanos, lecaps, cer] = await Promise.allSettled([
    cargarSoberanos(),
    cargarLecaps(),
    cargarCER()
  ]);
  
  console.log('Bonos cargados');
}

async function cargarSoberanos() {
  const container = document.getElementById('soberanos-container');
  if (!container) return;

  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando bonos soberanos...</p></div>';

  try {
    // Usando datos mock - en producción usar data912
    const soberanos = [
      { ticker: 'AL29', nombre: 'Bono Argentino 2029', price: 78.5, tir: 15.2, duration: 4.5 },
      { ticker: 'AL30', nombre: 'Bono Argentino 2030', price: 76.2, tir: 14.8, duration: 5.2 },
      { ticker: 'AL35', nombre: 'Bono Argentino 2035', price: 71.5, tir: 13.5, duration: 7.1 },
      { ticker: 'GD29', nombre: 'Bono Global 2029', price: 82.3, tir: 12.5, duration: 4.8 },
      { ticker: 'GD30', nombre: 'Bono Global 2030', price: 80.1, tir: 12.1, duration: 5.5 }
    ];

    const html = `
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>TIR (%)</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${soberanos.map(b => `
            <tr>
              <td><strong>${b.ticker}</strong></td>
              <td>${b.nombre}</td>
              <td>$${b.price.toFixed(2)}</td>
              <td>${b.tir.toFixed(2)}%</td>
              <td>${b.duration.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.innerHTML = html;

    // Dibujar Yield Curve
    dibujarYieldCurve(soberanos);
  } catch (error) {
    console.error("Error cargarSoberanos:", error);
    container.innerHTML = '<p style="padding:20px;color:#ef4444;">Error al cargar soberanos</p>';
  }
}

function dibujarYieldCurve(bonos) {
  const canvas = document.getElementById('soberanos-chart');
  if (!canvas) return;

  if (soberanosChart) {
    soberanosChart.destroy();
  }

  const labels = bonos.map(b => b.ticker);
  const tirs = bonos.map(b => b.tir);
  const durations = bonos.map(b => b.duration);

  soberanosChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'TIR (%)',
          data: tirs,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#10b981'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#cbd5e1' }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: 'rgba(52, 65, 111, 0.2)' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      }
    }
  });
}

async function cargarLecaps() {
  const container = document.getElementById('lecaps-container');
  if (!container) return;

  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando LECAPs...</p></div>';

  try {
    // Intentar cargar desde data912
    let lecaps = await fetchData912('arg_notes');
    
    if (!lecaps || !Array.isArray(lecaps)) {
      // Usar datos mock si no hay datos reales
      lecaps = [
        { symbol: 'S24A6', c: 99.2, v: 10000, o: 98.5, l: 99.0, h: 99.5 },
        { symbol: 'S30A6', c: 97.8, v: 15000, o: 97.5, l: 97.5, h: 98.0 },
        { symbol: 'S15Y6', c: 98.5, v: 12000, o: 98.0, l: 98.2, h: 98.7 }
      ];
    }

    // Filtrar solo LECAPs relevantes (puedes ajustar los ticker según necesites)
    const lecapsRelevantes = lecaps.slice(0, 10);

    const html = `
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Precio (c)</th>
            <th>Volumen</th>
            <th>Apertura</th>
            <th>Máximo</th>
            <th>Mínimo</th>
          </tr>
        </thead>
        <tbody>
          ${lecapsRelevantes.map(l => `
            <tr>
              <td><strong>${l.symbol}</strong></td>
              <td>$${parseFloat(l.c || 0).toFixed(2)}</td>
              <td>${(l.v || 0).toLocaleString()}</td>
              <td>$${parseFloat(l.o || 0).toFixed(2)}</td>
              <td>$${parseFloat(l.h || 0).toFixed(2)}</td>
              <td>$${parseFloat(l.l || 0).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.innerHTML = html;
  } catch (error) {
    console.error("Error cargarLecaps:", error);
    container.innerHTML = '<p style="padding:20px;color:#ef4444;">Error al cargar LECAPs</p>';
  }
}

async function cargarCER() {
  const container = document.getElementById('cer-container');
  if (!container) return;

  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando bonos CER...</p></div>';

  try {
    const cer_bonos = [
      { ticker: 'TZX26', nombre: 'Bono CER 2026', price: 98.5, valor_cer: 1.285, tir: 7.2 },
      { ticker: 'TZX27', nombre: 'Bono CER 2027', price: 96.2, valor_cer: 1.285, tir: 6.8 },
      { ticker: 'TZX28', nombre: 'Bono CER 2028', price: 94.0, valor_cer: 1.285, tir: 6.5 }
    ];

    const html = `
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Valor CER</th>
            <th>TIR (%)</th>
          </tr>
        </thead>
        <tbody>
          ${cer_bonos.map(c => `
            <tr>
              <td><strong>${c.ticker}</strong></td>
              <td>${c.nombre}</td>
              <td>$${c.price.toFixed(2)}</td>
              <td>$${c.valor_cer.toFixed(4)}</td>
              <td>${c.tir.toFixed(2)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.innerHTML = html;
  } catch (error) {
    console.error("Error cargarCER:", error);
    container.innerHTML = '<p style="padding:20px;color:#ef4444;">Error al cargar bonos CER</p>';
  }
}

// ==============================
// NEWS TICKER
// ==============================

async function cargarNewsTicker() {
  try {
    // Noticias de ejemplo (en producción usar API de Google News o similar)
    const noticias = [
      "📰 Dólar blue subirá según analistas",
      "📊 S&P 500 cierra con ganancias del 0.38%",
      "💰 Plazo Fijo: tasas siguen en suba",
      "📈 Bitcoin recupera nivel de USD 68.000",
      "🏛️ BCRA anuncia nueva medida de política monetaria"
    ];

    const ticker = document.getElementById('news-ticker');
    const content = document.getElementById('ticker-content');
    
    if (ticker && content) {
      // Crear string de noticias repetidas para efecto scroll infinito
      const newsString = noticias.concat(noticias).join(' | ');
      content.textContent = newsString;
      ticker.style.display = 'flex';
    }
  } catch (error) {
    console.warn("Error cargarNewsTicker:", error);
  }
}

// ==============================
// INICIALIZAR APLICACIÓN
// ==============================

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}