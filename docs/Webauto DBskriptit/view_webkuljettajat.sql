-- View: public.webkuljettajat

-- DROP VIEW public.webkuljettajat;

CREATE OR REPLACE VIEW public.webkuljettajat
 AS
 SELECT DISTINCT nimi
   FROM webajot
  ORDER BY nimi;

ALTER TABLE public.webkuljettajat
    OWNER TO postgres;

GRANT ALL ON TABLE public.webkuljettajat TO postgres;
GRANT SELECT ON TABLE public.webkuljettajat TO websovellus;

