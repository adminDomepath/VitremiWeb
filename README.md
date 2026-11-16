# VitremiWeb

Static website for Vitremi. Serve the repository root to preview the home page. GitHub Pages serves the legal and support URLs without an extension. For a local server that requires exact file paths, open those pages with `.html` appended. The main page has four sections: Vitremi, Break, Calendar, and History. Legal and support pages are available in Spanish and English.

No build step, package manager, external fonts, analytics, or runtime dependencies are required. GitHub Pages serves the `main` branch from the repository root.

App Store Connect URLs:

- Marketing: `https://vitremi.com/`
- Privacy policy: `https://vitremi.com/privacy`
- Support: `https://vitremi.com/support`
- User Privacy Choices (optional): `https://vitremi.com/privacy#privacy-requests`

The iOS project sets `VITREMI_PRIVACY_POLICY_URL` to the published privacy policy for Debug and Release builds. Review App Privacy answers against the exact build configuration, particularly whether the optional Live Activity push service is enabled.
