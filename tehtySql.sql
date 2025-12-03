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






-- TEHTY 20.11.2025 seuraavat näkymät 

-- View: public.webajot

-- DROP VIEW public.webajot;

CREATE OR REPLACE VIEW public.webajot
 AS
 SELECT rekisterinumero,
    tarkoitus,
    (sukunimi::text || ' '::text) || etunimi::text AS nimi,
    otto,
    palautus
   FROM ajopaivakirja
  ORDER BY rekisterinumero, otto DESC;

ALTER TABLE public.webajot
    OWNER TO postgres;
COMMENT ON VIEW public.webajot
    IS 'tiivistetty ajopäiväkirja web-sovellusta varten';

GRANT ALL ON TABLE public.webajot TO postgres;
GRANT SELECT ON TABLE public.webajot TO websovellus;


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

-- View: public.webtarkoitukset

-- DROP VIEW public.webtarkoitukset;

CREATE OR REPLACE VIEW public.webtarkoitukset
 AS
 SELECT DISTINCT tarkoitus
   FROM webajot
  ORDER BY tarkoitus;

ALTER TABLE public.webtarkoitukset
    OWNER TO postgres;

GRANT ALL ON TABLE public.webtarkoitukset TO postgres;
GRANT SELECT ON TABLE public.webtarkoitukset TO websovellus;

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

-- Maanantai 24.11 luotiin uusi taulu sovelluksen käyttäjiä varten
-- Table: public.webuser

-- DROP TABLE IF EXISTS public.webuser;

CREATE TABLE IF NOT EXISTS public.webuser
(
    email character varying(200) COLLATE pg_catalog."default" NOT NULL,
    password character varying(64) COLLATE pg_catalog."default" NOT NULL,
    user_role character varying(30) COLLATE pg_catalog."default" NOT NULL DEFAULT 'opiskelija'::character varying,
    CONSTRAINT webuser_pkey PRIMARY KEY (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.webuser
    OWNER to postgres;

REVOKE ALL ON TABLE public.webuser FROM websovellus;

GRANT ALL ON TABLE public.webuser TO postgres;

GRANT REFERENCES, SELECT ON TABLE public.webuser TO websovellus;



--maanantai 1.12. tehdyt näkymät

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
  WHERE auto.kaytettavissa = true AND lainaus.palautus IS NULL;

ALTER TABLE public.web_autojen_tila
    OWNER TO postgres;

GRANT ALL ON TABLE public.web_autojen_tila TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.web_autojen_tila TO websovellus;


-- View: public.webajot_localtime

-- DROP VIEW public.webajot_localtime;

CREATE OR REPLACE VIEW public.webajot_localtime
 AS
 SELECT rekisterinumero,
    tarkoitus,
    (sukunimi::text || ' '::text) || etunimi::text AS nimi,
    (otto AT TIME ZONE 'Europe/Helsinki'::text) AS otettu,
    (palautus AT TIME ZONE 'Europe/Helsinki'::text) AS palautettu
   FROM ajopaivakirja
  ORDER BY rekisterinumero, otto DESC;

ALTER TABLE public.webajot_localtime
    OWNER TO postgres;

GRANT ALL ON TABLE public.webajot_localtime TO postgres;
GRANT SELECT, REFERENCES ON TABLE public.webajot_localtime TO websovellus;
