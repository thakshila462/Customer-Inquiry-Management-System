-- Staff users table
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       full_name VARCHAR(100) NOT NULL,
                       email VARCHAR(150) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer inquiries table
CREATE TABLE inquiries (
                           id SERIAL PRIMARY KEY,

                           customer_name VARCHAR(100) NOT NULL,
                           contact_info VARCHAR(150) NOT NULL,

                           subject VARCHAR(200) NOT NULL,
                           description TEXT NOT NULL,

                           status VARCHAR(20) NOT NULL DEFAULT 'NEW'
                               CHECK (status IN ('NEW', 'IN_PROGRESS', 'RESOLVED')),

                           created_by INTEGER NOT NULL
                               REFERENCES users(id),

                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'inquiries')
ORDER BY table_name;

INSERT INTO users (full_name, email, password_hash)
VALUES (
           'Anjana Jayalath',
           'anjana@gmail.com',
           '$2b$12$LJ2bL9isblJ.ak.PTCjGY.EoOyTsivpHqvLsh4kfpI2.47/WC69au
'
       );

UPDATE users
SET password_hash = '$2b$12$wAOdkvyvTj4ZxO3MizoFqexb5a9q/xTkQl68G40Pe38T5ppNm2qRO'
WHERE email = 'anjana@gmail.com';


DELETE FROM users;

SELECT id, full_name, email, created_at
FROM users;

SELECT * FROM users;
SELECT id, full_name, email, password_hash
FROM users
WHERE email = 'staff@example.com';

DROP TABLE IF EXISTS inquiries;
DROP TABLE IF EXISTS users;

SELECT id, full_name, email,
       LENGTH(password_hash) AS hash_length
FROM users
WHERE LOWER(email) = LOWER('anjana@gmail.com');