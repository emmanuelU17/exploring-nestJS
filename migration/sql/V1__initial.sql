CREATE TABLE IF NOT EXISTS category
(
    category_id BIGINT UNIQUE      NOT NULL AUTO_INCREMENT,
    name        VARCHAR(20) UNIQUE NOT NULL,
    parent_id   BIGINT,
    PRIMARY KEY (category_id),
    CONSTRAINT category_fk FOREIGN KEY (parent_id)
        REFERENCES category (category_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS item
(
    item_id BIGINT UNIQUE NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) UNIQUE NOT NULL,
    price DECIMAL(20, 3) NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (item_id),
    CONSTRAINT item_category_fk FOREIGN KEY (category_id)
        REFERENCES category (category_id) ON DELETE RESTRICT
);