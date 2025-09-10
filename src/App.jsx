// App.jsx
import React, { useState, useEffect, useMemo } from "react";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  increment,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";

/* ======================= estilos responsivos ======================= */
function getStyles(compact = false) {
  const px = (n) => `${n}px`;
  const baseFont = compact ? 14 : 16;
  const pad = compact ? 16 : 24;
  const gap = compact ? 16 : 24;
  const cellPad = compact ? 8 : 12;
  const h1Size = compact ? "2rem" : "2.5rem";
  const cardRadius = compact ? 10 : 12;
  const minCol = compact ? 300 : 380;
  const filterMin = compact ? 140 : 160;

  return {
    container: {
      backgroundColor: "#1a202c",
      color: "white",
      padding: px(pad),
      fontFamily: "sans-serif",
      minHeight: "100vh",
      fontSize: px(baseFont),
    },
    header: { textAlign: "center", marginBottom: px(gap) },
    h1: {
      fontSize: h1Size,
      fontWeight: "bold",
      color: "#63b3ed",
      margin: "0 0 8px 0",
    },
    p: { color: "#a0aec0" },
    topLayout: {
      display: "grid",
      gridTemplateColumns: `repeat(auto-fit, minmax(${minCol}px, 1fr))`,
      gap: px(gap),
      maxWidth: "1800px",
      margin: "0 auto",
      marginBottom: px(gap),
    },
    mainLayout: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: px(gap),
      maxWidth: "1800px",
      margin: "0 auto",
    },
    card: {
      backgroundColor: "#2d3748",
      padding: px(pad),
      borderRadius: px(cardRadius),
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
    },
    cardTitle: {
      fontSize: compact ? "1.25rem" : "1.5rem",
      fontWeight: "bold",
      color: "#63b3ed",
      marginBottom: "12px",
      borderBottom: "2px solid #4a5568",
      paddingBottom: "8px",
    },
    subTitle: {
      fontSize: compact ? "1rem" : "1.1rem",
      fontWeight: 600,
      color: "#a0aec0",
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    label: {
      display: "block",
      fontSize: compact ? "0.8rem" : "0.875rem",
      color: "#cbd5e0",
      marginBottom: "4px",
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: compact ? "8px" : "10px",
      backgroundColor: "#4a5568",
      border: "1px solid #718096",
      borderRadius: "8px",
      color: "white",
      fontSize: compact ? "0.95rem" : "1rem",
      marginBottom: "12px",
    },
    textarea: {
      width: "100%",
      boxSizing: "border-box",
      padding: compact ? "8px" : "10px",
      backgroundColor: "#4a5568",
      border: "1px solid #718096",
      borderRadius: "8px",
      color: "white",
      fontSize: compact ? "0.95rem" : "1rem",
      marginBottom: "12px",
      minHeight: "80px",
    },
    select: {
      width: "100%",
      padding: compact ? "8px" : "10px",
      backgroundColor: "#4a5568",
      border: "1px solid #718096",
      borderRadius: "8px",
      color: "white",
      fontSize: compact ? "0.95rem" : "1rem",
      marginBottom: "12px",
    },
    checkboxRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "12px",
    },
    button: {
      width: "100%",
      padding: compact ? "10px" : "12px",
      backgroundColor: "#3182ce",
      border: "none",
      borderRadius: "8px",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: compact ? "0.95rem" : "1rem",
      marginTop: "8px",
    },
    tableWrap: {
      maxHeight: compact ? "520px" : "600px",
      overflowY: "auto",
      overflowX: "auto",
    },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "8px" },
    th: {
      backgroundColor: "#4a5568",
      color: "white",
      padding: `${cellPad}px ${compact ? 6 : 8}px`,
      textAlign: "left",
      position: "sticky",
      top: 0,
      whiteSpace: "nowrap",
      fontSize: compact ? "0.9rem" : "1rem",
    },
    td: {
      padding: `${cellPad}px ${compact ? 6 : 8}px`,
      textAlign: "left",
      borderBottom: "1px solid #4a5568",
      fontSize: compact ? "0.9rem" : "0.95rem",
      verticalAlign: "top",
    },
    tdTruncate: {
      padding: `${cellPad}px ${compact ? 6 : 8}px`,
      textAlign: "left",
      borderBottom: "1px solid #4a5568",
      fontSize: compact ? "0.9rem" : "0.95rem",
      maxWidth: compact ? "200px" : "280px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    chip: {
      display: "inline-block",
      padding: "2px 6px",
      borderRadius: "9999px",
      background: "#2b6cb0",
      border: "1px solid #2c5282",
      fontSize: "0.7rem",
      marginRight: "4px",
    },
    badgeInvertido: {
      display: "inline-block",
      marginLeft: "6px",
      fontSize: "0.7rem",
      padding: "2px 6px",
      borderRadius: "9999px",
      background: "#744210",
      border: "1px solid #975a16",
    },
    /* KPIs + badge Movimiento */
    kpiBar: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px",
      marginBottom: 12,
    },
    kpiCard: {
      background: "#1f2937",
      border: "1px solid #374151",
      borderRadius: "10px",
      padding: "10px",
    },
    badgeMovimiento: {
      display: "inline-block",
      marginLeft: 8,
      padding: "2px 6px",
      fontSize: "0.75rem",
      borderRadius: 8,
      border: "1px solid #4b5563",
      background: "#111827",
      color: "#e5e7eb",
    },

    profit: { color: "#68d391", fontWeight: "bold" },
    loss: { color: "#fc8181", fontWeight: "bold" },
    balanceContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "12px",
    },
    balanceBox: {
      backgroundColor: "#4a5568",
      padding: compact ? "12px" : "16px",
      borderRadius: "8px",
      textAlign: "center",
    },
    balanceLabel: {
      display: "block",
      fontSize: "0.8rem",
      color: "#a0aec0",
      textTransform: "uppercase",
    },
    balanceAmount: {
      fontSize: compact ? "1.25rem" : "1.5rem",
      fontWeight: "bold",
      color: "white",
    },
    inlineButtonGroup: { display: "flex", gap: "8px", alignItems: "center" },
    addButton: {
      padding: compact ? "8px" : "10px",
      height: compact ? "40px" : "44px",
      backgroundColor: "#3182ce",
      border: "none",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer",
    },
    actionBtns: {
      display: "flex",
      gap: "6px",
      justifyContent: "center",
      marginTop: 8,
    },
    actionBtn: {
      padding: compact ? "4px 8px" : "6px 10px",
      fontSize: compact ? "0.8rem" : "0.85rem",
      borderRadius: "6px",
      border: "1px solid #718096",
      background: "#4a5568",
      color: "white",
      cursor: "pointer",
    },
    actionDanger: { background: "#9b2c2c", border: "1px solid #c53030" },
    filterBar: {
      display: "grid",
      gridTemplateColumns: `repeat(auto-fit, minmax(${filterMin}px, 1fr))`,
      gap: "10px",
      marginBottom: "10px",
    },
    filterHeaderRow: {
      display: "grid",
      gridTemplateColumns: `1fr repeat(2, minmax(120px, 180px)) minmax(120px, 180px)`,
      gap: "10px",
      marginBottom: "10px",
      alignItems: "center",
    },
    smallBtn: {
      padding: compact ? "6px 8px" : "8px 10px",
      backgroundColor: "#2b6cb0",
      border: "1px solid #2c5282",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer",
      fontSize: compact ? "0.85rem" : "0.95rem",
    },
    compactToggle: {
      padding: compact ? "6px 8px" : "8px 10px",
      background: "#4a5568",
      border: "1px solid #718096",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer",
      justifySelf: "end",
    },
  };
}

/* Hook simple para saber el ancho de ventana */
function useWindowWidth() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const onR = () => setW(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return w;
}

/* ======================= utilidades num/fecha ======================= */
const toCents = (x) => {
  const n = Number(String(x).replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};
const parseNum = (x) => {
  const n = Number(String(x ?? 0).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const centsToEUR = (c) => (Number(c || 0) / 100).toFixed(2);

const toTimestampFromDateInput = (yyyyMmDd) => {
  if (!yyyyMmDd) return Timestamp.fromDate(new Date());
  const [y, m, d] = yyyyMmDd.split("-").map((v) => parseInt(v, 10));
  const localNoon = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
  return Timestamp.fromDate(localNoon);
};
const fmtFecha = (f) => {
  if (f && typeof f === "object" && typeof f.toDate === "function") {
    const d = f.toDate();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  return f || "";
};

/* ======================= Movimiento (Opción B) ======================= */
const isBanco = (name) =>
  !!name && String(name).trim().toLowerCase() === "banco";

/** Deriva el movimiento para docs antiguos (sin tipoMovimiento) */
const computeMovimientoDerivado = (bet) => {
  const estado = (bet?.estado || "").toUpperCase();
  const cartera = bet?.cartera || "";
  const aplicado = bet?.aplicado !== false; // true por defecto

  if (estado === "G" || estado === "P") return "APUESTA";
  if (estado === "I") {
    if (isBanco(cartera) && aplicado) return "GASTO"; // cursos/comisiones
    if (!isBanco(cartera) && !aplicado) return "RECARGA"; // espejo positivo actual
    return "AJUSTE";
  }
  return "OTRO";
};

/** Movimiento “oficial”: usa tipoMovimiento si existe; si no, deriva */
const movimientoOf = (bet) =>
  bet?.tipoMovimiento || computeMovimientoDerivado(bet);

/* ======================= App ======================= */
export default function App() {
  const width = useWindowWidth();
  const forceCompact = width < 900;
  const [userCompact, setUserCompact] = useState(width < 1200);
  const isCompact = forceCompact || userCompact;
  const styles = useMemo(() => getStyles(isCompact), [isCompact]);

  const [showFilters, setShowFilters] = useState(width >= 900);
  useEffect(() => setShowFilters(width >= 900), [width]);

  const isTablet = width < 1200;
  const isMobile = width < 800;
  const showCol = {
    canal: !isMobile,
    cuotaOf: !isMobile,
    cuotasInd: !isMobile,
    cuotas: false,
    valores: !isTablet,
    observ: !isTablet,
    inversor: !isMobile,
    deporte: !isMobile,
    ganado: !isMobile,
  };

  const defaultNewBet = () => ({
    fecha: new Date().toISOString().slice(0, 10),
    canal: "",
    tipoInversion: "",
    inversion: "",
    cuotaOfrecida: "",
    cuotaAplicada: "",
    cuotasIndependientes: false,
    cuotasValores: "",
    cartera: "",
    inversor: "",
    estado: "G",
    totalGanadoPerdido: "",
    totalBeneficioPerdida: "",
    observacion: "",
    deporte: "",
    valores: "",
  });

  const [newBet, setNewBet] = useState(defaultNewBet());
  const [editingId, setEditingId] = useState(null);
  const [editingOriginal, setEditingOriginal] = useState(null);

  const [betHistory, setBetHistory] = useState([]);
  const [saldosCarteras, setSaldosCarteras] = useState({});
  const [saldosInversores, setSaldosInversores] = useState({});

  const [planningSituation, setPlanningSituation] = useState({
    capitalInicial: 30,
    beneficioActual: 100,
  });
  const [planningStrategy, setPlanningStrategy] = useState({
    investmentMode: "amount",
    investmentValue: 45,
  });
  const [planningBet, setPlanningBet] = useState({ courseCost: 15, odds: 3 });

  const [filters, setFilters] = useState({
    q: "",
    canal: "",
    tipo: "",
    cartera: "",
    inversor: "",
    estado: "",
    fechaDesde: "",
    fechaHasta: "",
    invMin: "",
    invMax: "",
    benMin: "",
    benMax: "",
    deporte: "",
    valoresText: "",
    cuotaOfMin: "",
    cuotaOfMax: "",
    cuotasInd: "",
    aplicado: "",
    movimiento: "",
  });
  const [sort, setSort] = useState({ field: "fecha", dir: "desc" });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubBets = () => {};
    let unsubCarteras = () => {};
    let unsubInversores = () => {};

    (async () => {
      try {
        const ensureCollection = async (collectionName, defaults) => {
          for (const [k, v] of Object.entries(defaults)) {
            const ref = doc(db, collectionName, k);
            const snap = await getDoc(ref);
            if (!snap.exists()) {
              await setDoc(ref, { balanceCents: v * 100, balance: v });
            }
          }
        };
        await ensureCollection("saldosCarteras", { Bet365: 100, Banco: 500 });
        await ensureCollection("saldosInversores", { Alex: 300, Naira: 300 });

        unsubBets = onSnapshot(
          query(collection(db, "bets"), orderBy("fecha", "desc")),
          (snapshot) =>
            setBetHistory(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        );

        const listenBalances = (col, setter) =>
          onSnapshot(collection(db, col), (snap) => {
            const obj = {};
            snap.forEach((d) => {
              const data = d.data() || {};
              const cents =
                typeof data.balanceCents === "number"
                  ? data.balanceCents
                  : Math.round(Number(data.balance || 0) * 100);
              obj[d.id] = cents;
            });
            setter(obj);
          });

        unsubCarteras = listenBalances("saldosCarteras", setSaldosCarteras);
        unsubInversores = listenBalances(
          "saldosInversores",
          setSaldosInversores
        );

        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("No se pudo inicializar la app.");
      }
    })();

    return () => {
      unsubBets();
      unsubCarteras();
      unsubInversores();
    };
  }, []);

  const handleInputChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleAddNewItem = async (type) => {
    const value = prompt(`Nuevo ${type}:`);
    if (!value) return;
    const col = type === "cartera" ? "saldosCarteras" : "saldosInversores";
    await setDoc(
      doc(db, col, value),
      { balanceCents: 0, balance: 0 },
      { merge: true }
    );
    setNewBet((prev) => ({ ...prev, [type]: value }));
  };

  /* KPIs */
  const kpis = useMemo(() => {
    const entries = Object.entries(saldosCarteras || {});
    const bancoEntry = entries.find(([k]) => isBanco(k));
    const bancoCents = bancoEntry ? bancoEntry[1] : 0;

    const totalCasasCents = entries
      .filter(([k]) => !isBanco(k))
      .reduce((acc, [, v]) => acc + (v || 0), 0);

    return {
      bancoCents,
      gastoBancoAbsEUR: Math.abs(bancoCents) / 100,
      totalCasasEUR: totalCasasCents / 100,
      netoGlobalEUR: (bancoCents + totalCasasCents) / 100,
    };
  }, [saldosCarteras]);

  const {
    totalMaxToInvest,
    investmentCostForBet,
    possibleGain,
    possibleBenefit,
  } = useMemo(() => {
    const beneficio = Math.max(0, parseNum(planningSituation.beneficioActual));
    const rawVal = parseNum(planningStrategy.investmentValue);
    const percent = clamp(rawVal, 0, 100);

    const maxInvest =
      planningStrategy.investmentMode === "percent"
        ? (percent / 100) * beneficio
        : rawVal;

    const course = parseNum(planningBet.courseCost);
    const odds = parseNum(planningBet.odds);

    const investCost = Math.max(0, (maxInvest || 0) - (course || 0));
    const gain = investCost * odds;
    const net = gain - (investCost + course);

    return {
      totalMaxToInvest: isNaN(maxInvest) ? 0 : maxInvest,
      investmentCostForBet: isNaN(investCost) ? 0 : investCost,
      possibleGain: isNaN(gain) ? 0 : gain,
      possibleBenefit: isNaN(net) ? 0 : net,
    };
  }, [planningSituation, planningStrategy, planningBet]);

  const requiredOk = useMemo(() => {
    const req = [
      "fecha",
      "canal",
      "tipoInversion",
      "inversion",
      "cartera",
      "inversor",
      "estado",
    ];
    return req.every((f) => {
      const v = newBet[f];
      return !(v === undefined || v === null || String(v).trim() === "");
    });
  }, [newBet]);

  const benefitCentsFromBet = (bet) =>
    typeof bet?.totalBeneficioPerdidaCents === "number"
      ? bet.totalBeneficioPerdidaCents
      : Math.round(Number(bet?.totalBeneficioPerdida || 0) * 100);

  const startEdit = (bet) => {
    setEditingOriginal(bet);
    setEditingId(bet.id);
    setNewBet({
      fecha: fmtFecha(bet.fecha),
      canal: bet.canal || "",
      tipoInversion: bet.tipoInversion || "",
      inversion:
        (typeof bet.inversionCents === "number"
          ? bet.inversionCents
          : Math.round((bet.inversion || 0) * 100)) / 100,
      cuotaOfrecida: bet.cuotaOfrecida ?? "",
      cuotaAplicada: bet.cuotaAplicada ?? "",
      cuotasIndependientes: !!bet.cuotasIndependientes,
      cuotasValores:
        bet.cuotasValores ??
        (Array.isArray(bet.cuotasValoresNums)
          ? bet.cuotasValoresNums.join(", ")
          : ""),
      cartera: bet.cartera || "",
      inversor: bet.inversor || "",
      estado: bet.estado || "G",
      totalGanadoPerdido:
        (typeof bet.totalGanadoPerdidoCents === "number"
          ? bet.totalGanadoPerdidoCents
          : Math.round((bet.totalGanadoPerdido || 0) * 100)) / 100,
      totalBeneficioPerdida: benefitCentsFromBet(bet) / 100,
      observacion: bet.observacion ?? "",
      deporte: bet.deporte ?? "",
      valores: bet.valores ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingOriginal(null);
    setNewBet(defaultNewBet());
  };

  /* ======================= Helpers de prompts seguros ======================= */
  const promptTextRequired = (label, defVal = "") => {
    const v = window.prompt(label, defVal);
    if (v === null) return null; // cancelar
    const t = String(v).trim();
    return t.length ? t : null;
  };
  const promptAmountRequiredCents = (label, defVal = "") => {
    const v = window.prompt(label, defVal);
    if (v === null) return null; // cancelar
    const cents = toCents(v);
    if (cents <= 0) return null;
    return cents;
  };
  const promptPickRequired = (title, options) => {
    if (!options?.length) return null;
    const menu = options.map((n, i) => `${i + 1}) ${n}`).join("\n");
    const raw = window.prompt(`${title}\n${menu}`, "1");
    if (raw === null) return null;
    const idx = parseInt(raw, 10);
    if (!idx || idx < 1 || idx > options.length) return null;
    return options[idx - 1];
  };

  /* ======================= ACCIONES RÁPIDAS ======================= */

  const quickGastoAction = async (bancoName) => {
    const inversores = Object.keys(saldosInversores);
    if (inversores.length === 0) {
      alert("Primero crea al menos un inversor.");
      return;
    }

    const cents = promptAmountRequiredCents("Importe del gasto (€):", "20");
    if (cents === null) return;

    const tipo = promptTextRequired(
      'Tipo (campo "Tipo"):',
      "Gasto (curso/comisión)"
    );
    if (tipo === null) return;

    const inversor =
      inversores.length === 1
        ? inversores[0]
        : promptPickRequired("Selecciona inversor:", inversores);
    if (inversor === null) return;

    const canal = promptTextRequired("Canal (texto libre):", "Gasto");
    if (canal === null) return;

    const ok = window.confirm(
      `Confirmar GASTO\n\n` +
        `Cartera: ${bancoName}\nInversor: ${inversor}\n` +
        `Tipo: ${tipo}\nCanal: ${canal}\nImporte: ${(cents / 100).toFixed(2)} €`
    );
    if (!ok) return;

    const ahora = Timestamp.fromDate(new Date());
    const payload = {
      fecha: ahora,
      canal,
      tipoInversion: tipo,
      cartera: bancoName,
      inversor,
      estado: "I",
      inversionCents: cents,
      inversion: cents / 100,
      totalGanadoPerdidoCents: 0,
      totalGanadoPerdido: 0,
      totalBeneficioPerdidaCents: -cents,
      totalBeneficioPerdida: -cents / 100,
      aplicado: true,
      tipoMovimiento: "GASTO",
      createdAt: serverTimestamp(),
    };

    try {
      const batch = writeBatch(db);
      const ref = doc(collection(db, "bets"));
      batch.set(ref, payload);

      batch.set(
        doc(db, "saldosCarteras", bancoName),
        { balanceCents: increment(-cents), balance: increment(-cents / 100) },
        { merge: true }
      );
      batch.set(
        doc(db, "saldosInversores", inversor),
        { balanceCents: increment(-cents), balance: increment(-cents / 100) },
        { merge: true }
      );

      await batch.commit();
      alert("Gasto registrado.");
    } catch (e) {
      console.error(e);
      alert("No se pudo registrar el gasto.");
    }
  };

  const quickRecargaAction = async (bancoName) => {
    const casas = Object.keys(saldosCarteras).filter((c) => !isBanco(c));
    if (casas.length === 0) return alert("No hay casas configuradas.");

    const inversores = Object.keys(saldosInversores);
    if (inversores.length === 0)
      return alert("Primero crea al menos un inversor.");

    const cents = promptAmountRequiredCents("Importe a recargar (€):", "15");
    if (cents === null) return;

    const casa =
      casas.length === 1
        ? casas[0]
        : promptPickRequired("Selecciona casa:", casas);
    if (casa === null) return;

    const inversor =
      inversores.length === 1
        ? inversores[0]
        : promptPickRequired("Selecciona inversor:", inversores);
    if (inversor === null) return;

    const tipoBanco = promptTextRequired(
      'Tipo (BANCO → campo "Tipo")',
      "Recarga saldo para apuesta"
    );
    if (tipoBanco === null) return;

    const tipoCasa = promptTextRequired(
      'Tipo (CASA → campo "Tipo")',
      "Saldo positivo ingresado"
    );
    if (tipoCasa === null) return;

    const canal = promptTextRequired("Canal (texto libre):", "Recarga");
    if (canal === null) return;

    const ok = window.confirm(
      `Confirmar RECARGA\n\n` +
        `De: ${bancoName}  →  A: ${casa}\nInversor: ${inversor}\n` +
        `Tipo BANCO: ${tipoBanco}\nTipo CASA: ${tipoCasa}\nCanal: ${canal}\n` +
        `Importe: ${(cents / 100).toFixed(2)} €`
    );
    if (!ok) return;

    const ahora = Timestamp.fromDate(new Date());

    const bancoBet = {
      fecha: ahora,
      canal,
      tipoInversion: tipoBanco,
      cartera: bancoName,
      inversor,
      estado: "I",
      inversionCents: cents,
      inversion: cents / 100,
      totalGanadoPerdidoCents: 0,
      totalGanadoPerdido: 0,
      totalBeneficioPerdidaCents: -cents,
      totalBeneficioPerdida: -cents / 100,
      aplicado: true,
      tipoMovimiento: "GASTO",
      observacion: `Recarga a ${casa}`,
      createdAt: serverTimestamp(),
    };

    const casaBet = {
      fecha: ahora,
      canal,
      tipoInversion: tipoCasa,
      cartera: casa,
      inversor,
      estado: "I",
      inversionCents: cents,
      inversion: cents / 100,
      totalGanadoPerdidoCents: 0,
      totalGanadoPerdido: 0,
      totalBeneficioPerdidaCents: -cents,
      totalBeneficioPerdida: -cents / 100,
      aplicado: false,
      tipoMovimiento: "RECARGA",
      observacion: `Desde ${bancoName}`,
      createdAt: serverTimestamp(),
    };

    try {
      const batch = writeBatch(db);

      const ref1 = doc(collection(db, "bets"));
      const ref2 = doc(collection(db, "bets"));
      batch.set(ref1, bancoBet);
      batch.set(ref2, casaBet);

      batch.set(
        doc(db, "saldosCarteras", bancoName),
        { balanceCents: increment(-cents), balance: increment(-cents / 100) },
        { merge: true }
      );
      batch.set(
        doc(db, "saldosCarteras", casa),
        { balanceCents: increment(+cents), balance: increment(+cents / 100) },
        { merge: true }
      );

      batch.set(
        doc(db, "saldosInversores", inversor),
        { balanceCents: increment(-cents), balance: increment(-cents / 100) },
        { merge: true }
      );
      batch.set(
        doc(db, "saldosInversores", inversor),
        { balanceCents: increment(+cents), balance: increment(+cents / 100) },
        { merge: true }
      );

      await batch.commit();
      alert(
        `Recarga realizada: ${(cents / 100).toFixed(
          2
        )} € de ${bancoName} a ${casa}.`
      );
    } catch (e) {
      console.error(e);
      alert("No se pudo registrar la recarga.");
    }
  };

  /* ======================= Submit/CRUD normal ======================= */

  const handleSubmitBet = async (e) => {
    e.preventDefault();
    if (!requiredOk) return alert("Completa los campos obligatorios.");

    const invCents = toCents(newBet.inversion);
    const cuotaApl = parseNum(newBet.cuotaAplicada) || null;

    let ganadoCents =
      newBet.totalGanadoPerdido !== ""
        ? toCents(newBet.totalGanadoPerdido)
        : newBet.estado === "G" && cuotaApl
        ? Math.round((invCents / 100) * cuotaApl * 100)
        : 0;

    let beneficioBaseCents =
      newBet.totalBeneficioPerdida !== ""
        ? toCents(newBet.totalBeneficioPerdida)
        : newBet.estado === "G" && cuotaApl
        ? ganadoCents - invCents
        : newBet.estado === "P" || newBet.estado === "I"
        ? -invCents
        : 0;

    let cuotasValoresNums;
    if (newBet.cuotasValores && newBet.cuotasValores.trim()) {
      cuotasValoresNums = newBet.cuotasValores
        .split(",")
        .map((s) => parseNum(s))
        .filter((n) => Number.isFinite(n));
    }

    const tipoMovimiento = movimientoOf({
      estado: newBet.estado,
      cartera: newBet.cartera,
      aplicado: true,
    });

    const payload = {
      fecha: toTimestampFromDateInput(newBet.fecha),
      canal: newBet.canal,
      tipoInversion: newBet.tipoInversion,
      cartera: newBet.cartera,
      inversor: newBet.inversor,
      estado: newBet.estado,
      inversionCents: invCents,
      totalGanadoPerdidoCents: ganadoCents,
      totalBeneficioPerdidaCents: beneficioBaseCents,
      inversion: invCents / 100,
      totalGanadoPerdido: ganadoCents / 100,
      totalBeneficioPerdida: beneficioBaseCents / 100,
      aplicado: true,
      tipoMovimiento,
      ...(newBet.cuotasIndependientes !== undefined && {
        cuotasIndependientes: !!newBet.cuotasIndependientes,
      }),
      ...(newBet.cuotasValores && { cuotasValores: newBet.cuotasValores }),
      ...(cuotasValoresNums &&
        cuotasValoresNums.length > 0 && { cuotasValoresNums }),
      ...(newBet.cuotaOfrecida && {
        cuotaOfrecida: parseNum(newBet.cuotaOfrecida),
      }),
      ...(newBet.cuotaAplicada && {
        cuotaAplicada: parseNum(newBet.cuotaAplicada),
      }),
      ...(newBet.observacion && {
        observacion: String(newBet.observacion).trim(),
      }),
      ...(newBet.deporte && { deporte: String(newBet.deporte).trim() }),
      ...(newBet.valores && { valores: String(newBet.valores).trim() }),
      ...(editingId
        ? { updatedAt: serverTimestamp() }
        : { createdAt: serverTimestamp() }),
    };

    try {
      const batch = writeBatch(db);

      if (!editingId) {
        const betRef = doc(collection(db, "bets"));
        batch.set(betRef, payload);
        const impacto = beneficioBaseCents;
        const carteraId = newBet.cartera && String(newBet.cartera);
        const inversorId = newBet.inversor && String(newBet.inversor);
        if (carteraId) {
          batch.set(
            doc(db, "saldosCarteras", carteraId),
            {
              balanceCents: increment(impacto),
              balance: increment(impacto / 100),
            },
            { merge: true }
          );
        }
        if (inversorId) {
          batch.set(
            doc(db, "saldosInversores", inversorId),
            {
              balanceCents: increment(impacto),
              balance: increment(impacto / 100),
            },
            { merge: true }
          );
        }
      } else {
        const betRef = doc(db, "bets", editingId);
        batch.set(betRef, payload, { merge: true });

        const old = editingOriginal || {};
        const oldBenefBase = benefitCentsFromBet(old);
        const oldApplied = old.aplicado !== false;
        const sign = oldApplied ? 1 : -1;
        const oldEfectivo = sign * oldBenefBase;
        const newEfectivo = sign * beneficioBaseCents;
        const delta = newEfectivo - oldEfectivo;

        const oldCartera = old.cartera && String(old.cartera);
        const oldInversor = old.inversor && String(old.inversor);
        const newCartera = newBet.cartera && String(newBet.cartera);
        const newInversor = newBet.inversor && String(newBet.inversor);

        if (oldCartera && newCartera && oldCartera === newCartera) {
          batch.set(
            doc(db, "saldosCarteras", newCartera),
            { balanceCents: increment(delta), balance: increment(delta / 100) },
            { merge: true }
          );
        } else {
          if (oldCartera) {
            batch.set(
              doc(db, "saldosCarteras", oldCartera),
              {
                balanceCents: increment(-oldEfectivo),
                balance: increment(-oldEfectivo / 100),
              },
              { merge: true }
            );
          }
          if (newCartera) {
            batch.set(
              doc(db, "saldosCarteras", newCartera),
              {
                balanceCents: increment(newEfectivo),
                balance: increment(newEfectivo / 100),
              },
              { merge: true }
            );
          }
        }

        if (oldInversor && newInversor && oldInversor === newInversor) {
          batch.set(
            doc(db, "saldosInversores", newInversor),
            { balanceCents: increment(delta), balance: increment(delta / 100) },
            { merge: true }
          );
        } else {
          if (oldInversor) {
            batch.set(
              doc(db, "saldosInversores", oldInversor),
              {
                balanceCents: increment(-oldEfectivo),
                balance: increment(-oldEfectivo / 100),
              },
              { merge: true }
            );
          }
          if (newInversor) {
            batch.set(
              doc(db, "saldosInversores", newInversor),
              {
                balanceCents: increment(newEfectivo),
                balance: increment(newEfectivo / 100),
              },
              { merge: true }
            );
          }
        }
      }

      await batch.commit();
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar la apuesta");
    }
  };

  const deleteBet = async (bet) => {
    if (
      !window.confirm(
        "¿Eliminar este registro? Esta acción no se puede deshacer."
      )
    )
      return;
    try {
      const base = benefitCentsFromBet(bet) || 0;
      const sign = bet.aplicado !== false ? 1 : -1;
      const efectivo = sign * base;

      const batch = writeBatch(db);
      const carteraId = bet.cartera && String(bet.cartera).trim();
      const inversorId = bet.inversor && String(bet.inversor).trim();
      if (carteraId) {
        batch.set(
          doc(db, "saldosCarteras", carteraId),
          {
            balanceCents: increment(-efectivo),
            balance: increment(-efectivo / 100),
          },
          { merge: true }
        );
      }
      if (inversorId) {
        batch.set(
          doc(db, "saldosInversores", inversorId),
          {
            balanceCents: increment(-efectivo),
            balance: increment(-efectivo / 100),
          },
          { merge: true }
        );
      }
      batch.delete(doc(db, "bets", bet.id));
      await batch.commit();
      if (editingId === bet.id) cancelEdit();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar el registro");
    }
  };

  const toggleAplicado = async (bet) => {
    try {
      const base = benefitCentsFromBet(bet) || 0;
      const oldApplied = bet.aplicado !== false;
      const newApplied = !oldApplied;
      const signOld = oldApplied ? 1 : -1;
      const signNew = newApplied ? 1 : -1;
      const delta = (signNew - signOld) * base;

      const batch = writeBatch(db);
      batch.set(
        doc(db, "bets", bet.id),
        {
          aplicado: newApplied,
          tipoMovimiento: movimientoOf({ ...bet, aplicado: newApplied }),
        },
        { merge: true }
      );

      const carteraId = bet.cartera && String(bet.cartera).trim();
      const inversorId = bet.inversor && String(bet.inversor).trim();
      if (carteraId) {
        batch.set(
          doc(db, "saldosCarteras", carteraId),
          { balanceCents: increment(delta), balance: increment(delta / 100) },
          { merge: true }
        );
      }
      if (inversorId) {
        batch.set(
          doc(db, "saldosInversores", inversorId),
          { balanceCents: increment(delta), balance: increment(delta / 100) },
          { merge: true }
        );
      }
      await batch.commit();
    } catch (e) {
      console.error(e);
      alert("No se pudo cambiar 'Aplicado?'");
    }
  };

  const usageCount = (col, id, bets) => {
    const field = col === "saldosCarteras" ? "cartera" : "inversor";
    return bets.reduce((n, b) => (b[field] === id ? n + 1 : n), 0);
  };
  const recomputeSaldo = async (col, id) => {
    const field = col === "saldosCarteras" ? "cartera" : "inversor";
    const totalCents = betHistory
      .filter((b) => b[field] === id)
      .reduce((acc, b) => {
        const base = benefitCentsFromBet(b);
        const sign = b.aplicado !== false ? 1 : -1;
        return acc + sign * base;
      }, 0);
    try {
      await setDoc(
        doc(db, col, id),
        { balanceCents: totalCents, balance: totalCents / 100 },
        { merge: true }
      );
      alert(`Saldo de "${id}" recalculado: ${(totalCents / 100).toFixed(2)} €`);
    } catch (e) {
      console.error(e);
      alert("No se pudo recalcular el saldo");
    }
  };
  const editSaldo = async (col, id, currentCents) => {
    const actual = (currentCents ?? 0) / 100;
    const aviso =
      "⚠️ Editar el saldo cambia la base sobre la que se aplican futuros incrementos y puede no coincidir con el histórico.\n\n" +
      `Saldo actual de "${id}": ${actual.toFixed(2)} €\n\n` +
      "Introduce el nuevo saldo (€):";
    const nuevo = prompt(aviso, actual.toFixed(2));
    if (nuevo == null) return;
    const euros = parseNum(nuevo);
    const cents = Math.round(euros * 100);
    try {
      await setDoc(
        doc(db, col, id),
        { balanceCents: cents, balance: euros },
        { merge: true }
      );
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar el saldo");
    }
  };
  const { saldosCarteras: sc, saldosInversores: si } = {
    saldosCarteras,
    saldosInversores,
  };
  const deleteSaldo = async (col, id) => {
    const cents = col === "saldosCarteras" ? sc[id] : si[id];
    const used = usageCount(col, id, betHistory);
    let msg = `Vas a eliminar "${id}".\n`;
    if ((cents ?? 0) !== 0) msg += `• Saldo actual: ${centsToEUR(cents)} €\n`;
    if (used > 0) msg += `• Apuestas vinculadas: ${used}\n`;
    msg +=
      "Esto NO borra ni cambia apuestas pasadas.\n¿Quieres continuar de todos modos?";
    if (!window.confirm(msg)) return;
    try {
      await deleteDoc(doc(db, col, id));
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar");
    }
  };

  const distinct = useMemo(() => {
    const setCanal = new Set();
    const setTipo = new Set();
    const setCartera = new Set();
    const setInversor = new Set();
    const setEstado = new Set();
    const setDeporte = new Set();
    betHistory.forEach((b) => {
      if (b.canal) setCanal.add(b.canal);
      if (b.tipoInversion) setTipo.add(b.tipoInversion);
      if (b.cartera) setCartera.add(b.cartera);
      if (b.inversor) setInversor.add(b.inversor);
      if (b.estado) setEstado.add(b.estado);
      if (b.deporte) setDeporte.add(b.deporte);
    });
    return {
      canales: Array.from(setCanal).sort(),
      tipos: Array.from(setTipo).sort(),
      carteras: Array.from(setCartera).sort(),
      inversores: Array.from(setInversor).sort(),
      estados: Array.from(setEstado).sort(),
      deportes: Array.from(setDeporte).sort(),
    };
  }, [betHistory]);

  const filteredSortedBets = useMemo(() => {
    const f = filters;
    const list = betHistory.filter((b) => {
      const needle = (f.q || "").toLowerCase().trim();
      if (needle) {
        const haystack = [
          b.canal,
          b.tipoInversion,
          b.cartera,
          b.inversor,
          b.estado,
          b.observacion,
          b.deporte,
          b.valores,
          b.cuotasValores,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (f.canal && b.canal !== f.canal) return false;
      if (f.tipo && b.tipoInversion !== f.tipo) return false;
      if (f.cartera && b.cartera !== f.cartera) return false;
      if (f.inversor && b.inversor !== f.inversor) return false;
      if (f.estado && b.estado !== f.estado) return false;

      if (f.deporte && b.deporte !== f.deporte) return false;
      if (f.valoresText) {
        const vt = f.valoresText.toLowerCase().trim();
        const str = `${b.valores || ""} ${b.cuotasValores || ""}`.toLowerCase();
        if (!str.includes(vt)) return false;
      }
      if (f.cuotasInd === "si" && !b.cuotasIndependientes) return false;
      if (f.cuotasInd === "no" && !!b.cuotasIndependientes) return false;

      const co = Number(b.cuotaOfrecida ?? NaN);
      if (
        f.cuotaOfMin !== "" &&
        !(Number.isFinite(co) && co >= parseNum(f.cuotaOfMin))
      )
        return false;
      if (
        f.cuotaOfMax !== "" &&
        !(Number.isFinite(co) && co <= parseNum(f.cuotaOfMax))
      )
        return false;

      const applied = b.aplicado !== false;
      if (f.aplicado === "si" && !applied) return false;
      if (f.aplicado === "no" && applied) return false;

      if (f.movimiento) {
        const mov = movimientoOf(b);
        if (mov !== f.movimiento) return false;
      }

      const d = b.fecha && b.fecha.toDate ? b.fecha.toDate() : null;
      if (f.fechaDesde) {
        const from = new Date(`${f.fechaDesde}T00:00:00`);
        if (!d || d < from) return false;
      }
      if (f.fechaHasta) {
        const to = new Date(`${f.fechaHasta}T23:59:59`);
        if (!d || d > to) return false;
      }

      const invC = b.inversionCents ?? Math.round((b.inversion || 0) * 100);
      const benC =
        b.totalBeneficioPerdidaCents ??
        Math.round((b.totalBeneficioPerdida || 0) * 100);

      if (f.invMin !== "" && invC < Math.round(parseNum(f.invMin) * 100))
        return false;
      if (f.invMax !== "" && invC > Math.round(parseNum(f.invMax) * 100))
        return false;
      if (f.benMin !== "" && benC < Math.round(parseNum(f.benMin) * 100))
        return false;
      if (f.benMax !== "" && benC > Math.round(parseNum(f.benMax) * 100))
        return false;

      return true;
    });

    const valueFor = (b, field) => {
      switch (field) {
        case "fecha":
          return b.fecha && b.fecha.toDate ? b.fecha.toDate().getTime() : 0;
        case "canal":
          return b.canal || "";
        case "tipo":
          return b.tipoInversion || "";
        case "inversion":
          return b.inversionCents ?? Math.round((b.inversion || 0) * 100);
        case "cuota":
          return Number(b.cuotaAplicada || 0);
        case "cuotaOf":
          return Number(b.cuotaOfrecida || 0);
        case "estado":
          return b.estado || "";
        case "ganado":
          return (
            b.totalGanadoPerdidoCents ??
            Math.round((b.totalGanadoPerdido || 0) * 100)
          );
        case "beneficio":
          return (
            b.totalBeneficioPerdidaCents ??
            Math.round((b.totalBeneficioPerdida || 0) * 100)
          );
        case "cartera":
          return b.cartera || "";
        case "inversor":
          return b.inversor || "";
        case "deporte":
          return b.deporte || "";
        case "valores":
          return b.valores || b.cuotasValores || "";
        case "aplicado":
          return b.aplicado !== false ? 1 : 0;
        default:
          return 0;
      }
    };

    const dir = sort.dir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      const va = valueFor(a, sort.field);
      const vb = valueFor(b, sort.field);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      const fa = valueFor(a, "fecha");
      const fb = valueFor(b, "fecha");
      return fb - fa;
    });

    return list;
  }, [betHistory, filters, sort]);

  if (loading) return <div style={styles.container}>Cargando…</div>;
  if (error) return <div style={styles.container}>{error}</div>;

  const handleChange = (setter) => (e) =>
    setter((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Gestor de Apuestas</h1>
        <p style={styles.p}>Prototipo con Firestore</p>
      </header>

      {/* Toggle modo compacto */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          maxWidth: "1800px",
          margin: "0 auto 12px auto",
        }}
      >
        <button
          style={styles.compactToggle}
          onClick={() => setUserCompact((v) => !v)}
          title="Alternar modo compacto (automático en móvil)"
        >
          Modo {isCompact ? "amplio" : "compacto"}
        </button>
      </div>

      {/* SALDOS + CALCULADORA */}
      <div style={styles.topLayout}>
        {/* SALDOS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Saldos Actuales</h2>

          {/* KPIs */}
          <div style={styles.kpiBar}>
            <div
              style={styles.kpiCard}
              title="Suma de todas las casas de apuestas (excluye BANCO)"
            >
              <div style={{ opacity: 0.8, fontSize: ".85rem" }}>
                Disponible en casas
              </div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {kpis.totalCasasEUR.toFixed(2)} €
              </div>
            </div>
            <div
              style={styles.kpiCard}
              title="Gasto acumulado pagado con tarjeta (cursos/recargas)"
            >
              <div style={{ opacity: 0.8, fontSize: ".85rem" }}>
                Gasto BANCO
              </div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {kpis.gastoBancoAbsEUR.toFixed(2)} €
              </div>
            </div>
            <div
              style={styles.kpiCard}
              title="Suma de todo: casas + BANCO (negativo)"
            >
              <div style={{ opacity: 0.8, fontSize: ".85rem" }}>
                Neto global
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: kpis.netoGlobalEUR >= 0 ? "#10b981" : "#ef4444",
                }}
              >
                {kpis.netoGlobalEUR.toFixed(2)} €
              </div>
            </div>
          </div>

          <h3 style={styles.subTitle}>Carteras</h3>
          <div style={styles.balanceContainer}>
            {Object.entries(saldosCarteras).map(([name, cents]) => {
              const esBanco = isBanco(name);
              return (
                <div style={styles.balanceBox} key={`c-${name}`}>
                  <span style={styles.balanceLabel}>{name}</span>
                  <span style={styles.balanceAmount}>
                    {centsToEUR(cents)} €
                  </span>

                  {/* Acciones estándar */}
                  <div style={styles.actionBtns}>
                    <button
                      style={styles.actionBtn}
                      onClick={() => editSaldo("saldosCarteras", name, cents)}
                    >
                      Editar saldo
                    </button>
                    <button
                      style={styles.actionBtn}
                      onClick={() => recomputeSaldo("saldosCarteras", name)}
                    >
                      Recalcular
                    </button>
                    <button
                      style={{
                        ...styles.actionBtn,
                        ...styles.actionDanger,
                        ...(esBanco
                          ? { opacity: 0.5, cursor: "not-allowed" }
                          : null),
                      }}
                      onClick={() =>
                        !esBanco && deleteSaldo("saldosCarteras", name)
                      }
                      disabled={esBanco}
                      title={
                        esBanco ? "No se puede eliminar BANCO" : "Eliminar"
                      }
                    >
                      Eliminar
                    </button>
                  </div>

                  {/* === Acciones rápidas solo para BANCO === */}
                  {esBanco && (
                    <div style={{ ...styles.actionBtns, marginTop: 6 }}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => quickGastoAction(name)}
                        title="Registrar gasto rápido (curso/comisión)"
                      >
                        Gasto (curso)
                      </button>
                      <button
                        style={styles.actionBtn}
                        onClick={() => quickRecargaAction(name)}
                        title="Recargar saldo a una casa (BANCO → CASA)"
                      >
                        Recargar a casa
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <h3 style={{ ...styles.subTitle, marginTop: 12 }}>Inversores</h3>
          <div style={styles.balanceContainer}>
            {Object.entries(saldosInversores).map(([name, cents]) => (
              <div style={styles.balanceBox} key={`i-${name}`}>
                <span style={styles.balanceLabel}>{name}</span>
                <span style={styles.balanceAmount}>{centsToEUR(cents)} €</span>
                <div style={styles.actionBtns}>
                  <button
                    style={styles.actionBtn}
                    onClick={() => editSaldo("saldosInversores", name, cents)}
                  >
                    Editar saldo
                  </button>
                  <button
                    style={styles.actionBtn}
                    onClick={() => recomputeSaldo("saldosInversores", name)}
                  >
                    Recalcular
                  </button>
                  <button
                    style={{ ...styles.actionBtn, ...styles.actionDanger }}
                    onClick={() => deleteSaldo("saldosInversores", name)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <div style={styles.inlineButtonGroup}>
              <button
                style={styles.addButton}
                onClick={() => handleAddNewItem("cartera")}
              >
                Añadir Cartera
              </button>
              <button
                style={styles.addButton}
                onClick={() => handleAddNewItem("inversor")}
              >
                Añadir Inversor
              </button>
            </div>
          </div>
        </div>

        {/* CALCULADORA */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Calculadora de Planificación</h2>

          <div>
            <h3 style={styles.subTitle}>Situación Actual</h3>
            <label style={styles.label}>Capital Inicial (€)</label>
            <input
              style={styles.input}
              type="number"
              name="capitalInicial"
              value={planningSituation.capitalInicial}
              onChange={handleChange(setPlanningSituation)}
            />
            <label style={styles.label}>Beneficio Actual (€)</label>
            <input
              style={styles.input}
              type="number"
              name="beneficioActual"
              value={planningSituation.beneficioActual}
              onChange={handleChange(setPlanningSituation)}
            />
          </div>

          <div>
            <h3 style={styles.subTitle}>Estrategia de Inversión</h3>
            <label style={styles.label}>Modo</label>
            <select
              style={styles.select}
              name="investmentMode"
              value={planningStrategy.investmentMode}
              onChange={handleChange(setPlanningStrategy)}
            >
              <option value="amount">Cantidad fija</option>
              <option value="percent">% del presupuesto</option>
            </select>
            <label style={styles.label}>
              {planningStrategy.investmentMode === "percent"
                ? "Porcentaje (%)"
                : "Cantidad (€)"}
            </label>
            <input
              style={styles.input}
              type="number"
              name="investmentValue"
              value={planningStrategy.investmentValue}
              onChange={handleChange(setPlanningStrategy)}
            />
          </div>

          <div>
            <h3 style={styles.subTitle}>Próxima Apuesta</h3>

            <label style={styles.label}>
              Total máximo a invertir (€) (Calculado)
            </label>
            <input
              style={styles.input}
              type="number"
              value={totalMaxToInvest.toFixed(2)}
              readOnly
            />

            <label style={styles.label}>
              Coste Inversión Apuesta (€) (Calculado)
            </label>
            <input
              style={styles.input}
              type="number"
              value={investmentCostForBet.toFixed(2)}
              readOnly
            />

            <label style={styles.label}>Coste del curso (€)</label>
            <input
              style={styles.input}
              type="number"
              name="courseCost"
              value={planningBet.courseCost}
              onChange={handleChange(setPlanningBet)}
            />
            <label style={styles.label}>Cuota</label>
            <input
              style={styles.input}
              type="number"
              step="0.01"
              name="odds"
              value={planningBet.odds}
              onChange={handleChange(setPlanningBet)}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Posible ganado:</span>
              <strong>{possibleGain.toFixed(2)} €</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Posible beneficio:</span>
              <strong>{possibleBenefit.toFixed(2)} €</strong>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRO/EDICIÓN */}
      <div style={styles.mainLayout}>
        <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h2 style={styles.cardTitle}>
            {editingId ? "Editar Apuesta" : "Registrar Apuesta Finalizada"}
          </h2>
          <form
            onSubmit={handleSubmitBet}
            style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
          >
            <div
              style={{
                flexGrow: 1,
                overflowY: "auto",
                paddingRight: "10px",
                maxHeight: "70vh",
                display: "grid",
                gridTemplateColumns: `repeat(auto-fit, minmax(${
                  isCompact ? 220 : 240
                }px, 1fr))`,
                gap: "12px 16px",
              }}
            >
              {/* Obligatorios */}
              <div>
                <label style={styles.label}>Fecha *</label>
                <input
                  style={styles.input}
                  type="date"
                  name="fecha"
                  value={newBet.fecha}
                  onChange={handleInputChange(setNewBet)}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Canal *</label>
                <input
                  style={styles.input}
                  type="text"
                  name="canal"
                  value={newBet.canal}
                  onChange={handleInputChange(setNewBet)}
                  placeholder="Bet365, Banco…"
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Tipo inversión *</label>
                <input
                  style={styles.input}
                  type="text"
                  name="tipoInversion"
                  value={newBet.tipoInversion}
                  onChange={handleInputChange(setNewBet)}
                  placeholder="Ej. simple, combinada…"
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Inversión (€) *</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  name="inversion"
                  value={newBet.inversion}
                  onChange={handleInputChange(setNewBet)}
                  required
                />
              </div>

              <div>
                <label style={styles.label}>Cartera *</label>
                <div style={styles.inlineButtonGroup}>
                  <select
                    style={{ ...styles.select, marginBottom: 0 }}
                    name="cartera"
                    value={newBet.cartera}
                    onChange={handleInputChange(setNewBet)}
                    required
                  >
                    <option value="" disabled>
                      -- Selecciona cartera --
                    </option>
                    {Object.keys(saldosCarteras).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    style={styles.addButton}
                    onClick={() => handleAddNewItem("cartera")}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label style={styles.label}>Inversor *</label>
                <div style={styles.inlineButtonGroup}>
                  <select
                    style={{ ...styles.select, marginBottom: 0 }}
                    name="inversor"
                    value={newBet.inversor}
                    onChange={handleInputChange(setNewBet)}
                    required
                  >
                    <option value="" disabled>
                      -- Selecciona inversor --
                    </option>
                    {Object.keys(saldosInversores).map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    style={styles.addButton}
                    onClick={() => handleAddNewItem("inversor")}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label style={styles.label}>Estado *</label>
                <select
                  style={styles.select}
                  name="estado"
                  value={newBet.estado}
                  onChange={handleInputChange(setNewBet)}
                  required
                >
                  <option value="G">G (Ganada)</option>
                  <option value="P">P (Perdida)</option>
                  <option value="I">I (Inversión)</option>
                </select>
              </div>

              {/* Opcionales */}
              <div>
                <label style={styles.label}>Cuota ofrecida (opcional)</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  name="cuotaOfrecida"
                  value={newBet.cuotaOfrecida}
                  onChange={handleInputChange(setNewBet)}
                  placeholder="Ej. 2.10"
                />
              </div>
              <div>
                <label style={styles.label}>Cuota aplicada (opcional)</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  name="cuotaAplicada"
                  value={newBet.cuotaAplicada}
                  onChange={handleInputChange(setNewBet)}
                  placeholder="Ej. 2.05"
                />
              </div>

              <div className="col-span-2" style={styles.checkboxRow}>
                <input
                  id="cuotasIndependientes"
                  type="checkbox"
                  name="cuotasIndependientes"
                  checked={newBet.cuotasIndependientes}
                  onChange={handleInputChange(setNewBet)}
                />
                <label htmlFor="cuotasIndependientes">
                  Cuotas independientes (opcional)
                </label>
              </div>

              {newBet.cuotasIndependientes && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={styles.label}>
                    Cuotas (separadas por coma)
                  </label>
                  <input
                    style={styles.input}
                    type="text"
                    name="cuotasValores"
                    value={newBet.cuotasValores}
                    onChange={handleInputChange(setNewBet)}
                    placeholder="Ej. 2.10, 1.85, 3.25"
                  />
                </div>
              )}

              <div>
                <label style={styles.label}>
                  Total ganado/perdido (€) (opcional)
                </label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  name="totalGanadoPerdido"
                  value={newBet.totalGanadoPerdido}
                  onChange={handleInputChange(setNewBet)}
                  placeholder="Se calcula si lo dejas vacío"
                />
              </div>
              <div>
                <label style={styles.label}>
                  Total beneficio/pérdida (€) (opcional)
                </label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  name="totalBeneficioPerdida"
                  value={newBet.totalBeneficioPerdida}
                  onChange={handleInputChange(setNewBet)}
                  placeholder="Se calcula si lo dejas vacío"
                />
              </div>

              <div>
                <label style={styles.label}>Deporte Apuesta (opcional)</label>
                <input
                  style={styles.input}
                  type="text"
                  name="deporte"
                  value={newBet.deporte}
                  onChange={handleInputChange(setNewBet)}
                  placeholder="Fútbol, Tenis…"
                />
              </div>
              <div>
                <label style={styles.label}>Valores apuesta (opcional)</label>
                <input
                  style={styles.input}
                  type="text"
                  name="valores"
                  value={newBet.valores}
                  onChange={handleInputChange(setNewBet)}
                  placeholder="Ej. handicap, over/under…"
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={styles.label}>Observación (opcional)</label>
                <textarea
                  style={styles.textarea}
                  name="observacion"
                  value={newBet.observacion}
                  onChange={handleInputChange(setNewBet)}
                  placeholder="Notas adicionales…"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={styles.button}
                type="submit"
                disabled={!requiredOk}
              >
                {editingId ? "Actualizar registro" : "Guardar Registro"}
              </button>
              {editingId && (
                <button
                  type="button"
                  style={{ ...styles.button, backgroundColor: "#718096" }}
                  onClick={cancelEdit}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* HISTORIAL + FILTROS */}
        <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h2 style={styles.cardTitle}>Historial de Apuestas</h2>

          <div style={styles.filterHeaderRow}>
            <input
              style={styles.input}
              name="q"
              placeholder="🔎 Buscar (texto libre)"
              value={filters.q}
              onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
            />
            <select
              style={styles.select}
              value={sort.field}
              onChange={(e) =>
                setSort((s) => ({ ...s, field: e.target.value }))
              }
            >
              <option value="fecha">Ordenar por: Fecha</option>
              <option value="beneficio">Beneficio</option>
              <option value="inversion">Inversión</option>
              <option value="ganado">Ganado</option>
              <option value="cuota">Cuota Apl.</option>
              <option value="cuotaOf">Cuota Ofr.</option>
              <option value="canal">Canal</option>
              <option value="tipo">Tipo</option>
              <option value="cartera">Cartera</option>
              <option value="inversor">Inversor</option>
              <option value="estado">Estado</option>
              <option value="deporte">Deporte</option>
              <option value="valores">Valores</option>
              <option value="aplicado">Aplicado</option>
            </select>
            <select
              style={styles.select}
              value={sort.dir}
              onChange={(e) => setSort((s) => ({ ...s, dir: e.target.value }))}
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
            <button
              style={styles.smallBtn}
              onClick={() => setShowFilters((v) => !v)}
            >
              {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </div>

          {showFilters && (
            <div style={styles.filterBar}>
              <select
                style={styles.select}
                value={filters.canal}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, canal: e.target.value }))
                }
              >
                <option value="">Canal (todos)</option>
                {distinct.canales.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                style={styles.select}
                value={filters.tipo}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, tipo: e.target.value }))
                }
              >
                <option value="">Tipo (todos)</option>
                {distinct.tipos.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                style={styles.select}
                value={filters.cartera}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, cartera: e.target.value }))
                }
              >
                <option value="">Cartera (todas)</option>
                {Object.keys(saldosCarteras).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                style={styles.select}
                value={filters.inversor}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, inversor: e.target.value }))
                }
              >
                <option value="">Inversor (todos)</option>
                {Object.keys(saldosInversores).map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>

              <select
                style={styles.select}
                value={filters.estado}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, estado: e.target.value }))
                }
              >
                <option value="">Estado (todos)</option>
                {["G", "P", "I"].map((e1) => (
                  <option key={e1} value={e1}>
                    {e1}
                  </option>
                ))}
              </select>

              <select
                style={styles.select}
                value={filters.deporte}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, deporte: e.target.value }))
                }
              >
                <option value="">Deporte (todos)</option>
                {[...new Set(betHistory.map((b) => b.deporte).filter(Boolean))]
                  .sort()
                  .map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>

              <input
                style={styles.input}
                placeholder="Valores/cuotas contiene…"
                value={filters.valoresText}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, valoresText: e.target.value }))
                }
              />

              <select
                style={styles.select}
                value={filters.cuotasInd}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, cuotasInd: e.target.value }))
                }
              >
                <option value="">Cuotas ind. (todos)</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>

              <select
                style={styles.select}
                value={filters.aplicado}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, aplicado: e.target.value }))
                }
              >
                <option value="">Aplicado (todos)</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>

              <select
                style={styles.select}
                value={filters.movimiento}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, movimiento: e.target.value }))
                }
              >
                <option value="">Movimiento (todos)</option>
                <option value="APUESTA">Apuesta</option>
                <option value="GASTO">Gasto</option>
                <option value="RECARGA">Recarga</option>
                <option value="AJUSTE">Ajuste</option>
              </select>

              <input
                style={styles.input}
                type="number"
                step="0.01"
                placeholder="Cuota ofr. mín"
                value={filters.cuotaOfMin}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, cuotaOfMin: e.target.value }))
                }
              />
              <input
                style={styles.input}
                type="number"
                step="0.01"
                placeholder="Cuota ofr. máx"
                value={filters.cuotaOfMax}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, cuotaOfMax: e.target.value }))
                }
              />

              <input
                style={styles.input}
                type="date"
                value={filters.fechaDesde}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, fechaDesde: e.target.value }))
                }
                placeholder="Desde"
              />
              <input
                style={styles.input}
                type="date"
                value={filters.fechaHasta}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, fechaHasta: e.target.value }))
                }
                placeholder="Hasta"
              />

              <input
                style={styles.input}
                type="number"
                placeholder="Inv. mín (€)"
                value={filters.invMin}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, invMin: e.target.value }))
                }
              />
              <input
                style={styles.input}
                type="number"
                placeholder="Inv. máx (€)"
                value={filters.invMax}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, invMax: e.target.value }))
                }
              />

              <input
                style={styles.input}
                type="number"
                placeholder="Benef. mín (€)"
                value={filters.benMin}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, benMin: e.target.value }))
                }
              />
              <input
                style={styles.input}
                type="number"
                placeholder="Benef. máx (€)"
                value={filters.benMax}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, benMax: e.target.value }))
                }
              />

              <button
                type="button"
                style={styles.smallBtn}
                onClick={() =>
                  setFilters({
                    q: "",
                    canal: "",
                    tipo: "",
                    cartera: "",
                    inversor: "",
                    estado: "",
                    fechaDesde: "",
                    fechaHasta: "",
                    invMin: "",
                    invMax: "",
                    benMin: "",
                    benMax: "",
                    deporte: "",
                    valoresText: "",
                    cuotaOfMin: "",
                    cuotaOfMax: "",
                    cuotasInd: "",
                    aplicado: "",
                    movimiento: "",
                  })
                }
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* TABLA */}
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Fecha</th>
                  {showCol.canal && <th style={styles.th}>Canal</th>}
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Inversión</th>
                  {showCol.cuotaOf && <th style={styles.th}>Cuota Ofr.</th>}
                  <th style={styles.th}>Cuota Apl.</th>
                  {showCol.cuotasInd && <th style={styles.th}>Cuotas ind.</th>}
                  {showCol.cuotas && <th style={styles.th}>Cuotas</th>}
                  <th style={styles.th}>Estado</th>
                  {showCol.ganado && <th style={styles.th}>Ganado</th>}
                  <th style={styles.th}>Beneficio</th>
                  <th style={styles.th}>Cartera</th>
                  {showCol.inversor && <th style={styles.th}>Inversor</th>}
                  {showCol.deporte && <th style={styles.th}>Deporte</th>}
                  {showCol.valores && <th style={styles.th}>Valores</th>}
                  {showCol.observ && <th style={styles.th}>Observación</th>}
                  <th style={styles.th}>Aplicado?</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSortedBets.map((bet) => {
                  const inv =
                    bet.inversionCents ??
                    Math.round((bet.inversion || 0) * 100);
                  const ganado =
                    bet.totalGanadoPerdidoCents ??
                    Math.round((bet.totalGanadoPerdido || 0) * 100);
                  const beneficioBase =
                    bet.totalBeneficioPerdidaCents ??
                    Math.round((bet.totalBeneficioPerdida || 0) * 100);
                  const applied = bet.aplicado !== false;
                  const beneficioEfectivo = (applied ? 1 : -1) * beneficioBase;
                  const cls =
                    (beneficioEfectivo || 0) >= 0 ? styles.profit : styles.loss;

                  const cuotasDisplay = Array.isArray(bet.cuotasValoresNums)
                    ? bet.cuotasValoresNums.join(", ")
                    : bet.cuotasValores || "";

                  const mov = movimientoOf(bet);
                  const color =
                    mov === "APUESTA"
                      ? "#10b981"
                      : mov === "GASTO"
                      ? "#ef4444"
                      : mov === "RECARGA"
                      ? "#3b82f6"
                      : mov === "AJUSTE"
                      ? "#f59e0b"
                      : "#6b7280";

                  const disableToggle = mov === "RECARGA";

                  return (
                    <tr key={bet.id}>
                      <td style={styles.td}>{fmtFecha(bet.fecha)}</td>
                      {showCol.canal && <td style={styles.td}>{bet.canal}</td>}
                      <td style={styles.td}>
                        {bet.tipoInversion}
                        <span
                          style={{
                            ...styles.badgeMovimiento,
                            borderColor: color,
                            color,
                          }}
                        >
                          {mov}
                        </span>
                      </td>
                      <td style={styles.td}>{centsToEUR(inv)} €</td>
                      {showCol.cuotaOf && (
                        <td style={styles.td}>
                          {bet.cuotaOfrecida
                            ? Number(bet.cuotaOfrecida).toFixed(2)
                            : "-"}
                        </td>
                      )}
                      <td style={styles.td}>
                        {bet.cuotaAplicada
                          ? Number(bet.cuotaAplicada).toFixed(2)
                          : "-"}
                      </td>
                      {showCol.cuotasInd && (
                        <td style={styles.td}>
                          {bet.cuotasIndependientes ? "Sí" : "—"}
                        </td>
                      )}
                      {showCol.cuotas && (
                        <td style={styles.tdTruncate} title={cuotasDisplay}>
                          {cuotasDisplay
                            .split(",")
                            .slice(0, 3)
                            .map((c, idx) =>
                              c.trim() ? (
                                <span key={idx} style={styles.chip}>
                                  {c.trim()}
                                </span>
                              ) : null
                            )}
                          {cuotasDisplay.split(",").length > 3 ? "…" : ""}
                        </td>
                      )}
                      <td style={styles.td}>{bet.estado}</td>
                      {showCol.ganado && (
                        <td style={styles.td}>{centsToEUR(ganado)} €</td>
                      )}
                      <td style={{ ...styles.td, ...cls }}>
                        {centsToEUR(beneficioEfectivo)} €
                        {!applied && (
                          <span
                            style={styles.badgeInvertido}
                            title="Impacto invertido"
                          >
                            invertido
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>{bet.cartera}</td>
                      {showCol.inversor && (
                        <td style={styles.td}>{bet.inversor}</td>
                      )}
                      {showCol.deporte && (
                        <td style={styles.td}>{bet.deporte || "—"}</td>
                      )}
                      {showCol.valores && (
                        <td style={styles.tdTruncate} title={bet.valores || ""}>
                          {bet.valores || "—"}
                        </td>
                      )}
                      {showCol.observ && (
                        <td
                          style={styles.tdTruncate}
                          title={bet.observacion || ""}
                        >
                          {bet.observacion || "—"}
                        </td>
                      )}
                      <td style={styles.td}>
                        <input
                          type="checkbox"
                          checked={applied}
                          onChange={() => toggleAplicado(bet)}
                          disabled={disableToggle}
                          title={
                            disableToggle
                              ? "RECARGA (apunte espejo); no modificar 'Aplicado?'"
                              : "Aplicar impacto normal (marcado) o invertir (desmarcado)"
                          }
                        />
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            style={styles.actionBtn}
                            onClick={() => startEdit(bet)}
                          >
                            Editar
                          </button>
                          <button
                            style={{
                              ...styles.actionBtn,
                              ...styles.actionDanger,
                            }}
                            onClick={() => deleteBet(bet)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredSortedBets.length === 0 && (
                  <tr>
                    <td style={styles.td} colSpan={18}>
                      No hay registros que coincidan con los filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
