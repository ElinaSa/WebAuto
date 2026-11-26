-- Table: public.api_ajopaivakirja

-- DROP TABLE IF EXISTS public.api_ajopaivakirja;

CREATE TABLE IF NOT EXISTS public.api_ajopaivakirja
(

CREATE TABLE IF NOT EXISTS public.paikannin_ajot (
    id BIGINT NOT NULL,
    device_id BIGINT NOT NULL,
    rekisterinumero VARCHAR(20) NOT NULL,

    drive_start_id BIGINT,
    drive_stop_id BIGINT,

    start_time TIMESTAMPTZ,
    stop_time TIMESTAMPTZ,

    start_lat NUMERIC(12,8),
    start_lon NUMERIC(12,8),
    stop_lat NUMERIC(12,8),
    stop_lon NUMERIC(12,8),

    start_odo BIGINT,
    stop_odo BIGINT,

    distance_m NUMERIC(12,2),
    calculated_distance_m NUMERIC(14,3),
    drive_trip NUMERIC(12,2),

    driver_identification TEXT,
    job_number TEXT,
    job_description TEXT,

    missing_begin BOOLEAN,
    missing_end BOOLEAN,
    missing_data BOOLEAN,

    route_start_position JSONB,
    route_stop_position JSONB,

    all_drivers JSONB,
    points JSONB,

    raw_data JSONB NOT NULL,

    imported_at TIMESTAMPTZ DEFAULT NOW(),

    PRIMARY KEY (device_id, id)
);

CREATE INDEX idx_api_ajopaivakirja_rekisteri_aika
ON public.api_ajopaivakirja
(rekisterinumero, start_time);


TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.api_ajopaivakirja
    OWNER to postgres;

REVOKE ALL ON TABLE public.api_ajopaivakirja FROM websovellus;

GRANT ALL ON TABLE public.api_ajopaivakirja TO postgres;

GRANT INSERT, SELECT, REFERENCES ON TABLE public.api_ajopaivakirja TO websovellus;