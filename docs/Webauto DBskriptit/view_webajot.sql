-- View: public.webajot

-- DROP VIEW public.webajot;

CREATE OR REPLACE VIEW public.webajot
 AS
 SELECT rekisterinumero,
    tarkoitus,
    (sukunimi::text || ' '::text) || etunimi::text AS nimi,
    otto,
    palautus
   FROM ajopaivakirja
  ORDER BY rekisterinumero, otto DESC;

ALTER TABLE public.webajot
    OWNER TO postgres;
COMMENT ON VIEW public.webajot
    IS 'tiivistetty ajopäiväkirja web-sovellusta varten';

GRANT ALL ON TABLE public.webajot TO postgres;
GRANT SELECT ON TABLE public.webajot TO websovellus;

