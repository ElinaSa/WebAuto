-- Table: public.tarkoitus

-- DROP TABLE IF EXISTS public.tarkoitus;

CREATE TABLE IF NOT EXISTS public.tarkoitus
(
    tarkoitus character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tarkoitus_pk PRIMARY KEY (tarkoitus)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tarkoitus
    OWNER to postgres;

REVOKE ALL ON TABLE public.tarkoitus FROM autolainaus;

GRANT INSERT, DELETE, SELECT, TRIGGER, UPDATE, REFERENCES ON TABLE public.tarkoitus TO autolainaus;

GRANT ALL ON TABLE public.tarkoitus TO postgres;