-- Table: public.auto

-- DROP TABLE IF EXISTS public.auto;

CREATE TABLE IF NOT EXISTS public.auto
(
    rekisterinumero character varying(7) COLLATE pg_catalog."default" NOT NULL,
    kaytettavissa boolean NOT NULL DEFAULT true,
    merkki character varying(30) COLLATE pg_catalog."default" NOT NULL,
    malli character varying(20) COLLATE pg_catalog."default" NOT NULL,
    vuosimalli character(4) COLLATE pg_catalog."default" NOT NULL,
    henkilomaara integer,
    tyyppi character varying COLLATE pg_catalog."default",
    automaatti boolean NOT NULL,
    vastuuhenkilo character varying(30) COLLATE pg_catalog."default",
    kuva bytea,
    osasto character varying(30) COLLATE pg_catalog."default",
    deviceid character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT auto_pkey PRIMARY KEY (rekisterinumero),
    CONSTRAINT ajoneuvotyyppi_fk FOREIGN KEY (tyyppi)
        REFERENCES public.ajoneuvotyyppi (tyyppi) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.auto
    OWNER to postgres;

REVOKE ALL ON TABLE public.auto FROM autolainaus;
REVOKE ALL ON TABLE public.auto FROM websovellus;

GRANT INSERT, DELETE, SELECT, UPDATE ON TABLE public.auto TO autolainaus;

GRANT ALL ON TABLE public.auto TO postgres;

GRANT SELECT ON TABLE public.auto TO websovellus;

COMMENT ON TABLE public.auto
    IS 'Ajoneuvon perustiedot';

COMMENT ON COLUMN public.auto.osasto
    IS 'Rasekon osasto, jonka autosta on kyse';