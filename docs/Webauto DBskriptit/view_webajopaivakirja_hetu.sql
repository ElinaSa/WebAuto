-- View: public.webajopaivakirja_hetu

-- DROP VIEW public.webajopaivakirja_hetu;

CREATE OR REPLACE VIEW public.webajopaivakirja_hetu
 AS
 SELECT rekisterinumero,
    tarkoitus,
    hetu,
    etunimi,
    sukunimi,
    to_char(otto, 'YYYY-MM-DD HH24:MI:SS'::text) AS otettu,
    to_char(palautus, 'YYYY-MM-DD HH24:MI:SS'::text) AS palautettu
   FROM ajopaivakirja
  WHERE palautus IS NOT NULL;

ALTER TABLE public.webajopaivakirja_hetu
    OWNER TO postgres;

GRANT SELECT, REFERENCES ON TABLE public.webajopaivakirja_hetu TO autolainaus;
GRANT ALL ON TABLE public.webajopaivakirja_hetu TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.webajopaivakirja_hetu TO websovellus;

