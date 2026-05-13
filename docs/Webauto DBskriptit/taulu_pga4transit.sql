-- Table: public.pga4transit

-- DROP TABLE IF EXISTS public.pga4transit;

CREATE TABLE IF NOT EXISTS public.pga4transit
(
    lahtomittari numeric,
    tarkoitus text COLLATE pg_catalog."default",
    paluuosoite text COLLATE pg_catalog."default",
    paluumittari numeric,
    km numeric,
    lainaus text COLLATE pg_catalog."default",
    palautus text COLLATE pg_catalog."default",
    a_aika numeric,
    p_aika numeric
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.pga4transit
    OWNER to postgres;

REVOKE ALL ON TABLE public.pga4transit FROM websovellus;

GRANT ALL ON TABLE public.pga4transit TO postgres;

GRANT SELECT, REFERENCES ON TABLE public.pga4transit TO websovellus;