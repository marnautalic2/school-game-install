(() => {
  const config = window.APP_CONFIG || {};

  const appTitle = document.getElementById("appTitle");
  const heroLead = document.getElementById("heroLead");
  const installButton = document.getElementById("installButton");
  const copyLink = document.getElementById("copyLink");
  const iosButton = document.getElementById("iosButton");
  const androidButton = document.getElementById("androidButton");
  const webButton = document.getElementById("webButton");
  const linkHint = document.getElementById("linkHint");
  const platformStatus = document.getElementById("platformStatus");
  const iosCard = document.getElementById("iosCard");
  const androidCard = document.getElementById("androidCard");
  const iosTitle = document.getElementById("iosTitle");
  const iosSteps = document.getElementById("iosSteps");
  const iosNote = document.getElementById("iosNote");
  const qrImage = document.getElementById("qrImage");
  const qrMeta = document.getElementById("qrMeta");
  const buildLabel = document.getElementById("buildLabel");
  const supportEmail = document.getElementById("supportEmail");
  const trustNote = document.getElementById("trustNote");
  const demoTag = document.getElementById("demoTag");

  const ua = navigator.userAgent || navigator.vendor || window.opera || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const isPlaceholder = (value) => {
    if (!value) return true;
    return value.includes("example") || value.includes("XXXX");
  };

  const platform = isIOS ? "ios" : isAndroid ? "android" : "unknown";
  const demoMode = Boolean(config.demoMode);
  const demoUrl = config.demoUrl || "demo.html";
  const iosInstallUrl = config.iosInstallUrl || "";
  const androidInstallUrl = config.androidInstallUrl || config.androidApkUrl || "";
  const webPlayUrl = config.webPlayUrl || "play/";
  const autoRedirectOnRecognizedPlatform = Boolean(config.autoRedirectOnRecognizedPlatform);
  const autoRedirectDelayMs = Number.isFinite(config.autoRedirectDelayMs)
    ? Math.max(0, Number(config.autoRedirectDelayMs))
    : 300;

  const setButtonUrl = (button, url) => {
    if (!button) return;
    if (demoMode || !isPlaceholder(url)) {
      button.href = demoMode ? `${demoUrl}?platform=${button.id === "iosButton" ? "ios" : "android"}` : url;
      button.target = "_blank";
      button.rel = "noopener";
      button.classList.remove("disabled");
      button.removeAttribute("aria-disabled");
      return;
    }
    button.href = "#";
    button.classList.add("disabled");
    button.setAttribute("aria-disabled", "true");
  };

  const getTargetUrl = () => {
    if (demoMode) {
      return `${demoUrl}?platform=${platform}`;
    }
    if (platform === "ios") return iosInstallUrl;
    if (platform === "android") return androidInstallUrl;
    return "";
  };

  const webFallbackAvailable = !demoMode && !!webPlayUrl && !isPlaceholder(webPlayUrl);
  const hasRealIosInstallUrl = !!iosInstallUrl && !isPlaceholder(iosInstallUrl);

  const targetUrl = getTargetUrl();
  const shareUrl = targetUrl || config.landingUrl || window.location.href;

  const appName = config.appName || "Školske Igre";
  appTitle.textContent = `Instaliraj ${appName} na iOS i Android`;
  heroLead.textContent = `Skeniraj QR kod ili odaberi gumb za svoj uređaj. ${appName} je postavljen za brzu i jednostavnu instalaciju.`;

  if (config.buildLabel) {
    buildLabel.textContent = `Verzija: ${config.buildLabel}`;
  }

  if (config.supportEmail) {
    supportEmail.textContent = `Kontakt: ${config.supportEmail}`;
  }

  if (config.trustNote && trustNote) {
    trustNote.textContent = config.trustNote;
  }

  if (demoMode && demoTag) {
    demoTag.hidden = false;
  }

  if (config.qrImagePath) {
    qrImage.src = config.qrImagePath;
  }

  if (config.landingUrl && !isPlaceholder(config.landingUrl)) {
    qrMeta.textContent = config.landingUrl;
  } else {
    qrMeta.textContent = "Postavi landingUrl u config.js na svoju hostanu stranicu.";
  }

  if (iosTitle && iosSteps && iosNote) {
    iosTitle.textContent = "iOS (App Store)";
    iosSteps.innerHTML = `
      <li>Otvori App Store poveznicu.</li>
      <li>Dodirni Preuzmi ili Instaliraj.</li>
      <li>Pokreni aplikaciju nakon instalacije.</li>
    `;
    iosNote.textContent = "Aplikacija je distribuirana preko privatne (unlisted) App Store poveznice.";
  }

  if (platform === "ios") {
    platformStatus.textContent = "Prepoznat iOS uređaj";
    iosCard.classList.add("active");
    installButton.textContent = demoMode ? "Otvori demo" : "Otvori App Store poveznicu";
    if (webButton) webButton.hidden = !(webFallbackAvailable && !hasRealIosInstallUrl);
  } else if (platform === "android") {
    platformStatus.textContent = "Prepoznat Android uređaj";
    androidCard.classList.add("active");
    installButton.textContent = demoMode ? "Otvori demo" : "Preuzmi Android APK";
    if (webButton) webButton.hidden = true;
  } else {
    platformStatus.textContent = demoMode
      ? "Demo način (nepoznat uređaj)"
      : "Automatsko prepoznavanje nije uspjelo. Odaberi iOS ili Android ispod.";
    installButton.textContent = demoMode ? "Otvori demo" : "Odaberi platformu";
    if (webButton) webButton.hidden = !webFallbackAvailable;
  }

  if (!demoMode && isPlaceholder(targetUrl)) {
    installButton.classList.add("disabled");
    installButton.setAttribute("aria-disabled", "true");
    installButton.href = "#";
    linkHint.textContent = "Ažuriraj iOS i Android poveznice u config.js prije dijeljenja.";
  } else {
    installButton.href = targetUrl;
    installButton.target = "_blank";
    installButton.rel = "noopener";
    linkHint.textContent = demoMode
      ? "Demo način je aktivan. Zamijeni poveznice u config.js kad buildovi budu spremni."
      : "Stranica je spremna za dijeljenje. Skeniraj QR kod za najbrži pristup.";
  }

  const shouldAutoRedirect =
    autoRedirectOnRecognizedPlatform &&
    (platform === "ios" || platform === "android") &&
    targetUrl &&
    !isPlaceholder(targetUrl);

  if (shouldAutoRedirect) {
    platformStatus.textContent = platform === "ios"
      ? "Prepoznat iOS uređaj. Preusmjeravanje na App Store..."
      : "Prepoznat Android uređaj. Pokretanje preuzimanja...";
    setTimeout(() => {
      window.location.assign(targetUrl);
    }, autoRedirectDelayMs);
  }

  setButtonUrl(iosButton, iosInstallUrl);
  setButtonUrl(androidButton, androidInstallUrl);

  if (webButton) {
    if (webFallbackAvailable) {
      webButton.href = webPlayUrl;
      webButton.target = "_blank";
      webButton.rel = "noopener";
      webButton.classList.remove("disabled");
      webButton.removeAttribute("aria-disabled");
    } else {
      webButton.href = "#";
      webButton.classList.add("disabled");
      webButton.setAttribute("aria-disabled", "true");
      webButton.hidden = true;
    }
  }

  copyLink.addEventListener("click", async () => {
    const fallback = () => {
      const temp = document.createElement("input");
      temp.value = shareUrl;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      copyLink.textContent = "Kopirano";
      setTimeout(() => (copyLink.textContent = "Kopiraj poveznicu"), 1500);
    };

    if (!demoMode && !shareUrl) {
      copyLink.textContent = "Nema poveznice";
      setTimeout(() => (copyLink.textContent = "Kopiraj poveznicu"), 1500);
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copyLink.textContent = "Kopirano";
        setTimeout(() => (copyLink.textContent = "Kopiraj poveznicu"), 1500);
      } catch (error) {
        fallback();
      }
    } else {
      fallback();
    }
  });
})();
