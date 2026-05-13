-- View: public.autojen_tila

-- DROP VIEW public.autojen_tila;

CREATE OR REPLACE VIEW public.autojen_tila
 AS
(
         SELECT auto.rekisterinumero,
            auto.merkki,
            auto.malli,
            auto.henkilomaara,
            auto.automaatti,
            'vapaana'::text AS status
           FROM auto
          WHERE auto.kaytettavissa = true
        EXCEPT
         SELECT auto.rekisterinumero,
            auto.merkki,
            auto.malli,
            auto.henkilomaara,
            auto.automaatti,
            'vapaana'::text AS status
           FROM auto
             JOIN lainaus ON auto.rekisterinumero::text = lainaus.rekisterinumero::text
          WHERE auto.kaytettavissa = true AND lainaus.palautus IS NULL
) UNION
 SELECT auto.rekisterinumero,
    auto.merkki,
    auto.malli,
    auto.henkilomaara,
    auto.automaatti,
    'ajossa'::text AS status
   FROM auto
     JOIN lainaus ON auto.rekisterinumero::text = lainaus.rekisterinumero::text
  WHERE auto.kaytettavissa = true AND lainaus.palautus IS NULL;

ALTER TABLE public.autojen_tila
    OWNER TO postgres;

GRANT SELECT, REFERENCES ON TABLE public.autojen_tila TO autolainaus;
GRANT ALL ON TABLE public.autojen_tila TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.autojen_tila TO websovellus;

