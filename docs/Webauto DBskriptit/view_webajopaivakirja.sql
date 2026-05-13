-- View: public.webajopaivakirja

-- DROP VIEW public.webajopaivakirja;

CREATE OR REPLACE VIEW public.webajopaivakirja
 AS
 SELECT rekisterinumero,
    tarkoitus,
    (sukunimi::text || ' '::text) || etunimi::text AS nimi,
    to_char(otto, 'YYYY-MM-DD HH24:MI:SS'::text) AS otettu,
    to_char(palautus, 'YYYY-MM-DD HH24:MI:SS'::text) AS palautettu
   FROM ajopaivakirja
  WHERE palautus IS NOT NULL
  ORDER BY rekisterinumero, otto DESC;

ALTER TABLE public.webajopaivakirja
    OWNER TO postgres;

GRANT ALL ON TABLE public.webajopaivakirja TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.webajopaivakirja TO websovellus;

