CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES 
    users(id) ON DELETE SET NULL,
    isbooked INT DEFAULT 0
)

INSERT INTO seats (isbooked)
SELECT 0 FROM generate_series(1, 20);