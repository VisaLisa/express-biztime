CREATE DATABASE biztime;
\c biztime;

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS industries CASCADE;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE
);

CREATE TABLE company_industry (
    id serial PRIMARY KEY,
    industry_code text NOT NULL REFERENCES industries (code) ON DELETE CASCADE,
    company text NOT NULL REFERENCES companies (code) ON DELETE CASCADE
);


INSERT INTO companies (code, name, description)
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code, industry)
  VALUES ('tech', 'Technology'),
         ('soft', 'Software'),
         ('hard', 'Hardware');

INSERT INTO companies_industries (company, industry_code)
  VALUES ('apple', 'hard'),
         ('ibm', 'hard');
