-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    id bigSerial NOT NULL,
    email character varying(255),
    firstname character(255),
    lastname character(255),
    password_ character varying(255),
    datecreated timestamp with time zone DEFAULT now(),
    door integer DEFAULT 0
)