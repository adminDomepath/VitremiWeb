# VitremiWeb

Static website for Vitremi. Open `index.html` locally or serve the repository root with any static file server. The main page has four sections: Vitremi, Break, Calendar, and History. Legal and support pages are available in Spanish and English.

No build step, package manager, external fonts, analytics, or runtime dependencies are required. GitHub Pages serves the `main` branch from the repository root.

App Store Connect URLs:

- Marketing: `https://admindomepath.github.io/VitremiWeb/`
- Privacy policy: `https://admindomepath.github.io/VitremiWeb/privacy.html`
- Support: `https://admindomepath.github.io/VitremiWeb/support.html`
- User Privacy Choices (optional): `https://admindomepath.github.io/VitremiWeb/privacy.html#espanol`

For the iOS Settings link, set `VITREMI_PRIVACY_POLICY_URL` to the Privacy policy URL when building the app. Review App Privacy answers against the exact build configuration, particularly whether the optional Live Activity push service is enabled.
