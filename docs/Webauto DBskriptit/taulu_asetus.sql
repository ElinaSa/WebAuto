-- Table: public.asetus
 
-- DROP TABLE IF EXISTS public.asetus;
 
CREATE TABLE IF NOT EXISTS public.asetus

(

    avain character varying(30) COLLATE pg_catalog."default" NOT NULL,

    arvo character varying(255) COLLATE pg_catalog."default" NOT NULL,

    CONSTRAINT asetus_pkey PRIMARY KEY (avain)

)
 
TABLESPACE pg_default;
 
ALTER TABLE IF EXISTS public.asetus

    OWNER to postgres;
 