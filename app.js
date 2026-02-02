(() => {
  const config = window.APP_CONFIG || {};

  const appTitle = document.getElementById("appTitle");
  const heroLead = document.getElementById("heroLead");
  const installButton = document.getElementById("installButton");
  const copyLink = document.getElementById("copyLink");
  const linkHint = document.getElementById("linkHint");
  const platformStatus = document.getElementById("platformStatus");
  const iosCard = document.getElementById("iosCard");
  const androidCard = document.getElementById("androidCard");
  const qrImage = document.getElementById("qrImage");
  const qrMeta = document.getElementById("qrMeta");
  const buildLabel = document.getElementById("buildLabel");
  const supportEmail = document.getElementById("supportEmail");
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

  const getTargetUrl = () => {
    if (demoMode) {
      return `${demoUrl}?platform=${platform}`;
    }
    if (platform === "ios") return config.iosTestflightUrl;
    if (platform === "android") return config.androidApkUrl;
    return "";
  };

  const targetUrl = getTargetUrl();

  const appName = config.appName || "School Game";
  appTitle.textContent = `Install ${appName} on iOS and Android`;
  heroLead.textContent = `Scan the QR code or use the button for the right device. ${appName} is built for quick, low-friction setup.`;

  if (config.buildLabel) {
    buildLabel.textContent = `Build: ${config.buildLabel}`;
  }

  if (config.supportEmail) {
    supportEmail.textContent = `Contact ${config.supportEmail}`;
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
    qrMeta.textContent = "Set landingUrl in config.js to your hosted page.";
  }

  if (platform === "ios") {
    platformStatus.textContent = "Detected iOS device";
    iosCard.classList.add("active");
    installButton.textContent = demoMode ? "Open demo" : "Open TestFlight link";
  } else if (platform === "android") {
    platformStatus.textContent = "Detected Android device";
    androidCard.classList.add("active");
    installButton.textContent = demoMode ? "Open demo" : "Download APK";
  } else {
    platformStatus.textContent = demoMode ? "Demo mode (device unknown)" : "Choose iOS or Android below";
    installButton.textContent = demoMode ? "Open demo" : "Select your device";
  }

  if (!demoMode && isPlaceholder(targetUrl)) {
    installButton.classList.add("disabled");
    installButton.setAttribute("aria-disabled", "true");
    installButton.href = "#";
    linkHint.textContent = "Update your links in config.js before sharing.";
  } else {
    installButton.href = targetUrl;
    installButton.target = "_blank";
    installButton.rel = "noopener";
    linkHint.textContent = demoMode
      ? "Demo mode enabled. Replace links in config.js when builds are ready."
      : "Ready to share. Use the QR code for quick installs.";
  }

  copyLink.addEventListener("click", async () => {
    const fallback = () => {
      const temp = document.createElement("input");
      temp.value = targetUrl || "";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      copyLink.textContent = "Copied";
      setTimeout(() => (copyLink.textContent = "Copy link"), 1500);
    };

    if (!demoMode && isPlaceholder(targetUrl)) {
      copyLink.textContent = "Link missing";
      setTimeout(() => (copyLink.textContent = "Copy link"), 1500);
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(targetUrl);
        copyLink.textContent = "Copied";
        setTimeout(() => (copyLink.textContent = "Copy link"), 1500);
      } catch (error) {
        fallback();
      }
    } else {
      fallback();
    }
  });
})();
