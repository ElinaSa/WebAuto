-- mikan mallista tehty autojen tila näkymä.Tän voi copypasteta suoraan omaan tietokantaan. Alempana on vielä aktiivinen ajo näkymä.
--Sen alla on jest test taulu joka jonkun muun täytyy tarkistaa myös. 

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

GRANT ALL ON TABLE public.autojen_tila TO postgres; --tällä on kaikkioikeudet koska se on se pää tietokanta
GRANT SELECT, REFERENCES ON TABLE public.autojen_tila TO websovellus; -- websovellus saa vain näkemis ja toiseentauluun viittausoikeudet




--Aktiivinen ajo näkymä.
CREATE OR REPLACE VIEW public.aktiivinen_ajo
 AS
 SELECT rekisterinumero,
    (etunimi::text || ' '::text) || sukunimi::text AS kuljettaja,
    tarkoitus,
    otto
   FROM ajopaivakirja
  WHERE palautus IS NULL; --Tämä määrittää sen että se valitsee vain ajossa olevat autot.

ALTER TABLE public.aktiivinen_ajo
    OWNER TO postgres;

GRANT ALL ON TABLE public.aktiivinen_ajo TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.aktiivinen_ajo TO websovellus; --vain näkemis ja toiseen tauluun viittausoikeudet

--jest test taulu PLIIIIIS TARKISTAKAA ETTÄ PITIKÖ SEN OLLA NÄIN
CREATE TABLE IF NOT EXISTS public.jest_test
(
    id integer NOT NULL DEFAULT nextval('jest_test_id_seq'::regclass),
    nimi character varying(20) COLLATE pg_catalog."default" NOT NULL,
    palkka real NOT NULL,
    aikaleima timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    koodari boolean NOT NULL,
    CONSTRAINT jest_test_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.jest_test
    OWNER to postgres;