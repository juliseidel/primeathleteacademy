-- ============================================================================
-- Athlete Avatar — Gemini-generierter digitaler Zwilling
--
-- Speichert pro Athlet:
--   - selfie_data_uri:    Original-Foto (für Re-Generation ohne erneuten Upload)
--   - face_description:   Gemini Vision-Output (cached, ermöglicht schnelle
--                         Avatar-Regeneration ohne Vision-Call zu wiederholen)
--   - avatar_data_uri:    Generiertes Portrait im PAA-Tech-Fleece-Style
--   - avatar_updated_at:  Zeitstempel der letzten Generation
--
-- Implementation als data-URI (base64 PNG) statt Storage-Bucket — bei kleiner
-- User-Basis (< paar hundert Athleten) ist das simpler und Profil-Ladezeiten
-- bleiben akzeptabel (~150-300kb pro Avatar).
-- ============================================================================

ALTER TABLE athlete_profiles
  ADD COLUMN IF NOT EXISTS selfie_data_uri    text,
  ADD COLUMN IF NOT EXISTS face_description   text,
  ADD COLUMN IF NOT EXISTS avatar_data_uri    text,
  ADD COLUMN IF NOT EXISTS avatar_updated_at  timestamptz;

COMMENT ON COLUMN athlete_profiles.selfie_data_uri IS
  'Original-Selfie als data-URI — ermöglicht Re-Generation ohne erneuten Upload.';
COMMENT ON COLUMN athlete_profiles.face_description IS
  'Gemini Vision-Output: textuelle Gesichts-Beschreibung. Cached für schnelle Re-Generations.';
COMMENT ON COLUMN athlete_profiles.avatar_data_uri IS
  'Generiertes Avatar-Portrait im PAA-Outfit als data-URI (PNG base64).';
