# School Game Install Landing

Ovaj repozitorij sadrži javnu landing stranicu za QR kod instalacije aplikacije.
Stranica automatski prepoznaje iOS/Android, ali nudi i ručne gumbe za odabir platforme.
Ako uređaj nije prepoznat, prikazuje se i gumb `Igraj u pregledniku` (web fallback).

## Produkcijski način (preporučeno)
U `config.js` postavi:

- `demoMode: false`
- `landingUrl`: URL tvoje GitHub Pages stranice
- `iosInstallUrl`: iOS instalacijska poveznica
- `androidInstallUrl`: Android APK/AAB landing poveznica
- `webPlayUrl`: web build URL (npr. `play/`)
- `autoRedirectOnRecognizedPlatform`: `true` za automatsko preusmjeravanje na iOS/Android link čim se uređaj prepozna
- `autoRedirectDelayMs`: odgoda preusmjeravanja u milisekundama (npr. `300`)
- `buildLabel`, `supportEmail`, `trustNote`

Napomena: zadrži isti `landingUrl` dugoročno kako QR kod ne bi trebalo mijenjati.

## Demo način (prije pravih buildova)
U `config.js` postavi:

- `demoMode: true`
- `landingUrl`: URL tvoje GitHub Pages stranice

Gumb za instalaciju će voditi na `demo.html` i potvrditi da QR -> landing -> redirekcija radi.

## iOS distribucija

- Stranica je sada postavljena za App Store (unlisted) iOS distribuciju.
- Postavi `iosInstallUrl` na svoj stvarni unlisted App Store link.

## Android nepoznati izvori

- Android build se dijeli kao APK iz GitHub Releases.
- Ako instalacija bude blokirana, korisnik treba uključiti opciju:
  Postavke -> Sigurnost/Privatnost -> Instaliraj nepoznate aplikacije -> odabrani preglednik -> Dopusti iz ovog izvora.
- Nakon instalacije preporuka je ponovno isključiti tu opciju.

## QR kod
Generiraj QR kod za landing URL:

```
scripts/generate_qr.sh https://<github-username>.github.io/<repo>/
```

Skripta zapisuje `assets/qr.png`. U `config.js` ostavi:

- `qrImagePath: "assets/qr.png"`
