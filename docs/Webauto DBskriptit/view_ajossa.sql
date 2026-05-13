-- View: public.ajossa

-- DROP VIEW public.ajossa;

CREATE OR REPLACE VIEW public.ajossa
 AS
 SELECT lainaus.rekisterinumero,
    auto.merkki,
    auto.malli,
    auto.automaatti,
    auto.henkilomaara,
    (lainaaja.etunimi::text || ' '::text) || lainaaja.sukunimi::text AS kuljettaja
   FROM lainaaja
     JOIN lainaus ON lainaaja.hetu = lainaus.hetu
     JOIN auto ON lainaus.rekisterinumero::text = auto.rekisterinumero::text
  WHERE lainaus.palautus IS NULL AND auto.kaytettavissa = true;

ALTER TABLE public.ajossa
    OWNER TO postgres;

GRANT SELECT, REFERENCES ON TABLE public.ajossa TO autolainaus;
GRANT ALL ON TABLE public.ajossa TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.ajossa TO websovellus;

