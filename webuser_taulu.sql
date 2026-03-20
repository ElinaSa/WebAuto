-- Table: public.webuser

-- DROP TABLE IF EXISTS public.webuser;

CREATE TABLE IF NOT EXISTS public.webuser
(
    email character varying(200) COLLATE pg_catalog."default" NOT NULL,
    password character varying(64) COLLATE pg_catalog."default" NOT NULL,
    user_role character varying(30) COLLATE pg_catalog."default" NOT NULL DEFAULT 'opiskelija',
    CONSTRAINT webusers_pkey PRIMARY KEY (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.webuser
    OWNER to postgres;

REVOKE ALL ON TABLE public.webuser FROM websovellus;

GRANT ALL ON TABLE public.webuser TO autolainaus;

GRANT ALL ON TABLE public.webuser TO postgres;

GRANT SELECT, REFERENCES ON TABLE public.webuser TO websovellus;