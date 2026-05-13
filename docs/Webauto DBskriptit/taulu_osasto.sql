-- Table: public.osasto

-- DROP TABLE IF EXISTS public.osasto;

CREATE TABLE IF NOT EXISTS public.osasto
(
    osasto character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT osasto_pkey PRIMARY KEY (osasto)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.osasto
    OWNER to postgres;

REVOKE ALL ON TABLE public.osasto FROM autolainaus;
REVOKE ALL ON TABLE public.osasto FROM websovellus;

GRANT INSERT, DELETE, SELECT, UPDATE ON TABLE public.osasto TO autolainaus;

GRANT ALL ON TABLE public.osasto TO postgres;

GRANT SELECT, REFERENCES ON TABLE public.osasto TO websovellus;