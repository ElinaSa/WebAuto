CREATE OR REPLACE VIEW public.webajopaivakirja AS
SELECT
    ajopaivakirja.rekisterinumero,
    ajopaivakirja.tarkoitus,
    (ajopaivakirja.sukunimi::text || ' '::text)
        || ajopaivakirja.etunimi::text AS nimi,
    to_char(
        ajopaivakirja.otto,
        'YYYY-MM-DD HH24:MI:SS'::text
    ) AS otettu,
    to_char(
        ajopaivakirja.palautus,
        'YYYY-MM-DD HH24:MI:SS'::text
    ) AS palautettu,
    auto.osasto
FROM public.ajopaivakirja
LEFT JOIN public.auto
    ON auto.rekisterinumero = ajopaivakirja.rekisterinumero
WHERE ajopaivakirja.palautus IS NOT NULL
ORDER BY ajopaivakirja.rekisterinumero,
         ajopaivakirja.otto DESC;