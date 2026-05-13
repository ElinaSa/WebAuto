-- View: public.webtarkoitukset

-- DROP VIEW public.webtarkoitukset;

CREATE OR REPLACE VIEW public.webtarkoitukset
 AS
 SELECT DISTINCT tarkoitus
   FROM webajot
  ORDER BY tarkoitus;

ALTER TABLE public.webtarkoitukset
    OWNER TO postgres;

GRANT ALL ON TABLE public.webtarkoitukset TO postgres;
GRANT SELECT ON TABLE public.webtarkoitukset TO websovellus;

