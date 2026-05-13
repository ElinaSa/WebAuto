-- Table: public.siirto

-- DROP TABLE IF EXISTS public.siirto;

CREATE TABLE IF NOT EXISTS public.siirto
(
    rekisterinumero character varying(7) COLLATE pg_catalog."default",
    merkki character varying(30) COLLATE pg_catalog."default",
    malli character varying(30) COLLATE pg_catalog."default",
    tarkoitus character varying(30) COLLATE pg_catalog."default",
    hetu character varying(11) COLLATE pg_catalog."default",
    etunimi character varying(50) COLLATE pg_catalog."default",
    sukunimi character varying(50) COLLATE pg_catalog."default",
    otto timestamp without time zone,
    palautus timestamp without time zone
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.siirto
    OWNER to postgres;