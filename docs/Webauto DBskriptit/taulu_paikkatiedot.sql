-- Table: public.paikkatiedot

-- DROP TABLE IF EXISTS public.paikkatiedot;

CREATE TABLE IF NOT EXISTS public.paikkatiedot
(
    lahtopaiva date NOT NULL,
    lahtoaika time with time zone NOT NULL,
    lahto_osoite character varying(200) COLLATE pg_catalog."default" NOT NULL,
    lahto_matkamittari integer NOT NULL,
    tarkoitus character varying(50) COLLATE pg_catalog."default" NOT NULL,
    kuljettaja character varying(50) COLLATE pg_catalog."default",
    paluupaiva date,
    paluuaika time with time zone,
    paluu_osoite character varying(200) COLLATE pg_catalog."default",
    paluu_matkamittari integer,
    km numeric,
    ajoaika time with time zone,
    paikallaanaika time with time zone,
    "lahtopaiva;lahtoaika;lahto_osoite;lahto_matkamittari;tarkoitus;" character varying(128) COLLATE pg_catalog."default",
    "lahtopaiva	lahtoaika	lahto_osoite	lahto_matkamittari	tarkoitus	" character varying(128) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.paikkatiedot
    OWNER to postgres;

REVOKE ALL ON TABLE public.paikkatiedot FROM websovellus;

GRANT ALL ON TABLE public.paikkatiedot TO postgres;

GRANT SELECT, REFERENCES ON TABLE public.paikkatiedot TO websovellus;

COMMENT ON TABLE public.paikkatiedot
    IS 'Fleet Management -sovelluksesta saatavat tiedot';