-- View: public.webajot_localtime

-- DROP VIEW public.webajot_localtime;

CREATE OR REPLACE VIEW public.webajot_localtime
 AS
 SELECT rekisterinumero,
    tarkoitus,
    (sukunimi::text || ' '::text) || etunimi::text AS nimi,
    (otto AT TIME ZONE 'Europe/Helsinki'::text) AS otettu,
    (palautus AT TIME ZONE 'Europe/Helsinki'::text) AS palautettu
   FROM ajopaivakirja
  ORDER BY rekisterinumero, otto DESC;

ALTER TABLE public.webajot_localtime
    OWNER TO postgres;

GRANT ALL ON TABLE public.webajot_localtime TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.webajot_localtime TO websovellus;

