-- View: public.aktiivinen_ajo

-- DROP VIEW public.aktiivinen_ajo;

CREATE OR REPLACE VIEW public.aktiivinen_ajo
 AS
 SELECT rekisterinumero,
    (etunimi::text || ' '::text) || sukunimi::text AS kuljettaja,
    tarkoitus,
    otto
   FROM ajopaivakirja
  WHERE palautus IS NULL;

ALTER TABLE public.aktiivinen_ajo
    OWNER TO postgres;

GRANT ALL ON TABLE public.aktiivinen_ajo TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.aktiivinen_ajo TO websovellus;

