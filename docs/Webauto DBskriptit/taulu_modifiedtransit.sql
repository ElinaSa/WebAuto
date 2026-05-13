-- Table: public.modifiedtransit

-- DROP TABLE IF EXISTS public.modifiedtransit;

CREATE TABLE IF NOT EXISTS public.modifiedtransit
(
    lahto_osoite character varying(50) COLLATE pg_catalog."default",
    lahtomittari integer,
    tarkoitus character varying(50) COLLATE pg_catalog."default",
    paluuosoite character varying(50) COLLATE pg_catalog."default",
    paluumittari integer,
    km character varying(50) COLLATE pg_catalog."default",
    lainaus character varying(50) COLLATE pg_catalog."default",
    palautus character varying(50) COLLATE pg_catalog."default",
    a_aika character varying(50) COLLATE pg_catalog."default",
    p_aika character varying(50) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.modifiedtransit
    OWNER to postgres;