-- Table: public.web_paikkatieto

-- DROP TABLE IF EXISTS public.web_paikkatieto;

CREATE TABLE IF NOT EXISTS public.web_paikkatieto
(
    paikkatieto_id integer NOT NULL,
    lainausnumero integer NOT NULL,
    a_kaupunki character varying(30) COLLATE pg_catalog."default" NOT NULL,
    a_katu character varying(30) COLLATE pg_catalog."default" NOT NULL,
    a_katunumero character varying(10) COLLATE pg_catalog."default" NOT NULL,
    b_katu character varying(30) COLLATE pg_catalog."default" NOT NULL,
    b_kaupunki character varying(30) COLLATE pg_catalog."default" NOT NULL,
    b_katunumero character varying(10) COLLATE pg_catalog."default" NOT NULL,
    alku_km integer NOT NULL,
    loppu_km integer NOT NULL,
    CONSTRAINT webpaikkatieto_pk PRIMARY KEY (paikkatieto_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.web_paikkatieto
    OWNER to postgres;

REVOKE ALL ON TABLE public.web_paikkatieto FROM autolainaus;
REVOKE ALL ON TABLE public.web_paikkatieto FROM websovellus;

GRANT INSERT, DELETE, SELECT, UPDATE ON TABLE public.web_paikkatieto TO autolainaus;

GRANT ALL ON TABLE public.web_paikkatieto TO postgres;

GRANT SELECT, UPDATE, REFERENCES ON TABLE public.web_paikkatieto TO websovellus;

COMMENT ON COLUMN public.web_paikkatieto.alku_km
    IS 'Matkamittarin lukema metreinä, jaa 1000:lla';

COMMENT ON COLUMN public.web_paikkatieto.loppu_km
    IS 'Matkamittarin lukema metreinä, jaa 1000:lla';