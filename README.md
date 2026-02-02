# School Game Install Landing

This repo hosts the public landing page used by the QR code. It routes iOS users to TestFlight and Android users to a direct APK link.

## Demo mode (before real builds)
Edit `config.js` and keep:
- `demoMode: true`
- `landingUrl` set to your GitHub Pages URL

The Install button will open `demo.html`, proving the QR flow works.

## When real builds are ready
Set `demoMode: false` and fill:
- `iosTestflightUrl`
- `androidApkUrl`

Keep the same `landingUrl` so the QR code never changes.

## QR image
Generate a QR for your landing URL using:

```
scripts/generate_qr.sh https://<github-username>.github.io/<repo>/
```

This writes `assets/qr.png` in this repo. Then set:
- `qrImagePath: "assets/qr.png"`
