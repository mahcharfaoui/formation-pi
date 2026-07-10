-- Migration V001: Création des tables du catalogue
-- Appliquée après la création des bases via init-db.sql

\c catalogue_db;

CREATE TABLE IF NOT EXISTS formation (
    id BIGSERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    categorie VARCHAR(100),
    duree INT NOT NULL DEFAULT 0,
    prix DECIMAL(10,2) DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chapitre (
    id BIGSERIAL PRIMARY KEY,
    formation_id BIGINT NOT NULL REFERENCES formation(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    ordre INT NOT NULL DEFAULT 0,
    contenu TEXT,
    video_url VARCHAR(500),
    duree INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chapitre_formation_id ON chapitre(formation_id);
CREATE INDEX idx_formation_categorie ON formation(categorie);
