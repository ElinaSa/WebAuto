-- View: public.webaktiivinen_ajo

-- DROP VIEW public.webaktiivinen_ajo;

CREATE OR REPLACE VIEW public.webaktiivinen_ajo
 AS
 SELECT rekisterinumero,
    (etunimi::text || ' '::text) || sukunimi::text AS kuljettaja,
    tarkoitus,
    to_char(otto, 'YYYY-MM-DD HH24:MI:SS'::text) AS otto
   FROM ajopaivakirja
  WHERE palautus IS NULL;

ALTER TABLE public.webaktiivinen_ajo
    OWNER TO postgres;

GRANT ALL ON TABLE public.webaktiivinen_ajo TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.webaktiivinen_ajo TO websovellus;

