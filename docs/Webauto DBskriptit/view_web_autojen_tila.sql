-- View: public.web_autojen_tila

-- DROP VIEW public.web_autojen_tila;

CREATE OR REPLACE VIEW public.web_autojen_tila
 AS
(
         SELECT auto.rekisterinumero,
            auto.merkki,
            auto.malli,
            auto.henkilomaara,
            auto.automaatti,
            'vapaana'::text AS status,
            false AS ajossa
           FROM auto
          WHERE auto.kaytettavissa = true
        EXCEPT
         SELECT auto.rekisterinumero,
            auto.merkki,
            auto.malli,
            auto.henkilomaara,
            auto.automaatti,
            'vapaana'::text AS status,
            false AS ajossa
           FROM auto
             JOIN lainaus ON auto.rekisterinumero::text = lainaus.rekisterinumero::text
          WHERE auto.kaytettavissa = true AND lainaus.palautus IS NULL
) UNION
 SELECT auto.rekisterinumero,
    auto.merkki,
    auto.malli,
    auto.henkilomaara,
    auto.automaatti,
    'ajossa'::text AS status,
    true AS ajossa
   FROM auto
     JOIN lainaus ON auto.rekisterinumero::text = lainaus.rekisterinumero::text
  WHERE auto.kaytettavissa = true AND lainaus.palautus IS NULL
  ORDER BY 6 DESC;

ALTER TABLE public.web_autojen_tila
    OWNER TO postgres;

GRANT ALL ON TABLE public.web_autojen_tila TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.web_autojen_tila TO websovellus;

