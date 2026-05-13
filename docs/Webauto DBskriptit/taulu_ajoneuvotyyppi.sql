-- Table: public.ajoneuvotyyppi

-- DROP TABLE IF EXISTS public.ajoneuvotyyppi;

CREATE TABLE IF NOT EXISTS public.ajoneuvotyyppi
(
    tyyppi character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT ajoneuvotyyppi_pkey PRIMARY KEY (tyyppi)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ajoneuvotyyppi
    OWNER to postgres;

REVOKE ALL ON TABLE public.ajoneuvotyyppi FROM autolainaus;

GRANT INSERT, DELETE, SELECT, UPDATE, REFERENCES ON TABLE public.ajoneuvotyyppi TO autolainaus;

GRANT ALL ON TABLE public.ajoneuvotyyppi TO postgres;