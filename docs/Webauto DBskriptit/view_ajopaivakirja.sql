-- View: public.ajopaivakirja

-- DROP VIEW public.ajopaivakirja;

CREATE OR REPLACE VIEW public.ajopaivakirja
 AS
 SELECT lainaus.rekisterinumero,
    auto.merkki,
    auto.malli,
    lainaus.tarkoitus,
    lainaus.hetu,
    lainaaja.sukunimi,
    lainaaja.etunimi,
    date_trunc('minute'::text, lainaus.lainausaika) AS otto,
    date_trunc('minute'::text, lainaus.palautus) AS palautus
   FROM auto
     JOIN lainaus ON auto.rekisterinumero::text = lainaus.rekisterinumero::text
     JOIN lainaaja ON lainaus.hetu = lainaaja.hetu
  ORDER BY lainaus.lainausaika DESC;

ALTER TABLE public.ajopaivakirja
    OWNER TO postgres;
COMMENT ON VIEW public.ajopaivakirja
    IS 'Ajopäiväkirja kaikista autoista ja ajoista';

GRANT SELECT, REFERENCES ON TABLE public.ajopaivakirja TO autolainaus;
GRANT ALL ON TABLE public.ajopaivakirja TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.ajopaivakirja TO websovellus;

