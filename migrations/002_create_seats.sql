CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES 
    users(id) ON DELETE SET NULL,
    isbooked INT DEFAULT 0
)