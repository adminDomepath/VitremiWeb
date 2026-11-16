# VitremiWeb

Static website for Vitremi. Open `index.html` locally or serve the repository root with any static file server. The main page has four sections: Vitremi, Break, Calendar, and History. Legal and support pages are available in Spanish and English.

No build step, package manager, external fonts, analytics, or runtime dependencies are required. GitHub Pages serves the `main` branch from the repository root.

App Store Connect URLs:

- Marketing: `https://vitremi.com/`
- Privacy policy: `https://vitremi.com/privacy.html`
- Support: `https://vitremi.com/support.html`
- User Privacy Choices (optional): `https://vitremi.com/privacy.html`

The iOS project sets `VITREMI_PRIVACY_POLICY_URL` to the published privacy policy for Debug and Release builds. Review App Privacy answers against the exact build configuration, particularly whether the optional Live Activity push service is enabled.
