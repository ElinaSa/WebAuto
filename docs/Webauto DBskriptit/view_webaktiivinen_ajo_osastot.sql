CREATE OR REPLACE VIEW public.webaktiivinen_ajo AS
SELECT
    ajopaivakirja.rekisterinumero,
    (ajopaivakirja.etunimi::text || ' '::text)
        || ajopaivakirja.sukunimi::text AS kuljettaja,
    ajopaivakirja.tarkoitus,
    to_char(
        ajopaivakirja.otto,
        'YYYY-MM-DD HH24:MI:SS'::text
    ) AS otto,
    auto.osasto
FROM public.ajopaivakirja
LEFT JOIN public.auto
    ON auto.rekisterinumero = ajopaivakirja.rekisterinumero
WHERE ajopaivakirja.palautus IS NULL;