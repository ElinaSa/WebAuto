-- Table: public.lainaaja

-- DROP TABLE IF EXISTS public.lainaaja;

CREATE TABLE IF NOT EXISTS public.lainaaja
(
    hetu character(11) COLLATE pg_catalog."default" NOT NULL,
    etunimi character varying(50) COLLATE pg_catalog."default" NOT NULL,
    sukunimi character varying(50) COLLATE pg_catalog."default" NOT NULL,
    ajokorttiluokka character varying(6) COLLATE pg_catalog."default" NOT NULL,
    automaatti boolean NOT NULL,
    sahkoposti character varying(30) COLLATE pg_catalog."default",
    CONSTRAINT lainaaja_pkey PRIMARY KEY (hetu)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.lainaaja
    OWNER to postgres;

REVOKE ALL ON TABLE public.lainaaja FROM autolainaus;

GRANT INSERT, DELETE, SELECT, UPDATE ON TABLE public.lainaaja TO autolainaus;

GRANT ALL ON TABLE public.lainaaja TO postgres;

COMMENT ON TABLE public.lainaaja
    IS 'Lainaajan (opiskelija tai ope) perustiedot';

COMMENT ON COLUMN public.lainaaja.hetu
    IS 'Kansallinen henkilötunnus';

COMMENT ON COLUMN public.lainaaja.ajokorttiluokka
    IS 'Esim. AB tai ABCE';

COMMENT ON COLUMN public.lainaaja.sahkoposti
    IS 'Rasekon sähköpostiosoite';