-- View: public.autoittain

-- DROP VIEW public.autoittain;

CREATE OR REPLACE VIEW public.autoittain
 AS
 SELECT auto.rekisterinumero,
    auto.merkki,
    auto.malli,
    lainaus.tarkoitus,
    lainaaja.hetu,
    lainaaja.sukunimi,
    lainaaja.etunimi,
    date_trunc('minute'::text, lainaus.lainausaika) AS otto,
    date_trunc('minute'::text, lainaus.palautus) AS palautus
   FROM auto
     JOIN lainaus ON auto.rekisterinumero::text = lainaus.rekisterinumero::text
     JOIN lainaaja ON lainaus.hetu = lainaaja.hetu
  ORDER BY auto.rekisterinumero, lainaus.lainausaika DESC;

ALTER TABLE public.autoittain
    OWNER TO postgres;
COMMENT ON VIEW public.autoittain
    IS 'Ajopäiväkirja autokohtaisesti käänteisessä aikajärjestyksessä eli uusimmat lainaukset ensin.';

GRANT SELECT, REFERENCES ON TABLE public.autoittain TO autolainaus;
GRANT ALL ON TABLE public.autoittain TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.autoittain TO websovellus;

