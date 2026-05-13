-- View: public.ajopaivakirja_verottaja

-- DROP VIEW public.ajopaivakirja_verottaja;

CREATE OR REPLACE VIEW public.ajopaivakirja_verottaja
 AS
 SELECT webajopaivakirja_hetu.rekisterinumero,
    mtransit2.lainaus,
    mtransit2.palautus,
    webajopaivakirja_hetu.hetu,
    webajopaivakirja_hetu.etunimi,
    webajopaivakirja_hetu.sukunimi,
    webajopaivakirja_hetu.tarkoitus,
    mtransit2.lahto_osoite AS mista,
    mtransit2.paluuosoite AS mihin,
    round(mtransit2.km, 2) AS km,
    mtransit2.lahtomittari AS mma,
    mtransit2.paluumittari AS mml,
    round(mtransit2.a_aika, 2) AS ajossa,
    round(mtransit2.p_aika, 2) AS seisonnassa
   FROM webajopaivakirja_hetu
     JOIN mtransit2 ON webajopaivakirja_hetu.rekisterinumero::text = mtransit2.rekisterinumero::text
  WHERE mtransit2.lainaus::text >= webajopaivakirja_hetu.otettu AND mtransit2.lainaus::text <= webajopaivakirja_hetu.palautettu
  ORDER BY webajopaivakirja_hetu.rekisterinumero, mtransit2.lainaus;

ALTER TABLE public.ajopaivakirja_verottaja
    OWNER TO postgres;

GRANT SELECT ON TABLE public.ajopaivakirja_verottaja TO autolainaus;
GRANT ALL ON TABLE public.ajopaivakirja_verottaja TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.ajopaivakirja_verottaja TO websovellus;

