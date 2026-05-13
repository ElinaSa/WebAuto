-- View: public.webrekisterit

-- DROP VIEW public.webrekisterit;

CREATE OR REPLACE VIEW public.webrekisterit
 AS
 SELECT DISTINCT rekisterinumero
   FROM webajot
  ORDER BY rekisterinumero;

ALTER TABLE public.webrekisterit
    OWNER TO postgres;

GRANT ALL ON TABLE public.webrekisterit TO postgres;
GRANT SELECT ON TABLE public.webrekisterit TO websovellus;

