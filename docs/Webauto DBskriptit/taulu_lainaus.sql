-- Table: public.lainaus

-- DROP TABLE IF EXISTS public.lainaus;

CREATE TABLE IF NOT EXISTS public.lainaus
(
    lainausnumero integer NOT NULL DEFAULT nextval('lainaus_lainausnumero_seq'::regclass),
    tarkoitus character varying(30) COLLATE pg_catalog."default",
    hetu character(11) COLLATE pg_catalog."default" NOT NULL,
    rekisterinumero character varying(7) COLLATE pg_catalog."default" NOT NULL,
    palautus timestamp without time zone,
    lainausaika timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT lainaus_pkey PRIMARY KEY (lainausnumero),
    CONSTRAINT auto_lainaus_fk FOREIGN KEY (rekisterinumero)
        REFERENCES public.auto (rekisterinumero) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT lainaaja_lainaus_fk FOREIGN KEY (hetu)
        REFERENCES public.lainaaja (hetu) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT tarkoitus_lainaus_fk FOREIGN KEY (tarkoitus)
        REFERENCES public.tarkoitus (tarkoitus) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.lainaus
    OWNER to postgres;

REVOKE ALL ON TABLE public.lainaus FROM autolainaus;

GRANT INSERT, DELETE, SELECT, UPDATE ON TABLE public.lainaus TO autolainaus;

GRANT ALL ON TABLE public.lainaus TO postgres;

COMMENT ON TABLE public.lainaus
    IS 'Lainaustapahtuman tiedot';

COMMENT ON COLUMN public.lainaus.lainausnumero
    IS 'Lainaustapahtumalle automaattisesti annettava juokseva numero';

COMMENT ON COLUMN public.lainaus.hetu
    IS 'Kansallinen henkilötunnus';

COMMENT ON COLUMN public.lainaus.palautus
    IS 'Palautuksen päivä ja kellonaika';