CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(75) NOT NULL,
    email VARCHAR(322) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
    CHECK(char_length(password) >= 8),
    isVerified Boolean DEFAULT false,
    refresh_token TEXT,
    verification_token TEXT,
    reset_password_token TEXT, 
    reset_password_expiry TIMESTAMPTZ,

    create_at TIMESTAMPTZ DEFAULT NOW(),
    update_at TIMESTAMPTZ DEFAULT NOW()
);