/* Speditionsauftrag – interaktives Formular (Kläger GmbH)
   Alle Eingaben bleiben im Browser. Es wird nichts übertragen oder gespeichert. */
(function () {
  "use strict";
  var A = window.ASSETS;
  // Manche Vorschau-Umgebungen ersetzen "console" – Protokollierung darf nie einen Fehler auslösen
  function logErr(e) { try { if (window.console && typeof window.console.error === "function") window.console.error(e); } catch (x) { /* egal */ } }
  var MAX_POS = 15;

  /* ---------- Texte der Oberfläche ---------- */
  var UI = {
    de: {
      pageTitle: "Speditionsauftrag", formNoShort: "Formular-Nr.: FO 15-01",
      refresh: "Refresh", export: "Export (PDF)", date: "Datum",
      docType: "Dokument", qty: "Menge", docNr: "Dokumenten-Nr.",
      docHint: "Mehrere Nummern mit Komma trennen, Bereiche mit Bindestrich (z. B. 150450-455). Liegt ein Dokument mehrfach bei: eine Nummer und die Menge eintragen.",
      refPh: "Auftragsnummer, 6–12 Ziffern",
      d0: "Firma *", d1: "Zusatz", d2: "Straße und Hausnummer *", d3: "Land / PLZ / Ort *", d3Ph: "z. B. D 86473 Ziemetshausen",
      custNo: "Kundennummer", custNoPh: "Kundennummer + Enter",
      customers: "Stammdaten", custSec: "Kundenstamm", artSec: "Artikelstamm", bCust: "Kd.", bArt: "Art.",
      amHelp: "Excel-Datei (.xlsx) oder CSV: A Artikelnummer | B Bezeichnung 1 DE | C Bezeichnung 2 DE | D Bezeichnung 1 EN | E Bezeichnung 2 EN. Je nach Formularsprache wird die deutsche oder englische Bezeichnung übernommen.",
      amUpload: "Artikelliste hochladen", amDownload: "Artikelstamm herunterladen",
      amAdded: "<b>{n}</b> lokal ergänzte Artikel",
      naTitle: "Artikel nicht gefunden", naText: "Artikel {n} ist nicht im Artikelstamm hinterlegt. Soll der Artikel im Artikelstamm hinterlegt werden?",
      naNoDb: "Achtung: Im Moment ist kein Artikelstamm geladen.", naFormTitle: "Neuen Artikel {n} hinterlegen",
      naDe1: "Bezeichnung 1 DE", naDe2: "Bezeichnung 2 DE", naEn1: "Bezeichnung 1 EN", naEn2: "Bezeichnung 2 EN",
      naLocal: "Der Artikel wird nur auf diesem PC ergänzt. Über „Stammdaten → Artikelstamm herunterladen“ kannst Du die Liste mit dem Team teilen.",
      artSaved: "Artikel {n} hinterlegt.", upDroppedArt: " {d} Ergänzung(en) sind jetzt im Artikelstamm enthalten.", amNone: "Noch kein Artikelstamm geladen.",
      amLoaded: "<b>{n}</b> Artikel aus <b>{f}</b>, geladen am {d}.", artUpOk: "{n} Artikel geladen.",
      amClear: "Artikelstamm von diesem PC löschen", amClearConfirm: "Wirklich löschen? Zum Bestätigen noch einmal klicken.",
      yes: "Ja", no: "Nein", save: "Speichern", close: "Schließen",
      ncTitle: "Kunde nicht gefunden",
      ncText: "Kunde #{n} ist nicht im Kundenstamm hinterlegt. Soll der Kunde im Kundenstamm hinterlegt werden?",
      ncNoDb: "Achtung: Im Moment ist kein Kundenstamm geladen.",
      ncDbInfo: "Geladen sind {n} Kunden, z. B. {ex}.",
      ncSimilar: "Ähnliche Kundennummern – zum Übernehmen anklicken:",
      ncPreview: "In der Chat-Vorschau geht der Kundenstamm verloren, sobald die Vorschau neu lädt. Zum Testen die HTML-Datei herunterladen und im Browser öffnen.",
      cmGuessContent: "(am Inhalt erkannt)", cmGuessPos: "(nach Spaltenposition)", cmUnknown: "Nicht zugeordnet:",
      cmCols: "Erkannte Spalten:", cmColsPos: "Keine Überschrift erkannt – Spalten nach Reihenfolge A–G zugeordnet:",
      fld: { no: "Kundennummer", name: "Firma", extra: "Zusatz", street: "Straße", zip: "PLZ", city: "Ort", country: "Länderkennzeichen", countryName: "Land" },
      ncFormTitle: "Neuen Kunden #{n} hinterlegen",
      cName: "Firma *", cExtra: "Zusatz", cStreet: "Straße und Hausnummer *", cCountry: "Land", cZip: "PLZ *", cCity: "Ort *",
      ncLocal: "Der Kunde wird nur auf diesem PC ergänzt. Über „Kundenstamm → Herunterladen“ kannst Du die Liste mit dem Team teilen.",
      cmHelp: "Excel-Datei (.xlsx) oder CSV, z. B. mit den Spalten Kundennummer | Kundenname | Straße | PLZ | Ort | Länderkennzeichen | Land (optional: Zusatz). Die Spalten werden an der Überschrift erkannt. Die Daten bleiben nur auf diesem PC im Browser gespeichert und werden nicht übertragen.",
      cmUpload: "Excel hochladen", cmDownload: "Kundenstamm herunterladen", cmTemplate: "Leere Vorlage",
      cmClear: "Alle Kundendaten von diesem PC löschen", cmClearConfirm: "Wirklich alle Kundendaten von diesem PC löschen? Zum Bestätigen noch einmal klicken.",
      cmNone: "Noch kein Kundenstamm geladen.",
      cmLoaded: "<b>{n}</b> Kunden aus <b>{f}</b>, geladen am {d}.",
      cmAdded: "<b>{n}</b> lokal ergänzte Kunden",
      cmAddedTitle: "Lokal ergänzt (nicht in der Excel-Datei):",
      cmNoStore: "Hinweis: In dieser Vorschau wird nichts gespeichert. Nach dem Schließen ist der Kundenstamm wieder leer.",
      storeFail: "Speichern im Browser nicht möglich – bitte Speicherplatz bzw. Browser-Einstellungen prüfen.",
      cmStored: "Wird in diesem Browser gespeichert und steht beim nächsten Öffnen wieder zur Verfügung.",
      upOk: "{n} Kunden geladen.", upKept: " {k} lokale Ergänzung(en) behalten.", upDropped: " {d} Ergänzung(en) sind jetzt im Kundenstamm enthalten.",
      upErrCols: "Spalten nicht erkannt. Benötigt werden mindestens „Kundennummer“ und „Kundenname“. Gefundene Überschriften: {h}",
      upErrXls: "Das alte Excel-Format (.xls) kann nicht gelesen werden. Bitte in Excel „Speichern unter → Excel-Arbeitsmappe (.xlsx)“ wählen.",
      upErrEmpty: "Keine Kunden in der Datei gefunden.", upErr: "Datei konnte nicht gelesen werden: ",
      stFound: "✓ Aus dem Kundenstamm übernommen", stFoundLocal: "✓ Aus lokal ergänzten Kunden übernommen",
      stEdited: "Adresse geändert: gilt nur für diesen Auftrag, der Kundenstamm bleibt unverändert.",
      stUnknown: "Kundennummer nicht im Kundenstamm",
      custSaved: "Kunde #{n} hinterlegt.", cleared2: "Kundendaten gelöscht.",
      hdr: ["Kundennummer", "Kundenname", "Straße", "PLZ", "Ort", "Länderkennzeichen", "Land", "Zusatz"],
      positions: "Positionen", posHint: "Gewicht = Bruttogewicht je Position. Maße je Einheit in cm, bei Kartons optional.",
      qtyPh: "Anz.", unitType: "Art", weightKg: "Brutto (kg)", artNo: "Art.-Nr.", desc1: "Artikelbezeichnung 1", desc2: "Artikelbezeichnung 2",
      artUnknown: "Artikelnummer nicht im Artikelstamm – Bezeichnung bitte von Hand eintragen.",
      artNoDb: "Kein Artikelstamm geladen – Bezeichnung bitte von Hand eintragen oder unter „Stammdaten“ die Artikelliste hochladen.",
      artNoLang: "Für diesen Artikel gibt es keine deutsche Bezeichnung – englische Bezeichnung übernommen.", dimL: "L", dimB: "B", dimH: "H", addPos: "Position",
      insuredPh: "z. B. 7.106,40",
      pickupNote: "„Paletten getauscht“, Datum und Unterschrift füllt der Versand bei Abholung von Hand aus. Die Felder erscheinen leer im Export.",
      confirmTitle: "Alle Eingaben löschen?", confirmText: "Das Formular wird komplett geleert. Das lässt sich nicht rückgängig machen.",
      cancel: "Abbrechen", confirmYes: "Ja, löschen",
      errTitle: "Export nicht möglich – bitte prüfen:",
      choose: "Bitte wählen", del: "Position löschen",
      totalWeight: "Gesamtgewicht", volume: "Volumen",
      cleared: "Formular geleert.", exported: "Export erstellt: ", exportFail: "Export fehlgeschlagen: ",
      senderOpts: { kg: "Kläger GmbH – Neusäß", as: "Andreas Schmid Kontraktlogistik – Gersthofen" },
      sec: { agent: "Abholung durch", docs: "Dokumente", ref: "Referenz", dest: "Empfangsadresse", pos: "Position", insured: "Versicherungswert" },
      e: {
        required: "Pflichtfeld",
        ref: "Auftragsnummer: 6–12 Ziffern",
        docQty: "Ganze Zahl von 1 bis 999",
        docNr: "Jede Nummer 6–18 Zeichen (Ziffern, Buchstaben, - / .)",
        docNrMissing: "Dokumenten-Nr. fehlt",
        docQtyMissing: "Menge fehlt",
        docsNone: "Mindestens ein Dokument mit Menge und Nummer eintragen",
        qty: "Menge: ganze Zahl 1–999",
        type: "Art wählen",
        weight: "Gewicht: ganze Zahl 1–999.999.999 kg",
        dim: "Maße: ganze Zahlen 1–999 cm",
        dimMissing: "L × B × H fehlen",
        qtyMissing: "Menge fehlt",
        weightMissing: "Gewicht fehlt",
        posNone: "Mindestens eine vollständige Position eintragen",
        insured: "Betrag in €, z. B. 7.106,40",
        art: "Artikelnummer: max. 6 Zeichen"
      }
    },
    en: {
      pageTitle: "Transport Order", formNoShort: "Form No.: FO 15-01",
      refresh: "Refresh", export: "Export (PDF)", date: "Date",
      docType: "Document", qty: "Qty", docNr: "Document no.",
      docHint: "Separate several numbers with commas, ranges with a hyphen (e.g. 150450-455). If one document is enclosed several times: enter one number and the quantity.",
      refPh: "Order number, 6–12 digits",
      d0: "Company *", d1: "Addition", d2: "Street and number *", d3: "Country / postcode / city *", d3Ph: "e.g. D 86473 Ziemetshausen",
      custNo: "Customer no.", custNoPh: "Customer no. + Enter",
      customers: "Master data", custSec: "Customers", artSec: "Items", bCust: "cust.", bArt: "items",
      amHelp: "Excel file (.xlsx) or CSV: A Item no. | B Description 1 DE | C Description 2 DE | D Description 1 EN | E Description 2 EN. The German or English description is used depending on the form language.",
      amUpload: "Upload item list", amDownload: "Download item list",
      amAdded: "<b>{n}</b> items added locally",
      naTitle: "Item not found", naText: "Item {n} is not in the item master data. Do you want to add this item?",
      naNoDb: "Note: no item master data is loaded at the moment.", naFormTitle: "Add new item {n}",
      naDe1: "Description 1 DE", naDe2: "Description 2 DE", naEn1: "Description 1 EN", naEn2: "Description 2 EN",
      naLocal: "The item is only added on this PC. Use “Master data → Download item list” to share the list with your team.",
      artSaved: "Item {n} added.", upDroppedArt: " {d} addition(s) are now part of the item master data.", amNone: "No item master data loaded yet.",
      amLoaded: "<b>{n}</b> items from <b>{f}</b>, loaded on {d}.", artUpOk: "{n} items loaded.",
      amClear: "Delete item data from this PC", amClearConfirm: "Really delete? Click again to confirm.",
      yes: "Yes", no: "No", save: "Save", close: "Close",
      ncTitle: "Customer not found",
      ncText: "Customer #{n} is not in the customer master data. Do you want to add this customer?",
      ncNoDb: "Note: no customer master data is loaded at the moment.",
      ncDbInfo: "{n} customers are loaded, e.g. {ex}.",
      ncSimilar: "Similar customer numbers – click to use:",
      ncPreview: "In the chat preview the customer list is lost as soon as the preview reloads. To test, download the HTML file and open it in your browser.",
      cmGuessContent: "(recognised by content)", cmGuessPos: "(by column position)", cmUnknown: "Not assigned:",
      cmCols: "Recognised columns:", cmColsPos: "No heading recognised – columns assigned by order A–G:",
      fld: { no: "Customer no.", name: "Company", extra: "Addition", street: "Street", zip: "Postcode", city: "City", country: "Country code", countryName: "Country" },
      ncFormTitle: "Add new customer #{n}",
      cName: "Company *", cExtra: "Addition", cStreet: "Street and number *", cCountry: "Country", cZip: "Postcode *", cCity: "City *",
      ncLocal: "The customer is only added on this PC. Use “Customers → Download” to share the list with your team.",
      cmHelp: "Excel file (.xlsx) or CSV, e.g. with the columns Kundennummer | Kundenname | Straße | PLZ | Ort | Länderkennzeichen | Land (optional: Zusatz). Columns are recognised by their heading. The data stays in the browser on this PC only and is not transmitted.",
      cmUpload: "Upload Excel", cmDownload: "Download customer list", cmTemplate: "Empty template",
      cmClear: "Delete all customer data from this PC", cmClearConfirm: "Really delete all customer data from this PC? Click again to confirm.",
      cmNone: "No customer master data loaded yet.",
      cmLoaded: "<b>{n}</b> customers from <b>{f}</b>, loaded on {d}.",
      cmAdded: "<b>{n}</b> customers added locally",
      cmAddedTitle: "Added locally (not in the Excel file):",
      cmNoStore: "Note: nothing is saved in this preview. The customer list is empty again after closing.",
      storeFail: "Saving in the browser is not possible – please check storage space or browser settings.",
      cmStored: "Saved in this browser and available again the next time you open the page.",
      upOk: "{n} customers loaded.", upKept: " {k} local addition(s) kept.", upDropped: " {d} addition(s) are now part of the master data.",
      upErrCols: "Columns not recognised. At least “Kundennummer” and “Kundenname” are required. Headings found: {h}",
      upErrXls: "The old Excel format (.xls) cannot be read. In Excel choose “Save as → Excel Workbook (.xlsx)”.",
      upErrEmpty: "No customers found in the file.", upErr: "File could not be read: ",
      stFound: "✓ Taken from customer master data", stFoundLocal: "✓ Taken from locally added customers",
      stEdited: "Address changed: applies to this order only, the customer master data stays unchanged.",
      stUnknown: "Customer no. not in master data",
      custSaved: "Customer #{n} added.", cleared2: "Customer data deleted.",
      hdr: ["Kundennummer", "Kundenname", "Straße", "PLZ", "Ort", "Länderkennzeichen", "Land", "Zusatz"],
      positions: "Items", posHint: "Weight = gross weight per item. Dimensions per unit in cm, optional for boxes.",
      qtyPh: "Qty", unitType: "Type", weightKg: "Gross (kg)", artNo: "Item no.", desc1: "Description 1", desc2: "Description 2",
      artUnknown: "Item no. not in the item master data – please enter the description by hand.",
      artNoDb: "No item master data loaded – please enter the description by hand or upload the item list under “Master data”.",
      artNoLang: "There is no English description for this item – German description used.", dimL: "L", dimB: "W", dimH: "H", addPos: "Item",
      insuredPh: "e.g. 7,106.40",
      pickupNote: "“Pallets exchanged”, date and signature are filled in by hand by the shipping department at pickup. These fields stay empty in the export.",
      confirmTitle: "Clear all entries?", confirmText: "The form will be emptied completely. This cannot be undone.",
      cancel: "Cancel", confirmYes: "Yes, clear",
      errTitle: "Export not possible – please check:",
      choose: "Please select", del: "Delete item",
      totalWeight: "Total weight", volume: "Volume",
      cleared: "Form cleared.", exported: "Export created: ", exportFail: "Export failed: ",
      senderOpts: { kg: "Kläger GmbH – Neusäß", as: "Andreas Schmid Kontraktlogistik – Gersthofen" },
      sec: { agent: "Shipping Agent", docs: "Documents", ref: "Reference", dest: "Destination", pos: "Item", insured: "Insured value" },
      e: {
        required: "Required",
        ref: "Order number: 6–12 digits",
        docQty: "Whole number from 1 to 999",
        docNr: "Each number 6–18 characters (digits, letters, - / .)",
        docNrMissing: "Document no. missing",
        docQtyMissing: "Quantity missing",
        docsNone: "Enter at least one document with quantity and number",
        qty: "Qty: whole number 1–999",
        type: "Select type",
        weight: "Weight: whole number 1–999,999,999 kg",
        dim: "Dimensions: whole numbers 1–999 cm",
        dimMissing: "L × W × H missing",
        qtyMissing: "Quantity missing",
        weightMissing: "Weight missing",
        posNone: "Enter at least one complete item",
        insured: "Amount in €, e.g. 7,106.40",
        art: "Item no.: max. 6 characters"
      }
    }
  };

  var CARRIERS = [
    { k: "own", de: "Eigene Spedition", en: "Own Carrier" },
    { k: "dsv", de: "DSV", en: "DSV" },
    { k: "schmid", de: "Schmid", en: "Schmid" },
    { k: "hellmann", de: "Hellmann", en: "Hellmann" },
    { k: "spedicam", de: "SPEDICAM", en: "SPEDICAM" },
    { k: "dachser", de: "Dachser", en: "Dachser" },
    { k: "unknown", de: "Unbekannt", en: "Unknown" }
  ];
  var DOCS = [
    { k: "ls", de: ["Lieferschein", "Lieferscheine"], en: ["Delivery Note", "Delivery Notes"] },
    { k: "re", de: ["Rechnung", "Rechnungen"], en: ["Invoice", "Invoices"] },
    { k: "abd", de: ["ABD", "ABD"], en: ["ABD", "ABD"] },
    { k: "atr", de: ["A.TR.", "A.TR."], en: ["A.TR.", "A.TR."] }
  ];
  var UNIT_TYPES = ["EURO", "EWP", "IPPC", "BOX"];
  var SENDERS = {
    kg: ["Kläger GmbH", "TOR 2", "Portnerstraße 84", "D 86356 Neusäß"],
    as: ["Andreas Schmid Kontraktlogistik", "Lager Kläger Halle 8", "Daimlerstraße 11", "D 86368 Gersthofen"]
  };

  /* ---------- Zustand ---------- */
  var state, lang = "de", touched = {}, showAll = false;

  function emptyPos() { return { qty: "", type: "", art: "", d1: "", d2: "", weight: "", l: "", b: "", h: "", artLoaded: null }; }
  function emptyState() {
    var docs = {};
    DOCS.forEach(function (d) { docs[d.k] = { qty: "", nr: "" }; });
    return {
      agent: "", docs: docs, ref: "", sender: "kg",
      custNo: "", custLoaded: null,
      dest: ["", "", "", ""], pos: [emptyPos()],
      freight: "", insured: "", shipped: "", special: ""
    };
  }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function t(k) { return UI[lang][k]; }
  function L() { return A.labels[lang]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Zahlen ---------- */
  function isInt(v, min, max) { return /^\d+$/.test(v) && +v >= min && +v <= max; }
  function cleanInt(v) { return String(v).replace(/[.\s,']/g, ""); }
  function parseMoney(v) {
    v = String(v).trim().replace(/\s|€/g, "");
    if (!v) return null;
    if (v.indexOf(",") >= 0) v = v.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(v)) return NaN;
    return Math.round(parseFloat(v) * 100) / 100;
  }
  function nf(n, dec) {
    return new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-GB", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
  }
  function plural(def, n) { return def[lang][(+n > 1) ? 1 : 0]; }
  function unitLabel(type, qty, lg) {
    lg = lg || lang;
    if (type !== "BOX") return type;
    var lb = A.labels[lg];
    return (+qty > 1) ? lb.cartonN : lb.carton1;
  }
  function unitOptionLabel(type) { return type === "BOX" ? A.labels[lang].carton1 : type; }

  /* ---------- Berechnungen ---------- */
  function posStarted(p) { return ["qty", "type", "art", "d1", "d2", "weight", "l", "b", "h"].some(function (k) { return String(p[k]).trim() !== ""; }); }
  function totals() {
    var r = { EURO: 0, EWP: 0, IPPC: 0, BOX: 0, weight: 0, volume: 0 };
    state.pos.forEach(function (p) {
      var q = isInt(cleanInt(p.qty), 1, 999) ? +cleanInt(p.qty) : 0;
      if (p.type && q) r[p.type] += q;
      if (isInt(cleanInt(p.weight), 1, 999999999)) r.weight += +cleanInt(p.weight);
      if (q && isInt(p.l, 1, 999) && isInt(p.b, 1, 999) && isInt(p.h, 1, 999)) r.volume += q * p.l * p.b * p.h / 1e6;
    });
    return r;
  }

  /* ---------- Prüfung ---------- */
  function validate() {
    var e = UI[lang].e, S = UI[lang].sec, errs = [], fields = {};
    function add(id, msg, label) { fields[id] = msg; errs.push({ id: id, text: label + ": " + msg }); }

    if (!state.agent) add("f-agent", e.required, S.agent);

    var anyDoc = false;
    DOCS.forEach(function (d) {
      var v = state.docs[d.k], q = cleanInt(v.qty), nr = v.nr.trim(), lab = S.docs + " – " + d[lang][0];
      if (!q && !nr) return;
      var ok = true;
      if (!q) { add("doc-qty-" + d.k, e.docQtyMissing, lab); ok = false; }
      else if (!isInt(q, 1, 999)) { add("doc-qty-" + d.k, e.docQty, lab); ok = false; }
      if (!nr) { add("doc-nr-" + d.k, e.docNrMissing, lab); ok = false; }
      else if (!nr.split(",").every(function (x) { x = x.trim(); return x.length >= 6 && x.length <= 18 && /^[A-Za-z0-9\-\/. ]+$/.test(x); })) { add("doc-nr-" + d.k, e.docNr, lab); ok = false; }
      if (ok) anyDoc = true;
    });
    if (!anyDoc && !DOCS.some(function (d) { return fields["doc-qty-" + d.k] || fields["doc-nr-" + d.k]; })) {
      fields["msg-docs"] = e.docsNone; errs.push({ id: "doc-qty-ls", text: S.docs + ": " + e.docsNone });
    }

    if (!state.ref) add("f-ref", e.required, S.ref);
    else if (!/^\d{6,12}$/.test(state.ref)) add("f-ref", e.ref, S.ref);

    [0, 2, 3].forEach(function (i) { if (!state.dest[i].trim()) add("f-dest" + i, e.required, S.dest + " – " + UI[lang]["d" + i].replace(" *", "")); });

    var complete = 0;
    state.pos.forEach(function (p, i) {
      if (!posStarted(p)) return;
      var lab = S.pos + " " + (i + 1), rowErr = [], ok = true;
      var q = cleanInt(p.qty), w = cleanInt(p.weight);
      if (!q) { fields["p-qty-" + i] = 1; rowErr.push(e.qtyMissing); ok = false; }
      else if (!isInt(q, 1, 999)) { fields["p-qty-" + i] = 1; rowErr.push(e.qty); ok = false; }
      if (!p.type) { fields["p-type-" + i] = 1; rowErr.push(e.type); ok = false; }
      if (p.art.length > 6) { fields["p-art-" + i] = 1; rowErr.push(e.art); ok = false; }
      if (!w) { fields["p-weight-" + i] = 1; rowErr.push(e.weightMissing); ok = false; }
      else if (!isInt(w, 1, 999999999)) { fields["p-weight-" + i] = 1; rowErr.push(e.weight); ok = false; }
      var dims = ["l", "b", "h"], anyDim = dims.some(function (k) { return p[k] !== ""; });
      var dimsRequired = p.type !== "BOX";
      if (dimsRequired || anyDim) {
        var missing = dims.filter(function (k) { return p[k] === ""; });
        var bad = dims.filter(function (k) { return p[k] !== "" && !isInt(p[k], 1, 999); });
        if (missing.length) { missing.forEach(function (k) { fields["p-" + k + "-" + i] = 1; }); rowErr.push(e.dimMissing); ok = false; }
        if (bad.length) { bad.forEach(function (k) { fields["p-" + k + "-" + i] = 1; }); rowErr.push(e.dim); ok = false; }
      }
      if (rowErr.length) { fields["row-" + i] = rowErr.join(" · "); errs.push({ id: firstBad(i, fields), text: lab + ": " + rowErr.join(", ") }); }
      if (ok) complete++;
    });
    if (!complete && !state.pos.some(function (p, i) { return fields["row-" + i]; })) {
      fields["msg-pos"] = e.posNone; errs.push({ id: "p-qty-0", text: e.posNone });
      ["qty", "type", "weight"].forEach(function (k) { fields["p-" + k + "-0"] = 1; });
    }

    if (state.insured.trim()) {
      var m = parseMoney(state.insured);
      if (m === null || isNaN(m)) add("f-insured", e.insured, S.insured);
    }
    return { errs: errs, fields: fields };
  }
  function firstBad(i, f) {
    var ks = ["qty", "type", "weight", "l", "b", "h"];
    for (var j = 0; j < ks.length; j++) if (f["p-" + ks[j] + "-" + i]) return "p-" + ks[j] + "-" + i;
    return "p-qty-" + i;
  }

  function paintErrors() {
    var res = validate(), f = res.fields;
    $$("[id^='f-'], [id^='doc-'], [id^='p-']").forEach(function (el) {
      var show = f[el.id] && (showAll || touched[el.id] || touchedRow(el.id));
      el.classList.toggle("invalid", !!show);
      var msg = el.parentElement.querySelector(".msg") || (el.closest(".field") && el.closest(".field").querySelector(".msg"));
      if (msg && typeof f[el.id] === "string") msg.textContent = show ? f[el.id] : "";
      var fld = el.closest(".money"); if (fld) fld.classList.toggle("has-err", !!show);
    });
    DOCS.forEach(function (d) {
      var q = "doc-qty-" + d.k, n = "doc-nr-" + d.k, rowT = showAll || touched[q] || touched[n];
      var parts = [f[q], f[n]].filter(function (x) { return typeof x === "string"; });
      [q, n].forEach(function (id) { $("#" + id).classList.toggle("invalid", !!(f[id] && rowT)); });
      var m = $("#" + n).parentElement.querySelector(".msg");
      m.textContent = rowT ? parts.join(" · ") : "";
      m.classList.toggle("show", !!(rowT && parts.length));
    });
    state.pos.forEach(function (p, i) {
      var rm = $("#rowmsg-" + i);
      if (!rm) return;
      var show = f["row-" + i] && (showAll || rowTouched(i));
      rm.hidden = !show;
      rm.querySelector(".msg").textContent = show ? f["row-" + i] : "";
    });
    ["msg-docs", "msg-pos"].forEach(function (id) {
      var on = !!(showAll && f[id]), el = $("#" + id);
      el.textContent = on ? f[id] : ""; el.classList.toggle("show", on);
    });
    if (showAll) {
      if (res.errs.length) renderErrorList(res.errs); else $("#errorPanel").hidden = true;
    }
    return res;
  }
  function touchedRow(id) { var m = /^p-\w+-(\d+)$/.exec(id); return m ? rowTouched(+m[1]) : false; }
  function rowTouched(i) { return Object.keys(touched).some(function (k) { return new RegExp("^p-\\w+-" + i + "$").test(k); }); }
  function renderErrorList(errs) {
    var ul = $("#errorList");
    ul.innerHTML = errs.map(function (x) { return '<li data-target="' + x.id + '">' + esc(x.text) + "</li>"; }).join("");
    $("#errorPanel").hidden = false;
  }

  /* ---------- Darstellung ---------- */
  function renderStatic() {
    document.documentElement.lang = lang;
    document.title = (lang === "de" ? "Speditionsauftrag" : "Transport Order") + " | Kläger";
    $$("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      var v = UI[lang][k] !== undefined ? UI[lang][k] : L()[k];
      if (v !== undefined) el.textContent = v;
    });
    $$("[data-i18n-ph]").forEach(function (el) { el.placeholder = UI[lang][el.getAttribute("data-i18n-ph")]; });
    $$(".lang-switch button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    $("#today").textContent = fmtDate(new Date());

    var ag = $("#f-agent");
    ag.innerHTML = '<option value="">' + esc(t("choose")) + "</option>" + CARRIERS.map(function (c) { return '<option value="' + c.k + '">' + esc(c[lang]) + "</option>"; }).join("");
    ag.value = state.agent;
    var sd = $("#f-sender");
    sd.innerHTML = Object.keys(SENDERS).map(function (k) { return '<option value="' + k + '">' + esc(t("senderOpts")[k]) + "</option>"; }).join("");
    sd.value = state.sender;
    renderSender();
    renderCustStatus(); renderCustBadge();
    renderDocs();
    renderPositions();
    $$("[data-field]").forEach(function (el) {
      var f = el.dataset.field;
      if (f === "agent" || f === "sender") return;
      if (f === "custNo") { el.value = state.custNo; return; }
      if (/^dest\d$/.test(f)) el.value = state.dest[+f.slice(4)];
      else el.value = state[f];
    });
  }
  function fmtDate(d) {
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return p(d.getDate()) + "." + p(d.getMonth() + 1) + "." + d.getFullYear();
  }
  function renderSender() {
    var s = SENDERS[state.sender].map(esc);
    $("#senderPreview").innerHTML = s.slice(0, 3).join("<br>") + "<br><br>" + s[3];
  }
  // Anordnung: links Lieferschein/Rechnung, rechts ABD/A.TR. (Raster spaltenweise gefüllt)
  var DOC_ORDER = ["ls", "re", "abd", "atr"];
  function renderDocs() {
    $("#docsBody").innerHTML = DOC_ORDER.map(function (k) {
      var d = DOCS.filter(function (x) { return x.k === k; })[0], v = state.docs[k];
      return '<div class="doc-cell"><div class="doc-lab" id="doc-lab-' + k + '">' + esc(plural(d, cleanInt(v.qty))) + "</div>" +
        '<div class="doc-inputs"><input class="qty" id="doc-qty-' + k + '" data-doc="' + k + '" data-dk="qty" inputmode="numeric" maxlength="3" autocomplete="off" value="' + esc(v.qty) + '" aria-label="' + esc(t("qty")) + '" placeholder="' + esc(t("qtyPh")) + '">' +
        '<input id="doc-nr-' + k + '" data-doc="' + k + '" data-dk="nr" maxlength="60" autocomplete="off" value="' + esc(v.nr) + '" aria-label="' + esc(t("docNr")) + '" placeholder="' + esc(t("docNr")) + '"><em class="msg"></em></div></div>';
    }).join("");
  }
  function renderPositions() {
    var opts = function (sel) {
      return '<option value="">–</option>' + UNIT_TYPES.map(function (u) { return '<option value="' + u + '"' + (u === sel ? " selected" : "") + ">" + esc(unitOptionLabel(u)) + "</option>"; }).join("");
    };
    var html = state.pos.map(function (p, i) {
      var inp = function (k, cls, max, mode) {
        return '<input id="p-' + k + "-" + i + '" data-pos="' + i + '" data-pk="' + k + '" class="' + cls + '" maxlength="' + max + '" inputmode="' + mode + '" autocomplete="off" value="' + esc(p[k]) + '">';
      };
      return '<tr><td class="c-n">' + (i + 1) + "</td>" +
        "<td>" + inp("qty", "", 3, "numeric") + "</td>" +
        '<td><select id="p-type-' + i + '" data-pos="' + i + '" data-pk="type">' + opts(p.type) + "</select></td>" +
        '<td class="c-art">' + inp("art", "art", 6, "text") + "</td>" +
        '<td class="c-desc">' + inp("d1", "", 40, "text") + "</td>" +
        '<td class="c-desc">' + inp("d2", "", 40, "text") + "</td>" +
        "<td>" + inp("weight", "num", 11, "numeric") + "</td>" +
        "<td>" + inp("l", "", 3, "numeric") + "</td>" +
        "<td>" + inp("b", "", 3, "numeric") + "</td>" +
        "<td>" + inp("h", "", 3, "numeric") + "</td>" +
        '<td><button type="button" class="del" data-del="' + i + '" title="' + esc(t("del")) + '" aria-label="' + esc(t("del")) + '"' + (state.pos.length === 1 ? " disabled" : "") + ">×</button></td></tr>" +
        '<tr class="row-msg" id="rowmsg-' + i + '" hidden><td colspan="11"><em class="msg"></em></td></tr>' +
        '<tr class="row-hint" id="rowhint-' + i + '"' + (p.artHint ? "" : " hidden") + '><td colspan="11"><em class="art-hint">' + esc(p.artHint ? t(p.artHint) : "") + "</em></td></tr>";
    }).join("");
    $("#posBody").innerHTML = html;
    $("#btnAddPos").disabled = state.pos.length >= MAX_POS;
    $("#posCount").textContent = "(" + state.pos.length + "/" + MAX_POS + ")";
    renderTotals();
  }
  // Nur Packstückarten mit Summe > 0, in fester Reihenfolge
  function unitTotals(r, lg) {
    var lb = A.labels[lg || lang];
    return UNIT_TYPES.filter(function (k) { return r[k] > 0; }).map(function (k) {
      return { key: k, qty: r[k], label: k === "BOX" ? (r.BOX === 1 ? lb.carton1 : lb.cartonN) : k };
    });
  }
  function renderTotals() {
    var r = totals(), lb = L();
    var chips = unitTotals(r).map(function (u) { return '<span class="chip">' + esc(u.label) + " <b>" + u.qty + "</b></span>"; });
    chips.push('<span class="chip strong">' + esc(t("totalWeight")) + " <b>" + nf(r.weight, 0) + " kg</b></span>");
    chips.push('<span class="chip strong">' + esc(t("volume")) + " <b>" + nf(r.volume, 3) + " m³</b></span>");
    $("#totals").innerHTML = chips.join("");
  }

  /* ---------- Ereignisse ---------- */
  function onInput(ev) {
    var el = ev.target;
    if (el.dataset.field) {
      var f = el.dataset.field;
      if (f === "ref") { el.value = el.value.replace(/\D/g, "").slice(0, 12); }
      if (f === "custNo") {
        el.value = el.value.replace(/^#+/, "");
        if (normNo(el.value) !== normNo(state.custNo)) {
          // Adresse des vorher geladenen Kunden entfernen, solange sie nicht von Hand geändert wurde
          if (state.custLoaded && state.custLoaded.dest.every(function (v, i) { return v === state.dest[i]; })) {
            state.dest = ["", "", "", ""]; state.destFromCust = false;
            state.dest.forEach(function (v, i) { $("#f-dest" + i).value = ""; });
          }
          state.custLoaded = null; state.custChecked = null;
        }
        state.custNo = el.value; renderCustStatus();
        if (ev.type === "change") lookupCustomer();
        paintErrors(); return;
      }
      if (/^dest\d$/.test(f)) { state.dest[+f.slice(4)] = el.value; renderCustStatus(); }
      else state[f] = el.value;
      if (f === "sender") renderSender();
    } else if (el.dataset.doc) {
      if (el.dataset.dk === "qty") el.value = el.value.replace(/\D/g, "");
      state.docs[el.dataset.doc][el.dataset.dk] = el.value;
      var d = DOCS.filter(function (x) { return x.k === el.dataset.doc; })[0];
      $("#doc-lab-" + d.k).textContent = plural(d, cleanInt(state.docs[d.k].qty));
    } else if (el.dataset.pos !== undefined) {
      var k = el.dataset.pk;
      if (k === "qty" || k === "l" || k === "b" || k === "h") el.value = el.value.replace(/\D/g, "");
      if (k === "weight") el.value = el.value.replace(/[^\d.]/g, "");
      if (k === "art") el.value = el.value.replace(/\s+/g, "").toUpperCase();
      var pp = state.pos[+el.dataset.pos];
      pp[k] = el.value;
      if (k === "art" && pp.artLoaded && keyNo(el.value) !== pp.artLoaded.key) clearArticle(+el.dataset.pos);
      if (k === "art" && ev.type === "change") lookupArticle(+el.dataset.pos);
      // Bezeichnung von Hand eingetragen -> Hinweis "nicht im Artikelstamm" ausblenden
      if ((k === "d1" || k === "d2") && el.value.trim() && /^art(Unknown|NoDb)$/.test(pp.artHint || "")) setRowHint(+el.dataset.pos, "");
      renderTotals();
    }
    if (ev.type === "change") touched[el.id] = true;
    paintErrors();
  }
  function onBlur(ev) {
    var el = ev.target;
    if (!el.id || !(el.dataset.field || el.dataset.doc || el.dataset.pos !== undefined)) return;
    if (el.dataset.pk === "weight" && el.value) {
      var n = cleanInt(el.value);
      if (/^\d+$/.test(n)) { el.value = n; state.pos[+el.dataset.pos].weight = n; }
    }
    touched[el.id] = true;
    paintErrors();
  }

  function setLang(lg) {
    if (lg === lang) return;
    lang = lg;
    try { localStorage.setItem("sa-lang", lg); } catch (e) { /* egal */ }
    relabelArticles();
    renderStatic();
    if (!$("#errorPanel").hidden) { showAll = true; }
    paintErrors();
  }

  function reset() {
    state = emptyState(); touched = {}; showAll = false;
    renderCustStatus();
    $("#errorPanel").hidden = true;
    renderStatic(); paintErrors();
    toast(t("cleared"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  var toastTimer;
  function toast(msg) {
    var el = $("#toast"); el.textContent = msg; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 3200);
  }

  function tryExport() {
    showAll = true;
    var res = paintErrors();
    if (res.errs.length) {
      $("#errorPanel").scrollIntoView({ behavior: "smooth", block: "start" });
      return false;
    }
    $("#errorPanel").hidden = true;
    return true;
  }

  /* ---------- Export-Daten (gemeinsam für Excel und PDF) ---------- */
  function exportData() {
    var lb = L(), docs = [], pos = [];
    DOCS.forEach(function (d) {
      var v = state.docs[d.k], q = cleanInt(v.qty);
      if (q && v.nr.trim()) docs.push({ k: d.k, qty: +q, type: plural(d, q), nr: v.nr.split(",").map(function (s) { return s.trim(); }).filter(Boolean).join(", ") });
    });
    state.pos.forEach(function (p) {
      if (!posStarted(p)) return;
      pos.push({
        qty: +cleanInt(p.qty), type: unitLabel(p.type, cleanInt(p.qty)), rawType: p.type, art: p.art.trim(), d1: p.d1.trim(), d2: p.d2.trim(),
        weight: +cleanInt(p.weight),
        l: p.l ? +p.l : null, b: p.b ? +p.b : null, h: p.h ? +p.h : null
      });
    });
    var c = CARRIERS.filter(function (x) { return x.k === state.agent; })[0];
    return {
      lang: lang, lb: lb, date: new Date(),
      agent: c ? c[lang] : "", docs: docs, ref: state.ref,
      sender: addrLines(SENDERS[state.sender]), dest: addrLines(state.dest),
      custNo: normNo(state.custNo),
      pos: pos, tot: totals(),
      freight: state.freight.trim(), insured: state.insured.trim() ? parseMoney(state.insured) : null,
      shipped: state.shipped.trim(), special: state.special.trim()
    };
  }
  // [Firma, Zusatz, Straße, Land/PLZ/Ort] -> Ausgabezeilen; ohne Zusatz rückt die Straße in die Zusatzzeile
  function addrLines(a) {
    var v = a.map(function (x) { return String(x || "").trim(); });
    return v[1] ? v : [v[0], v[2], "", v[3]];
  }
  // Dateiname: Speditionsauftrag_<Referenz>.pdf bzw. Transport_Order_<Referenz>.pdf
  function fileBase(d) {
    return (lang === "de" ? "Speditionsauftrag" : "Transport_Order") + "_" + String(d.ref || "").replace(/[^\w-]/g, "");
  }

  function download(blob, name) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }

  /* ---------- PDF ---------- */
  function exportPdf() {
    var d = exportData(), lb = d.lb;
    var pdf = new window.jspdf.jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    var X0 = 18, X1 = 192, XM = 104, W = X1 - X0;
    pdf.setLineWidth(0.2); pdf.setDrawColor(0); pdf.setTextColor(0);
    function font(size, bold) { pdf.setFont("helvetica", bold ? "bold" : "normal"); pdf.setFontSize(size); }
    function txt(s, x, y, o) {
      o = o || {}; if (s === null || s === undefined || s === "") return;
      font(o.size || 7, o.bold);
      s = String(s);
      if (o.maxW) {
        var size = o.size || 7;
        while (pdf.getTextWidth(s) > o.maxW && size > 5) { size -= 0.25; font(size, o.bold); }
        if (pdf.getTextWidth(s) > o.maxW) { while (s.length > 1 && pdf.getTextWidth(s + "…") > o.maxW) s = s.slice(0, -1); s += "…"; }
      }
      pdf.text(s, x, y, { align: o.align || "left", baseline: "middle" });
    }
    function rect(x, y, w, h) { pdf.rect(x, y, w, h); }
    function line(x1, y1, x2, y2) { pdf.line(x1, y1, x2, y2); }
    function dline(x1, y, x2) { line(x1, y - 0.35, x2, y - 0.35); line(x1, y + 0.35, x2, y + 0.35); }

    // Kopf
    txt(lb.formNo, X0, 12);
    txt(lb.title, 105, 17, { size: 16, bold: true, align: "center" });
    pdf.addImage(A.logo, "PNG", X1 - 38, 7, 38, 38 * 212 / 536);
    txt(fmtDate(d.date), X1 - 1, 30, { align: "right" });

    // Abholung / Beilagen
    var y = 33, hb = 5 + 2 * 4 + 1;
    rect(X0, y, XM - X0, hb); rect(XM, y, X1 - XM, hb);
    txt(lb.agent, X0 + 1, y + 2.5, { bold: true });
    txt(lb.docs, XM + 1, y + 2.5, { bold: true });
    txt(d.agent, X0 + 1, y + 7, { maxW: XM - X0 - 2 });
    // links Lieferschein/Rechnung, rechts ABD/A.TR.
    // Rechter Block so weit links, dass eine 18-stellige ABD-Nummer unskaliert passt
    var DPOS = { ls: [0, 0], re: [0, 1], abd: [1, 0], atr: [1, 1] }, XR = XM + 45;
    d.docs.forEach(function (x) {
      var pz = DPOS[x.k], yy = y + 7 + pz[1] * 4;
      if (pz[0] === 0) {
        txt(x.qty, XM + 5, yy, { align: "right" });
        txt(x.type, XM + 7, yy, { maxW: 15 });
        txt(x.nr, XM + 24, yy, { maxW: XR - XM - 26 });
      } else {
        txt(x.qty, XR + 4, yy, { align: "right" });
        txt(x.type, XR + 6, yy, { maxW: 7 });
        txt(x.nr, XR + 13.5, yy, { maxW: X1 - XR - 14.5 });
      }
    });
    y += hb;

    txt(lb.intro, X0 + 1, y + 4);
    y += 7;
    rect(X0, y, XM - X0, 6); rect(XM, y, X1 - XM, 6);
    txt(lb.ref, X0 + 1, y + 3, { bold: true });
    txt(d.ref, (XM + X1) / 2, y + 3, { align: "center", size: 8 });
    y += 9;

    // Adressen
    var ha = 5 + 5 * 4.6, XT = X0 + 36;
    rect(X0, y, XM - X0, ha); rect(XM, y, X1 - XM, ha);
    txt(lb.sender, X0 + 1, y + 2.6, { bold: true });
    txt(lb.times, XT, y + 2.6, { bold: true });
    txt(lb.dest, XM + 1, y + 2.6, { bold: true });
    var ly = function (i) { return y + 7.4 + i * 4.6; };
    [0, 1, 2].forEach(function (i) { txt(d.sender[i], X0 + 1, ly(i), { maxW: XT - X0 - 3 }); });
    txt(d.sender[3], X0 + 1, ly(4), { maxW: XT - X0 - 3 });
    font(7, false);
    [[lb.monThu, 0], [lb.fri, 2]].forEach(function (a) {
      txt(a[0], XT, ly(a[1]));
      var w = pdf.getTextWidth(a[0]); line(XT, ly(a[1]) + 1.2, XT + w, ly(a[1]) + 1.2);
    });
    txt(lb.t1, XT + 14, ly(0)); txt(lb.t2, XT + 14, ly(1)); txt(lb.t3, XT + 14, ly(2));
    var cw = 0;
    // Kundennummer rechtsbündig in der Überschriftenzeile „Empfangsadresse“
    if (d.custNo) txt("#" + d.custNo, X1 - 1, y + 2.6, { align: "right", bold: true });
    [0, 1, 2].forEach(function (i) { txt(d.dest[i], XM + 1, ly(i), { maxW: X1 - XM - 2 - (i === 0 ? cw : 0) }); });
    txt(d.dest[3], XM + 1, ly(4), { maxW: X1 - XM - 2 });
    y += ha + 3;

    // Positionen
    var cx = [X0, X0 + 32, X0 + 122, X0 + 143, X1], rh = 4, hh = 9, nb = MAX_POS, nt = 4;
    var top = y, bodyTop = y + hh, totTop = bodyTop + nb * rh, bottom = totTop + nt * rh;
    rect(X0, top, W, bottom - top);
    [1, 2, 3].forEach(function (i) { line(cx[i], top, cx[i], bottom); });
    line(X0, bodyTop, X1, bodyTop);
    dline(X0, totTop, X1);
    txt(lb.units, X0 + 1, top + 2.5, { bold: true });
    txt(lb.cargo, cx[1] + 1, top + 2.5, { bold: true });
    var ca = cx[1] + 15, cw2 = (cx[2] - ca) / 2, cb = ca + cw2;
    txt(lb.artNo, cx[1] + 1, top + 6.5); txt(lb.desc1, ca + 1, top + 6.5); txt(lb.desc2, cb + 1, top + 6.5);
    [ca, cb].forEach(function (x) { pdf.setDrawColor(150); line(x, top + 4.6, x, totTop); pdf.setDrawColor(0); });
    txt(lb.weight, cx[2] + 1, top + 2.5, { bold: true, maxW: cx[3] - cx[2] - 2 });
    txt(lb.dims, cx[3] + 1, top + 2.5, { bold: true });
    var dw = (X1 - cx[3]) / 3;
    [lb.dimL, lb.dimB, lb.dimH].forEach(function (s, j) { txt(s, cx[3] + dw * j + dw / 2, top + 6.5, { align: "center" }); });
    d.pos.forEach(function (p, i) {
      var yy = bodyTop + rh * i + rh / 2;
      txt(p.qty, X0 + 5, yy, { align: "right" });
      txt(p.type, X0 + 7, yy, { maxW: 24 });
      txt(p.art, cx[1] + 1, yy, { maxW: ca - cx[1] - 2 });
      txt(p.d1, ca + 1, yy, { maxW: cw2 - 2 });
      txt(p.d2, cb + 1, yy, { maxW: cw2 - 2 });
      txt(nf(p.weight, 0) + " kg", cx[3] - 1.5, yy, { align: "right" });
      [p.l, p.b, p.h].forEach(function (v, j) { if (v) txt(v, cx[3] + dw * j + dw / 2, yy, { align: "center" }); });
    });
    var tl = unitTotals(d.tot).map(function (u) { return [u.label, u.qty]; });
    tl.forEach(function (a, i) {
      var yy = totTop + rh * i + rh / 2 + 0.3;
      txt(a[1], X0 + 5, yy, { align: "right", bold: true });
      txt(a[0], X0 + 7, yy, { bold: true });
    });
    txt(nf(d.tot.weight, 0) + " kg", cx[3] - 1.5, totTop + rh / 2 + 0.3, { align: "right", bold: true });
    var vt = nf(d.tot.volume, 3) + " m", vy = totTop + rh / 2 + 0.3;
    font(7, true); var vw = pdf.getTextWidth(vt) + 1.2, vx = (cx[3] + X1) / 2 - vw / 2;
    txt(vt, vx, vy, { bold: true });
    txt("3", vx + vw - 1.1, vy - 0.9, { bold: true, size: 4.5 });
    y = bottom + 3;

    // Frankatur / Versicherungswert / Beförderungsart
    function boxField(x, w, label, value, h) {
      rect(x, y, w, h);
      txt(label, x + 1, y + 2.6, { bold: true });
      if (!value) return;
      font(7, false);
      var lines = pdf.splitTextToSize(String(value), w - 2);
      var max = Math.floor((h - 5) / 3) || 1;
      if (lines.length > max) { lines = lines.slice(0, max); lines[max - 1] = lines[max - 1].replace(/.?$/, "…"); }
      lines.forEach(function (s, i) { pdf.text(s, x + 1, y + 7.2 + i * 3, { baseline: "middle" }); });
    }
    boxField(X0, W, lb.freight, d.freight, 10); y += 10;
    var ins = d.insured !== null ? new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(d.insured) + " €" : "";
    boxField(X0, W, lb.insured, ins, 10); y += 10;
    boxField(X0, XM - X0, lb.shipped, d.shipped, 14);
    boxField(XM, X1 - XM, lb.special, d.special, 14);
    y += 14 + 10;

    // Unterer Teil (wird bei Abholung von Hand ausgefüllt)
    txt(lb.pallets, X0 + 1, y, { bold: true });
    txt(lb.accepted, XM + 1, y, { bold: true });
    rect(X0 + 0.5, y + 4, 4, 4); txt(lb.yes, X0 + 7, y + 6);
    rect(X0 + 0.5, y + 11, 4, 4); txt(lb.no, X0 + 7, y + 13);
    var ys = y + 26;
    line(XM, ys, XM + 38, ys); line(XM + 46, ys, X1, ys);
    txt(lb.sigDate, XM + 19, ys + 2.5, { bold: true, align: "center" });
    txt(lb.sig, (XM + 46 + X1) / 2, ys + 2.5, { bold: true, align: "center" });

    // Fußzeile (Firmendaten)
    var fw = W, fh = fw * 183 / 1432;
    pdf.addImage(A.footer, "PNG", X0, 297 - 8 - fh, fw, fh);

    pdf.setProperties({ title: lb.title + (d.ref ? " " + d.ref : ""), creator: "Kläger Speditionsauftrag" });
    var name = fileBase(d) + ".pdf";
    download(pdf.output("blob"), name);
    return Promise.resolve(name);
  }

  /* ---------- Kundenstamm ----------
     Der hochgeladene Kundenstamm ("master") ist fix und wird nie durch Formulareingaben verändert.
     Neue Kunden aus dem Popup landen getrennt in "added". Alles liegt nur lokal im Browser. */
  var DB_KEY = "sa-kunden-v1";
  var NO_STORE = !!window.SA_NO_STORAGE;
  var db = { master: {}, added: {}, meta: null };
  var dbIndex = {};

  function normNo(v) { return String(v == null ? "" : v).replace(/^#+/, "").replace(/\s+/g, "").toUpperCase(); }
  // Vergleichsschlüssel: nur Buchstaben/Ziffern, ".0" aus Excel-Zahlen und führende Nullen ignorieren
  function keyNo(v) {
    var n = normNo(v).replace(/\.0+$/, "").replace(/[^A-Z0-9]/g, "");
    return /^\d+$/.test(n) ? n.replace(/^0+(?=\d)/, "") : n;
  }
  function tpl(str, o) { return str.replace(/\{(\w+)\}/g, function (_, k) { return o[k] !== undefined ? o[k] : ""; }); }


  /* ---------- Dauerhafter Speicher im Browser ----------
     IndexedDB bietet deutlich mehr Platz als localStorage (große Kundenlisten).
     Fällt IndexedDB aus, wird localStorage verwendet. */
  var IDB_NAME = "speditionsauftrag", IDB_STORE = "stammdaten", idbPromise = null;
  function idb() {
    if (idbPromise) return idbPromise;
    idbPromise = new Promise(function (res, rej) {
      try {
        if (!window.indexedDB) { rej(new Error("kein IndexedDB")); return; }
        var rq = indexedDB.open(IDB_NAME, 1);
        rq.onupgradeneeded = function () { rq.result.createObjectStore(IDB_STORE); };
        rq.onsuccess = function () { res(rq.result); };
        rq.onerror = function () { rej(rq.error); };
      } catch (e) { rej(e); }
    });
    return idbPromise;
  }
  function storeGet(key) {
    if (NO_STORE) return Promise.resolve(null);
    return idb().then(function (dbh) {
      return new Promise(function (res, rej) {
        var rq = dbh.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(key);
        rq.onsuccess = function () { res(rq.result == null ? null : rq.result); };
        rq.onerror = function () { rej(rq.error); };
      });
    }).then(function (v) {
      if (v != null) return v;
      // Übernahme aus älterer Version (localStorage)
      try { var raw = localStorage.getItem(key); if (raw) { var o = JSON.parse(raw); storeSet(key, o); return o; } } catch (e) { /* egal */ }
      return null;
    }).catch(function () {
      try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    });
  }
  function storeSet(key, val) {
    if (NO_STORE) return Promise.resolve(true);
    return idb().then(function (dbh) {
      return new Promise(function (res, rej) {
        var tx = dbh.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(JSON.parse(JSON.stringify(val)), key);
        tx.oncomplete = function () { res(true); };
        tx.onerror = function () { rej(tx.error); };
      });
    }).then(function () { try { localStorage.removeItem(key); } catch (e) { /* egal */ } return true; })
      .catch(function () {
        try { localStorage.setItem(key, JSON.stringify(val)); return true; }
        catch (e) { toast(t("storeFail")); return false; }
      });
  }
  function storeDel(key) {
    try { localStorage.removeItem(key); } catch (e) { /* egal */ }
    if (NO_STORE) return Promise.resolve();
    return idb().then(function (dbh) {
      return new Promise(function (res) { var tx = dbh.transaction(IDB_STORE, "readwrite"); tx.objectStore(IDB_STORE).delete(key); tx.oncomplete = res; tx.onerror = res; });
    }).catch(function () { /* egal */ });
  }
  // Browser bitten, die Daten nicht automatisch zu löschen
  function requestPersist() { try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* egal */ } }
  function loadDb() {
    return storeGet(DB_KEY).then(function (o) {
      if (o) db = { master: o.master || {}, added: o.added || {}, meta: o.meta || null };
      rebuildIndex();
    });
  }
  function saveDb() {
    rebuildIndex(); renderCustBadge(); requestPersist();
    storeSet(DB_KEY, db);
    return true;
  }
  function rebuildIndex() {
    dbIndex = {};
    Object.keys(db.master).forEach(function (k) { dbIndex[keyNo(k)] = { rec: db.master[k], src: "master" }; });
    Object.keys(db.added).forEach(function (k) { if (!dbIndex[keyNo(k)]) dbIndex[keyNo(k)] = { rec: db.added[k], src: "added" }; });
  }
  function findCustomer(no) { return dbIndex[keyNo(no)] || null; }
  function cityLine(r) { return [r.country, r.zip, r.city].map(function (x) { return String(x || "").trim(); }).filter(Boolean).join(" "); }
  function recToDest(r) { return [r.name || "", r.extra || "", r.street || "", cityLine(r)]; }

  function renderCustBadge() {
    var n = Object.keys(db.master).length + Object.keys(db.added).length, na = typeof artCount === "function" ? artCount() : 0;
    var b = $("#custBadge"); if (b) b.textContent = (n || na) ? (n ? nf(n, 0) + " " + t("bCust") : "") + (n && na ? " · " : "") + (na ? nf(na, 0) + " " + t("bArt") : "") : "";
  }
  function renderCustStatus() {
    var el = $("#custStatus"); if (!el) return;
    el.className = "cust-status"; el.textContent = "";
    if (!normNo(state.custNo)) return;
    if (state.custLoaded) {
      var edited = state.custLoaded.dest.some(function (v, i) { return v !== state.dest[i]; });
      if (edited) { el.textContent = t("stEdited"); el.classList.add("warn"); }
      else { el.textContent = state.custLoaded.src === "master" ? t("stFound") : t("stFoundLocal"); el.classList.add("ok"); }
    } else if (state.custChecked === normNo(state.custNo)) {
      el.textContent = t("stUnknown"); el.classList.add("warn");
    }
  }
  function applyCustomer(hit) {
    var dest = recToDest(hit.rec);
    state.dest = dest.slice();
    state.custLoaded = { no: normNo(state.custNo), dest: dest.slice(), src: hit.src };
    state.destFromCust = true;
    dest.forEach(function (v, i) { var el = $("#f-dest" + i); if (el) el.value = v; });
    renderCustStatus(); paintErrors();
  }
  function lookupCustomer() {
    var no = normNo(state.custNo);
    if (!no) { renderCustStatus(); return; }
    if (state.custLoaded && state.custLoaded.no === no) return;
    var hit = findCustomer(no);
    if (hit) { applyCustomer(hit); return; }
    state.custChecked = no; renderCustStatus();
    if ($("#newCustModal").hidden) openNewCust(no);
  }

  /* --- Popup: neuer Kunde --- */
  var ncNo = "";
  function openNewCust(no) {
    ncNo = no;
    var keys = Object.keys(db.master).concat(Object.keys(db.added));
    var html = esc(tpl(t("ncText"), { n: no }));
    if (!keys.length) {
      html += '<span class="nc-diag warn-txt">' + esc(t("ncNoDb")) + (NO_STORE ? " " + esc(t("ncPreview")) : "") + "</span>";
    } else {
      var k = keyNo(no), sim = keys.filter(function (x) { var kx = keyNo(x); return k && kx !== k && (kx.indexOf(k) >= 0 || k.indexOf(kx) >= 0 && kx.length >= 4); }).slice(0, 5);
      html += '<span class="nc-diag">' + esc(tpl(t("ncDbInfo"), { n: nf(keys.length, 0), ex: keys.slice(0, 3).map(function (x) { return "#" + x; }).join(", ") })) + "</span>";
      if (sim.length) html += '<span class="nc-diag">' + esc(t("ncSimilar")) + " " + sim.map(function (x) { return '<button type="button" class="nc-sim" data-no="' + esc(x) + '">#' + esc(x) + "</button>"; }).join(" ") + "</span>";
    }
    $("#newCustText").innerHTML = html;
    $("#newCustAsk").hidden = false; $("#newCustForm").hidden = true;
    $("#newCustModal").hidden = false; $("#ncYes").focus();
  }
  function showNewCustForm() {
    $("#ncFormTitle").textContent = tpl(t("ncFormTitle"), { n: ncNo });
    // Nur selbst eingetippte Adressen vorbelegen, nie die eines vorher geladenen Kunden
    var src = state.destFromCust ? ["", "", "", ""] : state.dest;
    $("#nc-name").value = src[0]; $("#nc-extra").value = src[1]; $("#nc-street").value = src[2];
    var m = /^([A-Za-z]{1,3})\s+(\S+)\s+(.+)$/.exec(src[3].trim());
    $("#nc-country").value = m ? m[1] : "D"; $("#nc-zip").value = m ? m[2] : ""; $("#nc-city").value = m ? m[3] : "";
    $$("#newCustForm .invalid").forEach(function (x) { x.classList.remove("invalid"); });
    $("#newCustAsk").hidden = true; $("#newCustForm").hidden = false; $("#nc-name").focus();
  }
  function saveNewCust(ev) {
    ev.preventDefault();
    var ok = true, req = UI[lang].e.required;
    ["nc-name", "nc-street", "nc-zip", "nc-city"].forEach(function (id) {
      var el = $("#" + id), bad = !el.value.trim();
      el.classList.toggle("invalid", bad); el.parentElement.querySelector(".msg").textContent = bad ? req : "";
      if (bad && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    var rec = { name: $("#nc-name").value.trim(), extra: $("#nc-extra").value.trim(), street: $("#nc-street").value.trim(),
      country: $("#nc-country").value.trim(), zip: $("#nc-zip").value.trim(), city: $("#nc-city").value.trim(), addedAt: new Date().toISOString() };
    db.added[ncNo] = rec;
    saveDb();
    $("#newCustModal").hidden = true;
    applyCustomer({ rec: rec, src: "added" });
    toast(tpl(t("custSaved"), { n: ncNo }));
  }
  function closeCustModals() { $("#newCustModal").hidden = true; $("#custModal").hidden = true; $("#newArtModal").hidden = true; }

  /* --- Verwaltung --- */
  var clearArmed = false, artClearArmed = false;
  function openCustModal() { clearArmed = false; artClearArmed = false; renderCustModal(); $("#custModal").hidden = false; $("#cmUpload").focus(); }
  function renderCustModal() {
    var nM = Object.keys(db.master).length, addedKeys = Object.keys(db.added), info = "";
    if (nM && db.meta) info = tpl(t("cmLoaded"), { n: nf(nM, 0), f: esc(db.meta.file), d: fmtDate(new Date(db.meta.date)) });
    else info = esc(t("cmNone"));
    if (nM && db.meta && db.meta.cols) {
      var fl = t("fld");
      info += '<div class="cm-cols">' + esc(db.meta.cols.pos ? t("cmColsPos") : t("cmCols")) + "<br>" + db.meta.cols.list.map(function (c) {
        return "<span>" + c.col + (c.h ? " „" + esc(c.h) + "“" : "") + " → <b>" + esc(fl[c.f] || c.f) + "</b>" +
          (c.g === "content" ? " <i>" + esc(t("cmGuessContent")) + "</i>" : c.g === "pos" ? " <i>" + esc(t("cmGuessPos")) + "</i>" : "") + "</span>";
      }).join("") + (db.meta.cols.unknown && db.meta.cols.unknown.length ? "<br>" + esc(t("cmUnknown")) + " " + esc(db.meta.cols.unknown.join(", ")) : "") + "</div>";
    }
    if (addedKeys.length) info += "<br>" + tpl(t("cmAdded"), { n: addedKeys.length });
    info += NO_STORE ? '<br><span class="warn-txt">' + esc(t("cmNoStore")) + "</span>" : (nM || addedKeys.length ? '<br><span class="ok-txt">✓ ' + esc(t("cmStored")) + "</span>" : "");
    $("#custInfo").innerHTML = info;
    $("#custAdded").innerHTML = addedKeys.length ? "<h4>" + esc(t("cmAddedTitle")) + "</h4><table>" + addedKeys.sort().map(function (k) {
      var r = db.added[k]; return "<tr><td><b>#" + esc(k) + "</b></td><td>" + esc(r.name) + "</td><td>" + esc(cityLine(r)) + "</td></tr>";
    }).join("") + "</table>" : "";
    $("#cmDownload").disabled = !(nM + addedKeys.length);
    $("#cmClear").textContent = clearArmed ? t("cmClearConfirm") : t("cmClear");
    var nA = artCount();
    var nItems = Object.keys(artDb.items).length;
    $("#artInfo").innerHTML = (nItems && artDb.meta ? tpl(t("amLoaded"), { n: nf(nItems, 0), f: esc(artDb.meta.file), d: fmtDate(new Date(artDb.meta.date)) }) : esc(t("amNone"))) +
      (nA ? (NO_STORE ? '<br><span class="warn-txt">' + esc(t("cmNoStore")) + "</span>" : '<br><span class="ok-txt">✓ ' + esc(t("cmStored")) + "</span>") : "");
    $("#amClear").textContent = artClearArmed ? t("amClearConfirm") : t("amClear");
    $("#amClear").hidden = !nA;
    $("#amDownload").disabled = !nA;
    var addedA = Object.keys(artDb.added);
    if (addedA.length) $("#artInfo").innerHTML += "<br>" + tpl(t("amAdded"), { n: addedA.length });
    $("#artAdded").innerHTML = addedA.length ? "<h4>" + esc(t("cmAddedTitle")) + "</h4><table>" + addedA.sort().map(function (k) {
      var r = artDb.added[k]; return "<tr><td><b>" + esc(r.no || k) + "</b></td><td>" + esc(r.de1 || "") + "</td><td>" + esc(r.en1 || "") + "</td></tr>";
    }).join("") + "</table>" : "";
  }

  /* --- Excel/CSV lesen --- */
  function colIdx(ref) { var m = /^([A-Z]+)/.exec(ref || ""), n = 0; if (!m) return -1; for (var i = 0; i < m[1].length; i++) n = n * 26 + m[1].charCodeAt(i) - 64; return n - 1; }
  // Namensraum-unabhängig (manche ERP-Exporte schreiben <x:row>, <x:c> …)
  function tags(node, name) { return Array.prototype.slice.call(node.getElementsByTagNameNS("*", name)); }
  function attrLocal(el, name) {
    for (var i = 0; i < el.attributes.length; i++) { var at = el.attributes[i]; if ((at.localName || at.name) === name) return at.value; }
    return null;
  }
  function readXlsxRows(buf) {
    var bytes = new Uint8Array(buf);
    if (bytes[0] === 0xD0 && bytes[1] === 0xCF) return Promise.reject(new Error(t("upErrXls")));   // altes .xls
    return JSZip.loadAsync(buf).then(function (zip) {
      var P = new DOMParser();
      var find = function (path) { var f = zip.file(path); if (f) return f; var lp = path.toLowerCase(); var hit = null; zip.forEach(function (rp, fo) { if (rp.toLowerCase() === lp) hit = fo; }); return hit; };
      var wbF = find("xl/workbook.xml");
      if (!wbF) throw new Error(t("upErrXls"));
      var relF = find("xl/_rels/workbook.xml.rels"), ssF = find("xl/sharedStrings.xml");
      return Promise.all([wbF.async("string"), relF ? relF.async("string") : "", ssF ? ssF.async("string") : ""]).then(function (r) {
        var wb = P.parseFromString(r[0], "application/xml"), rels = r[1] ? P.parseFromString(r[1], "application/xml") : null;
        var relMap = {};
        if (rels) tags(rels, "Relationship").forEach(function (x) { relMap[x.getAttribute("Id")] = x.getAttribute("Target"); });
        var ss = [];
        if (r[2]) tags(P.parseFromString(r[2], "application/xml"), "si").forEach(function (si) {
          // Phonetik-Text (rPh) ignorieren
          ss.push(tags(si, "t").filter(function (x) { return (x.parentNode.localName || "") !== "rPh"; }).map(function (x) { return x.textContent; }).join(""));
        });
        var sheets = tags(wb, "sheet").map(function (sh) {
          var tg = relMap[attrLocal(sh, "id")] || "worksheets/sheet1.xml";
          return tg.replace(/^\/?xl\//, "").replace(/^\//, "");
        });
        if (!sheets.length) sheets = ["worksheets/sheet1.xml"];
        return Promise.all(sheets.map(function (tg) { var f = find("xl/" + tg); return f ? f.async("string") : ""; })).then(function (xmls) {
          return xmls.filter(Boolean).map(function (xml) {
            var doc = P.parseFromString(xml, "application/xml"), rows = [];
            tags(doc, "row").forEach(function (row) {
              var arr = [], next = 0;
              tags(row, "c").forEach(function (c) {
                var ty = c.getAttribute("t"), v = tags(c, "v")[0], val = "";
                if (ty === "s") val = v ? ss[+v.textContent] || "" : "";
                else if (ty === "inlineStr") val = tags(c, "t").map(function (x) { return x.textContent; }).join("");
                else val = v ? v.textContent : "";
                if (ty !== "s" && ty !== "inlineStr" && ty !== "str" && /^-?\d+\.0+$/.test(val)) val = val.replace(/\.0+$/, "");
                var ci = colIdx(c.getAttribute("r")); if (ci < 0) ci = next;
                arr[ci] = String(val).trim(); next = ci + 1;
              });
              var rn = +c0(row.getAttribute("r")); if (rn > 0) rows[rn - 1] = arr; else rows.push(arr);
            });
            for (var i = 0; i < rows.length; i++) if (!rows[i]) rows[i] = [];
            return rows;
          });
        });
      });
    });
  }
  function c0(v) { return v == null ? "" : v; }
  function readCsvRows(text) {
    var first = text.split(/\r?\n/)[0] || "", sep = (first.split(";").length >= first.split(",").length) ? ";" : ",";
    if (first.split("\t").length > first.split(sep).length) sep = "\t";
    var rows = [], row = [], cur = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true;
      else if (ch === sep) { row.push(cur.trim()); cur = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cur.trim()); rows.push(row); row = []; cur = ""; }
      else cur += ch;
    }
    if (cur || row.length) { row.push(cur.trim()); rows.push(row); }
    return rows;
  }
  function normHdr(h) { return String(h || "").normalize("NFC").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, ""); }
  function hdrKind(h) {
    var n = normHdr(h);
    if (!n) return null;
    if (/(kunde|kd|debitor|customer|konto|kto)/.test(n) && /(nr|nummer|number|no|id)$/.test(n) || /^(nr|nummer|kdnr|kundennr|debitor|kto|kontonr)$/.test(n)) return "no";
    if (/(zusatz|name2|addition)/.test(n)) return "extra";
    if (/(laenderkennzeichen|laenderkz|landkz|lkz|laendercode|landescode|landcode|countrycode|iso)/.test(n)) return "country";
    if (/(plz|postleitzahl|postleitz|zip|postcode|postalcode)/.test(n)) return "zip";
    if (/(strasse|strase|^str$|^str\d|^str[a-z]{0,3}nr|street|anschrift|adresse|hausnummer|hausnr)/.test(n)) return "street";
    if (/^(ort|stadt|city|wohnort|ortsname|lieferort)/.test(n) || /ort$/.test(n) && !/(export|import|sort)$/.test(n)) return "city";
    if (/^(land|country|laendername|landname|staat)/.test(n)) return "countryName";
    if (/(name|firma|company|kunde$|bezeichnung)/.test(n)) return "name";
    return null;
  }
  var COUNTRY_CODES = { deutschland: "D", germany: "D", oesterreich: "A", austria: "A", schweiz: "CH", switzerland: "CH", frankreich: "F", france: "F",
    italien: "I", italy: "I", niederlande: "NL", netherlands: "NL", belgien: "B", belgium: "B", luxemburg: "L", polen: "PL", poland: "PL",
    tschechien: "CZ", spanien: "E", spain: "E", daenemark: "DK", ungarn: "H", schweden: "S", grossbritannien: "GB", vereinigteskoenigreich: "GB" };
  // Ninas Aufbau ohne Überschrift: A Kundennr. | B Kundenname | C Straße | D PLZ | E Ort | F Länderkennzeichen | G Land | H Zusatz
  var POS_MAP = { no: 0, name: 1, street: 2, zip: 3, city: 4, country: 5, countryName: 6, extra: 7 };
  function detectMap(rows) {
    for (var r = 0; r < Math.min(rows.length, 30); r++) {
      var m = {};
      (rows[r] || []).forEach(function (h, i) { var k = hdrKind(h); if (k && m[k] === undefined) m[k] = i; });
      if (m.no !== undefined && m.name !== undefined) {
        // Zweizeilige Überschriften: fehlende Felder in der Zeile darunter suchen
        var guessed = {};
        (rows[r + 1] || []).forEach(function (h, i) {
          var k = hdrKind(h);
          if (k && m[k] === undefined && !usedCol(m, i)) { m[k] = i; guessed[k] = "row2"; }
        });
        fillMissing(m, rows.slice(r + 1, r + 60), guessed);
        return { hi: r, map: m, guessed: guessed };
      }
    }
    // Keine Überschrift erkannt: Positions-Aufbau versuchen, wenn Spalte A nach Kundennummern aussieht
    var data = rows.filter(function (x) { return x && x.length; });
    var looks = data.slice(0, 20).filter(function (x) { return /^[A-Za-z]?[\d\-\/]{3,}$/.test(String(x[0] || "")) && String(x[1] || "").length > 1; }).length;
    if (data.length && looks >= Math.min(3, data.length)) return { hi: -1, map: POS_MAP };
    return null;
  }
  function usedCol(m, i) { return Object.keys(m).some(function (k) { return m[k] === i; }); }
  // Fehlende Adressfelder über den Inhalt der Spalten erkennen, sonst über Ninas Spaltenreihenfolge
  function fillMissing(m, sample, guessed) {
    var data = sample.filter(function (x) { return x && x.length; });
    var width = data.reduce(function (w, x) { return Math.max(w, x.length); }, 0);
    function share(i, re) {
      var vals = data.map(function (x) { return String(x[i] == null ? "" : x[i]).trim(); }).filter(Boolean);
      return vals.length ? vals.filter(function (v) { return re.test(v); }).length / vals.length : 0;
    }
    var free = []; for (var i = 0; i < width; i++) if (!usedCol(m, i)) free.push(i);
    if (m.zip === undefined) {
      var z = free.filter(function (i) { return share(i, /^[A-Z]{0,2}-?\d{4,5}$/i) >= 0.6; })[0];
      if (z !== undefined) { m.zip = z; guessed.zip = "content"; free = free.filter(function (i) { return i !== z; }); }
    }
    if (m.street === undefined) {
      var st = free.filter(function (i) { return share(i, /[A-Za-zÄÖÜäöüß].*\d|\d.*[A-Za-zÄÖÜäöüß]/) >= 0.6 && share(i, /^\d+$/) < 0.3; })[0];
      if (st !== undefined) { m.street = st; guessed.street = "content"; free = free.filter(function (i) { return i !== st; }); }
    }
    if (m.city === undefined && m.zip !== undefined && free.indexOf(m.zip + 1) >= 0 && share(m.zip + 1, /^[^\d]{2,}$/) >= 0.6) {
      m.city = m.zip + 1; guessed.city = "content"; free = free.filter(function (i) { return i !== m.city; });
    }
    ["street", "zip", "city"].forEach(function (k) {
      if (m[k] === undefined && free.indexOf(POS_MAP[k]) >= 0) { m[k] = POS_MAP[k]; guessed[k] = "pos"; free = free.filter(function (i) { return i !== POS_MAP[k]; }); }
    });
  }
  var lastCols = null;
  function rowsToCustomers(sheets) {
    var found = null, rows = null;
    for (var i = 0; i < sheets.length && !found; i++) { found = detectMap(sheets[i]); rows = sheets[i]; }
    if (!found) {
      var first = (sheets[0] || []).filter(function (x) { return x && x.some(Boolean); })[0] || [];
      throw new Error(tpl(t("upErrCols"), { h: first.filter(Boolean).slice(0, 8).join(" | ") || "–" }));
    }
    var map = found.map, out = {}, count = 0, hdr = found.hi >= 0 ? rows[found.hi] : null;
    var gs = found.guessed || {};
    var maxW = rows.reduce(function (w, x) { return Math.max(w, x ? x.length : 0); }, 0);
    if (found.hi < 0) map = Object.keys(map).reduce(function (o, k) { if (map[k] < maxW) o[k] = map[k]; return o; }, {});
    lastCols = { pos: found.hi < 0, list: Object.keys(map).map(function (k) {
      return { f: k, col: String.fromCharCode(65 + map[k]), h: hdr ? String(hdr[map[k]] || "") : "", g: gs[k] || "" };
    }).sort(function (a, b) { return a.col.localeCompare(b.col); }),
      unknown: hdr ? hdr.map(function (h, i) { return usedCol(map, i) || !String(h || "").trim() ? null : String.fromCharCode(65 + i) + " „" + String(h) + "“"; }).filter(Boolean) : [] };
    rows.slice(found.hi + 1).forEach(function (row) {
      if (!row) return;
      var g = function (k) { return map[k] === undefined ? "" : String(row[map[k]] == null ? "" : row[map[k]]).trim(); };
      var no = normNo(g("no")); if (!no || hdrKind(no) === "no") return;
      var rec = { name: g("name"), extra: g("extra"), street: g("street"), country: g("country"), countryName: g("countryName"), zip: g("zip"), city: g("city") };
      if (!rec.country && rec.countryName) rec.country = rec.countryName.length <= 3 ? rec.countryName : (COUNTRY_CODES[normHdr(rec.countryName)] || "");
      // Excel speichert PLZ oft als Zahl – führende Null bei deutschen PLZ wiederherstellen (z. B. 1067 → 01067)
      if (/^\d{4}$/.test(rec.zip) && /^(d|de|deu|deutschland|germany|)$/i.test(rec.country)) rec.zip = "0" + rec.zip;
      if (!rec.name) return;
      if (!out[no]) count++;
      out[no] = rec;
    });
    if (!count) throw new Error(t("upErrEmpty"));
    return out;
  }
  function decodeText(buf) {
    var s;
    try { s = new TextDecoder("utf-8", { fatal: true }).decode(buf); } catch (e) { s = new TextDecoder("windows-1252").decode(buf); }
    return s.replace(/^\uFEFF/, "");
  }
  function showUpErr(msg) { var el = $("#custErr"); el.textContent = msg; el.hidden = false; toast(msg); }
  function handleUpload(file) {
    $("#custErr").hidden = true;
    var name = file.name || "Datei", lower = name.toLowerCase();
    if (/\.xls$/.test(lower)) { showUpErr(t("upErrXls")); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var p = /\.(csv|txt)$/.test(lower)
        ? Promise.resolve([readCsvRows(decodeText(reader.result))])
        : readXlsxRows(reader.result);
      p.then(rowsToCustomers).then(function (master) {
        var kept = 0, dropped = 0, mIdx = {};
        Object.keys(master).forEach(function (k) { mIdx[keyNo(k)] = 1; });
        Object.keys(db.added).forEach(function (k) { if (mIdx[keyNo(k)]) { delete db.added[k]; dropped++; } else kept++; });
        db.master = master; db.meta = { file: name, date: new Date().toISOString(), cols: lastCols };
        saveDb(); renderCustModal();
        var n = Object.keys(master).length;
        toast(tpl(t("upOk"), { n: nf(n, 0) }) + (kept ? tpl(t("upKept"), { k: kept }) : "") + (dropped ? tpl(t("upDropped"), { d: dropped }) : ""));
        if (normNo(state.custNo) && !state.custLoaded) { var hit = findCustomer(state.custNo); if (hit) applyCustomer(hit); }
      }).catch(function (err) { logErr(err); showUpErr(t("upErr") + err.message); });
    };
    reader.readAsArrayBuffer(file);
  }

  /* --- Excel schreiben (Kundenstamm-Download / Vorlage) --- */
  function xmlEsc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function buildXlsx(rows, sheetName, colWidths) {
    var cl = function (i) { var s = ""; i++; while (i) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
    var data = rows.map(function (r, ri) {
      return '<row r="' + (ri + 1) + '">' + r.map(function (v, ci) {
        return '<c r="' + cl(ci) + (ri + 1) + '" t="inlineStr"' + (ri === 0 ? ' s="1"' : "") + '><is><t xml:space="preserve">' + xmlEsc(v == null ? "" : v) + "</t></is></c>";
      }).join("") + "</row>";
    }).join("");
    var z = new JSZip(), H = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    z.file("[Content_Types].xml", H + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>');
    z.file("_rels/.rels", H + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
    z.file("xl/workbook.xml", H + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="' + xmlEsc(sheetName) + '" sheetId="1" r:id="rId1"/></sheets></workbook>');
    z.file("xl/_rels/workbook.xml.rels", H + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
    z.file("xl/styles.xml", H + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>');
    var widths = colWidths || [14, 38, 30, 9, 26, 10, 16, 26];
    z.file("xl/worksheets/sheet1.xml", H + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>' +
      widths.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join("") +
      "</cols><sheetData>" + data + '</sheetData><autoFilter ref="A1:' + String.fromCharCode(64 + widths.length) + Math.max(rows.length, 1) + '"/></worksheet>');
    return z.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }
  function downloadCustomers() {
    var rows = [UI.de.hdr], all = {};
    Object.keys(db.master).forEach(function (k) { all[k] = db.master[k]; });
    Object.keys(db.added).forEach(function (k) { if (!findInMaster(k)) all[k] = db.added[k]; });
    Object.keys(all).sort(function (a, b) { return a.localeCompare(b, "de", { numeric: true }); }).forEach(function (k) {
      var r = all[k]; rows.push([k, r.name, r.street, r.zip, r.city, r.country, r.countryName || "", r.extra]);
    });
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    buildXlsx(rows, "Kundenstamm").then(function (b) { download(b, "Kundenstamm_" + d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + ".xlsx"); });
  }
  function findInMaster(k) { var kk = keyNo(k); return Object.keys(db.master).some(function (m) { return keyNo(m) === kk; }); }
  function downloadTemplate() {
    buildXlsx([UI.de.hdr, ["10001", "Musterfirma GmbH", "Musterstraße 1", "86356", "Neusäß", "D", "Deutschland", ""]], "Kundenstamm")
      .then(function (b) { download(b, "Kundenstamm_Vorlage.xlsx"); });
  }

  function initCustomers() {
    rebuildIndex();
    Promise.all([loadDb(), loadArtDb()]).then(function () {
      renderCustBadge(); renderCustStatus();
      if (!$("#custModal").hidden) renderCustModal();
      // Eingaben, die vor dem Laden gemacht wurden, nachträglich auflösen
      state.pos.forEach(function (pp, i) { if (pp.art && !pp.artLoaded) { var r = findArticle(keyNo(pp.art)); if (r) fillArticle(i, r); } });
    });
    $("#posBody").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.dataset && e.target.dataset.pk === "art") { e.preventDefault(); lookupArticle(+e.target.dataset.pos); }
    });
    $("#naNo").addEventListener("click", function () { $("#newArtModal").hidden = true; var el = $("#p-d1-" + naRow); if (el) el.focus(); });
    $("#naYes").addEventListener("click", showNewArtForm);
    $("#naCancel").addEventListener("click", function () { $("#newArtModal").hidden = true; });
    $("#newArtForm").addEventListener("submit", saveNewArt);
    $("#newArtModal").addEventListener("click", function (e) { if (e.target.id === "newArtModal") $("#newArtModal").hidden = true; });
    $("#amDownload").addEventListener("click", downloadArticles);
    $("#amUpload").addEventListener("click", function () { $("#amFile").value = ""; $("#amFile").click(); });
    $("#amFile").addEventListener("change", function () { if (this.files[0]) handleArtUpload(this.files[0]); });
    $("#amClear").addEventListener("click", function () {
      if (!artClearArmed) { artClearArmed = true; renderCustModal(); return; }
      artDb = { items: {}, added: {}, meta: null };
      storeDel(ART_KEY);
      artClearArmed = false; saveArtDb(); renderCustModal(); toast(t("cleared2"));
    });
    var input = $("#f-custNo");
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); state.custNo = input.value.replace(/^#+/, ""); lookupCustomer(); } });
    $("#ncNo").addEventListener("click", function () { $("#newCustModal").hidden = true; $("#f-dest0").focus(); });
    $("#ncYes").addEventListener("click", showNewCustForm);
    $("#newCustText").addEventListener("click", function (e) {
      var b = e.target.closest(".nc-sim"); if (!b) return;
      $("#newCustModal").hidden = true;
      state.custNo = b.dataset.no; $("#f-custNo").value = b.dataset.no; state.custLoaded = null;
      lookupCustomer();
    });
    $("#ncCancel").addEventListener("click", function () { $("#newCustModal").hidden = true; });
    $("#newCustForm").addEventListener("submit", saveNewCust);
    $("#btnCustomers").addEventListener("click", openCustModal);
    $("#cmClose").addEventListener("click", function () { $("#custModal").hidden = true; });
    $("#cmUpload").addEventListener("click", function () { $("#cmFile").value = ""; $("#cmFile").click(); });
    $("#cmFile").addEventListener("change", function () { if (this.files[0]) handleUpload(this.files[0]); });
    $("#cmDownload").addEventListener("click", downloadCustomers);
    $("#cmTemplate").addEventListener("click", downloadTemplate);
    $("#cmClear").addEventListener("click", function () {
      if (!clearArmed) { clearArmed = true; renderCustModal(); return; }
      db = { master: {}, added: {}, meta: null };
      storeDel(DB_KEY);
      rebuildIndex(); renderCustBadge(); clearArmed = false; renderCustModal(); toast(t("cleared2"));
    });
    ["newCustModal", "custModal"].forEach(function (id) {
      $("#" + id).addEventListener("click", function (e) { if (e.target.id === id) $("#" + id).hidden = true; });
    });
  }


  /* ---------- Artikelstamm ----------
     Excel: A Artikelnummer | B Bezeichnung 1 DE | C Bezeichnung 2 DE | D Bezeichnung 1 EN | E Bezeichnung 2 EN.
     Wie der Kundenstamm nur lokal im Browser gespeichert. */
  var ART_KEY = "sa-artikel-v1";
  var artDb = { items: {}, added: {}, meta: null };
  function loadArtDb() {
    return storeGet(ART_KEY).then(function (o) {
      if (o) artDb = { items: o.items || {}, added: o.added || {}, meta: o.meta || null };
    });
  }
  function saveArtDb() {
    renderCustBadge(); requestPersist();
    storeSet(ART_KEY, artDb);
  }
  function artCount() { return Object.keys(artDb.items).length + Object.keys(artDb.added).length; }
  function findArticle(k) { return artDb.items[k] || artDb.added[k] || null; }
  function rowsToArticles(sheets) {
    var out = {}, count = 0;
    for (var si = 0; si < sheets.length && !count; si++) {
      sheets[si].forEach(function (row, ri) {
        if (!row) return;
        var g = function (i) { return String(row[i] == null ? "" : row[i]).trim(); };
        var no = g(0);
        if (!no) return;
        // Überschriftenzeile überspringen
        if (ri < 5 && /(artikel|art|item|nr|nummer|bezeichnung)/.test(normHdr(no)) && !/\d/.test(no)) return;
        var k = keyNo(no);
        if (!k) return;
        if (!out[k]) count++;
        out[k] = { no: no, de1: g(1), de2: g(2), en1: g(3), en2: g(4) };
      });
    }
    if (!count) throw new Error(t("upErrEmpty"));
    return out;
  }
  function handleArtUpload(file) {
    var name = file.name || "Datei", lower = name.toLowerCase();
    $("#artErr").hidden = true;
    var fail = function (msg) { var el = $("#artErr"); el.textContent = msg; el.hidden = false; toast(msg); };
    if (/\.xls$/.test(lower)) { fail(t("upErrXls")); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var p = /\.(csv|txt)$/.test(lower) ? Promise.resolve([readCsvRows(decodeText(reader.result))]) : readXlsxRows(reader.result);
      p.then(rowsToArticles).then(function (items) {
        var kept = 0, dropped = 0;
        Object.keys(artDb.added).forEach(function (k) { if (items[k]) { delete artDb.added[k]; dropped++; } else kept++; });
        artDb = { items: items, added: artDb.added, meta: { file: name, date: new Date().toISOString() } };
        saveArtDb(); renderCustModal();
        toast(tpl(t("artUpOk"), { n: nf(Object.keys(items).length, 0) }) + (kept ? tpl(t("upKept"), { k: kept }) : "") + (dropped ? tpl(t("upDroppedArt"), { d: dropped }) : ""));
        state.pos.forEach(function (pp, i) { if (pp.art && !pp.artLoaded) lookupArticle(i); });
      }).catch(function (err) { logErr(err); fail(t("upErr") + err.message); });
    };
    reader.readAsArrayBuffer(file);
  }
  function artTexts(rec) {
    var o = lang === "en" ? [rec.en1, rec.en2] : [rec.de1, rec.de2];
    var other = lang === "en" ? [rec.de1, rec.de2] : [rec.en1, rec.en2];
    if (!o[0] && !o[1] && (other[0] || other[1])) return { d1: other[0] || "", d2: other[1] || "", fallback: true };
    return { d1: o[0] || "", d2: o[1] || "", fallback: false };
  }
  function setRowHint(i, key) {
    state.pos[i].artHint = key || "";
    var tr = $("#rowhint-" + i); if (!tr) return;
    tr.hidden = !key; tr.querySelector(".art-hint").textContent = key ? t(key) : "";
  }
  function fillArticle(i, rec) {
    var p = state.pos[i], tx = artTexts(rec);
    p.d1 = tx.d1; p.d2 = tx.d2;
    p.artLoaded = { key: keyNo(p.art), d1: tx.d1, d2: tx.d2 };
    var a = $("#p-d1-" + i), b = $("#p-d2-" + i);
    if (a) a.value = tx.d1; if (b) b.value = tx.d2;
    setRowHint(i, tx.fallback ? "artNoLang" : "");
  }
  function clearArticle(i) {
    var p = state.pos[i], L0 = p.artLoaded;
    // Nur automatisch übernommene, unveränderte Bezeichnungen wieder entfernen
    if (L0 && p.d1 === L0.d1 && p.d2 === L0.d2) {
      p.d1 = ""; p.d2 = "";
      var a = $("#p-d1-" + i), b = $("#p-d2-" + i); if (a) a.value = ""; if (b) b.value = "";
    }
    p.artLoaded = null; setRowHint(i, "");
  }
  function lookupArticle(i) {
    var p = state.pos[i], k = keyNo(p.art);
    if (!k) { setRowHint(i, ""); return; }
    if (p.artLoaded && p.artLoaded.key === k) return;
    var rec = findArticle(k);
    if (rec) { fillArticle(i, rec); }
    else {
      setRowHint(i, artCount() ? "artUnknown" : "artNoDb");
      if ($("#newArtModal").hidden) openNewArt(i);
    }
    renderTotals(); paintErrors();
  }
  /* --- Popup: neuer Artikel --- */
  var naRow = -1, naKey = "", naNo = "";
  function openNewArt(i) {
    naRow = i; naNo = state.pos[i].art; naKey = keyNo(naNo);
    $("#newArtText").innerHTML = esc(tpl(t("naText"), { n: naNo })) + (artCount() ? "" : '<span class="nc-diag warn-txt">' + esc(t("naNoDb")) + "</span>");
    $("#newArtAsk").hidden = false; $("#newArtForm").hidden = true;
    $("#newArtModal").hidden = false; $("#naYes").focus();
  }
  function showNewArtForm() {
    var p = state.pos[naRow];
    $("#naFormTitle").textContent = tpl(t("naFormTitle"), { n: naNo });
    var mine = p && !p.artLoaded ? [p.d1, p.d2] : ["", ""];
    $("#na-de1").value = lang === "de" ? mine[0] : ""; $("#na-de2").value = lang === "de" ? mine[1] : "";
    $("#na-en1").value = lang === "en" ? mine[0] : ""; $("#na-en2").value = lang === "en" ? mine[1] : "";
    $$("#newArtForm .invalid").forEach(function (x) { x.classList.remove("invalid"); });
    $("#newArtAsk").hidden = true; $("#newArtForm").hidden = false;
    $(lang === "en" ? "#na-en1" : "#na-de1").focus();
  }
  function saveNewArt(ev) {
    ev.preventDefault();
    var req = lang === "en" ? "#na-en1" : "#na-de1", el = $(req), bad = !el.value.trim();
    el.classList.toggle("invalid", bad); el.parentElement.querySelector(".msg").textContent = bad ? UI[lang].e.required : "";
    if (bad) { el.focus(); return; }
    var g = function (id) { return $("#" + id).value.trim(); };
    var rec = { no: naNo, de1: g("na-de1"), de2: g("na-de2"), en1: g("na-en1"), en2: g("na-en2"), addedAt: new Date().toISOString() };
    artDb.added[naKey] = rec;
    saveArtDb();
    $("#newArtModal").hidden = true;
    if (state.pos[naRow] && keyNo(state.pos[naRow].art) === naKey) { fillArticle(naRow, rec); renderTotals(); paintErrors(); }
    toast(tpl(t("artSaved"), { n: naNo }));
  }
  function downloadArticles() {
    var rows = [["Artikelnummer", "Bezeichnung 1 DE", "Bezeichnung 2 DE", "Bezeichnung 1 EN", "Bezeichnung 2 EN"]], all = {};
    Object.keys(artDb.items).forEach(function (k) { all[k] = artDb.items[k]; });
    Object.keys(artDb.added).forEach(function (k) { if (!all[k]) all[k] = artDb.added[k]; });
    Object.keys(all).sort(function (a, b) { return a.localeCompare(b, "de", { numeric: true }); }).forEach(function (k) {
      var r = all[k]; rows.push([r.no || k, r.de1, r.de2, r.en1, r.en2]);
    });
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    buildXlsx(rows, "Artikelstamm", [14, 34, 30, 34, 30]).then(function (b) { download(b, "Artikelstamm_" + d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + ".xlsx"); });
  }
  function relabelArticles() {
    state.pos.forEach(function (p, i) {
      var L0 = p.artLoaded, rec = L0 && findArticle(L0.key);
      if (!rec) return;
      if (p.d1 === L0.d1 && p.d2 === L0.d2) {
        var tx = artTexts(rec);
        p.d1 = tx.d1; p.d2 = tx.d2; p.artLoaded = { key: L0.key, d1: tx.d1, d2: tx.d2 };
        p.artHint = tx.fallback ? "artNoLang" : "";
      }
    });
  }
  /* ---------- Start ---------- */
  function init() {
    try { var sl = localStorage.getItem("sa-lang"); if (sl === "en" || sl === "de") lang = sl; } catch (e) { /* egal */ }
    state = emptyState();
    $("#logo").src = A.logo;
    renderStatic();

    var main = $("main");
    main.addEventListener("input", onInput);
    main.addEventListener("change", onInput);
    main.addEventListener("focusout", onBlur);
    main.addEventListener("click", function (ev) {
      var del = ev.target.closest("[data-del]");
      if (del) {
        state.pos.splice(+del.dataset.del, 1);
        touched = Object.keys(touched).reduce(function (o, k) { if (!/^p-/.test(k)) o[k] = true; return o; }, {});
        renderPositions(); paintErrors();
      }
      var li = ev.target.closest("[data-target]");
      if (li) { var el = document.getElementById(li.dataset.target); if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); } }
    });
    // Beim Verlassen eines Feldes können Hinweise erscheinen und das Layout verschieben –
    // deshalb schon beim Drücken der Maustaste reagieren, damit der Klick nicht ins Leere geht.
    $("#btnAddPos").addEventListener("mousedown", function (e) { if (e.button === 0) { e.preventDefault(); this.click(); } });
    $("#btnAddPos").addEventListener("click", function () {
      if (state.pos.length >= MAX_POS) return;
      state.pos.push(emptyPos()); renderPositions(); paintErrors();
      $("#p-qty-" + (state.pos.length - 1)).focus();
    });
    $$(".lang-switch button").forEach(function (b) { b.addEventListener("click", function () { setLang(b.dataset.lang); }); });

    var modal = $("#confirmModal");
    $("#btnRefresh").addEventListener("click", function () { modal.hidden = false; $("#confirmNo").focus(); });
    $("#confirmNo").addEventListener("click", function () { modal.hidden = true; });
    $("#confirmYes").addEventListener("click", function () { modal.hidden = true; reset(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.hidden = true; });

    $("#btnExport").addEventListener("click", function () {
      if (!tryExport()) return;
      exportPdf()
        .then(function (n) { toast(t("exported") + n); })
        .catch(function (err) { logErr(err); toast(t("exportFail") + err.message); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { modal.hidden = true; closeCustModals(); }
    });
    initCustomers();
    paintErrors();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
