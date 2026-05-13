-- Table: public.paikkatieto

-- DROP TABLE IF EXISTS public.paikkatieto;

CREATE TABLE IF NOT EXISTS public.paikkatieto
(
    kirjaus_id integer NOT NULL DEFAULT nextval('paikkatieto_kirjaus_id_seq'::regclass),
    device_id integer NOT NULL,
    drive_start_timest character varying(30) COLLATE pg_catalog."default" NOT NULL,
    drive_stop_timest character varying(30) COLLATE pg_catalog."default" NOT NULL,
    route_start_position json NOT NULL,
    route_stop_position json NOT NULL,
    drive_start_odo integer NOT NULL,
    drive_stop_odo integer NOT NULL,
    CONSTRAINT paikkatieto_pkey PRIMARY KEY (kirjaus_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.paikkatieto
    OWNER to postgres;

REVOKE ALL ON TABLE public.paikkatieto FROM autolainaus;
REVOKE ALL ON TABLE public.paikkatieto FROM websovellus;

GRANT INSERT, SELECT, REFERENCES ON TABLE public.paikkatieto TO autolainaus;

GRANT ALL ON TABLE public.paikkatieto TO postgres;

GRANT INSERT, SELECT, REFERENCES ON TABLE public.paikkatieto TO websovellus;