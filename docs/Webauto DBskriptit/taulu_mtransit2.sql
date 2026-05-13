-- Table: public.mtransit2

-- DROP TABLE IF EXISTS public.mtransit2;

CREATE TABLE IF NOT EXISTS public.mtransit2
(
    lahto_osoite character varying(50) COLLATE pg_catalog."default",
    lahtomittari integer,
    tarkoitus character varying(50) COLLATE pg_catalog."default",
    paluuosoite character varying(50) COLLATE pg_catalog."default",
    paluumittari integer,
    km numeric,
    lainaus character varying(50) COLLATE pg_catalog."default",
    palautus character varying(50) COLLATE pg_catalog."default",
    a_aika numeric,
    p_aika numeric,
    rekisterinumero character varying(50) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.mtransit2
    OWNER to postgres;

REVOKE ALL ON TABLE public.mtransit2 FROM autolainaus;
REVOKE ALL ON TABLE public.mtransit2 FROM websovellus;

GRANT SELECT, REFERENCES ON TABLE public.mtransit2 TO autolainaus;

GRANT ALL ON TABLE public.mtransit2 TO postgres;

GRANT SELECT, REFERENCES ON TABLE public.mtransit2 TO websovellus;