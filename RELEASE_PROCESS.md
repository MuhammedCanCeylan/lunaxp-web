# Release Process

## Versioning
Use Semantic Versioning:

- PATCH: bug fixes — `0.1.0 -> 0.1.1`
- MINOR: new apps/features — `0.1.0 -> 0.2.0`
- MAJOR: stable milestone / major architecture change — `0.x -> 1.0.0`

## Release Checklist
1. Test the desktop and WindowManager.
2. Open each changed application.
3. Confirm apps do not draw a second title bar/taskbar.
4. Confirm no browser `alert()`, `confirm()` or `prompt()` was added.
5. Verify all `icon.png` paths.
6. Keep third-party licenses.
7. Remove test media, installers, ISOs, caches and secrets.
8. Update `CHANGELOG.md`.
9. Update `VERSION`.
10. Commit and tag.
11. Create the GitHub Release.

## First Release Commands

```powershell
git init
git add .
git commit -m "release: LunaXP Web v0.1.0"
git branch -M main

git remote add origin https://github.com/YOUR_USERNAME/lunaxp-web.git
git push -u origin main

git tag -a v0.1.0 -m "LunaXP Web v0.1.0"
git push origin v0.1.0
```

Create a GitHub Release from tag `v0.1.0` and use `RELEASE_NOTES_v0.1.0.md` as the release description.
