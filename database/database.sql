-- SQLBook: Code
CREATE DATABASE IF NOT EXISTS recipeGL;
USE recipeGL;

-- Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipe Categories Table
CREATE TABLE recipe_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Recipes Table
CREATE TABLE recipes (
    recipe_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    author_id INT,
    description TEXT NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    category_id INT,
    prep_time INT,
    price DOUBLE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES recipe_categories(category_id)
);

-- Ingredients Table
CREATE TABLE ingredients (
    ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Recipe Ingredients Table
CREATE TABLE recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    quantity VARCHAR(50) NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);


-- Recipe Instructions Table
CREATE TABLE recipe_instructions (
    instruction_id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT,
    step_number INT,
    instruction TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

-- Collections Table
CREATE TABLE collections (
    collection_id INT PRIMARY KEY AUTO_INCREMENT, 
    user_id INT NOT NULL,                         
    name VARCHAR(100) NOT NULL,                   
    description TEXT,                             
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
);

-- Favorites Table
CREATE TABLE Favorites (
    collection_id INT NOT NULL,                  
    recipe_id INT NOT NULL,                      
    PRIMARY KEY (collection_id, recipe_id),      
    FOREIGN KEY (collection_id) REFERENCES collections(collection_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

-- External Favorites Table
CREATE TABLE External_Favorites (
    collection_id INT NOT NULL,                   
    external_recipe_id INT NOT NULL,  
    PRIMARY KEY (collection_id, external_recipe_id),
    FOREIGN KEY (collection_id) REFERENCES collections(collection_id) ON DELETE CASCADE
);



-- View to Get Recipe Details with Ingredients and Instructions
CREATE VIEW recipe_details_with_instructions AS
SELECT 
    r.recipe_id,
    r.name AS recipe_name,
    r.description AS recipe_description,
    CONCAT(r.prep_time, ' minutes') AS preparation_time,
    r.difficulty AS difficulty,
    r.price AS price,
    r.image_url AS image_url,  -- Added image_url here

    (SELECT GROUP_CONCAT(CONCAT(i.name, ' (', ri_ingredients.quantity, ')') 
                         ORDER BY i.name SEPARATOR ', ')
     FROM recipe_ingredients ri_ingredients
     JOIN ingredients i ON ri_ingredients.ingredient_id = i.ingredient_id
     WHERE ri_ingredients.recipe_id = r.recipe_id) AS ingredients,
    
    rc.name AS category_name,
    
    (SELECT GROUP_CONCAT(CONCAT('Step ', ri_instructions.step_number, ': ', ri_instructions.instruction) 
                         ORDER BY ri_instructions.step_number SEPARATOR ' | ')
     FROM recipe_instructions ri_instructions
     WHERE ri_instructions.recipe_id = r.recipe_id) AS instructions,
    
    u.username AS created_by,
    r.created_at AS created_at
FROM 
    recipes r
JOIN 
    recipe_categories rc ON r.category_id = rc.category_id
JOIN 
    users u ON r.author_id = u.user_id
ORDER BY 
    r.recipe_id;


-- View to Get Collection Favorites Including External Recipes
CREATE VIEW collection_favorites AS
SELECT 
    c.collection_id,
    c.user_id,
    c.name AS collection_name,
    c.description,
    c.created_at,
    f.recipe_id,
    r.name AS recipe_name,
    r.description AS recipe_description,
    r.image_url AS recipe_image_url,
    NULL AS external_recipe_id
FROM 
    collections c
LEFT JOIN 
    Favorites f ON c.collection_id = f.collection_id
LEFT JOIN 
    recipes r ON f.recipe_id = r.recipe_id

UNION

SELECT 
    c.collection_id,
    c.user_id,
    c.name AS collection_name,
    c.description,
    c.created_at,
    NULL AS recipe_id,
    NULL AS recipe_name,
    NULL AS recipe_description,
    NULL AS recipe_image_url,
    ef.external_recipe_id
FROM 
    collections c
LEFT JOIN 
    External_Favorites ef ON c.collection_id = ef.collection_id;



-- Data to Insert

-- Insert Recipe Categories
INSERT INTO recipe_categories (category_id, name) VALUES
(1, 'Beef'),
(2, 'Breakfast'),
(3, 'Chicken'),
(4, 'Dessert'),
(5, 'Goat'),
(6, 'Lamb'),
(7, 'Miscellaneous'),
(8, 'Pasta'),
(9, 'Pork'),
(10, 'Seafood'),
(11, 'Side'),
(12, 'Starter'),
(13, 'Vegan'),
(14, 'Vegetarian');

-- Insert Ingredients
INSERT INTO ingredients (name) VALUES
('Basil'),
('Beef'),
('Butter'),
('Carrot'),
('Cheese'),
('Chicken Breast'),
('Egg'),
('Flour'),
('Garlic'),
('Lemon'),
('Milk'),
('Mushroom'),
('Olive Oil'),
('Onion'),
('Pasta'),
('Salt'),
('Shrimp'),
('Spinach'),
('Sugar'),
('Tomato');

-- Insert Admin Account 
INSERT INTO users (username, email, password) VALUES
('admin','admin@admin.com','$2a$10$1yDYtSJppihwIF/yblNW.O1q20b7ewDvTRbDl4ZnQa8pO8h.V1h1m');

-- Insert Recipes
INSERT INTO recipes (name, author_id, description, difficulty, category_id, prep_time, image_url) VALUES
('Garlic Butter Shrimp', 1, 'Juicy shrimp cooked in a rich garlic butter sauce.', 'Easy', 10, 20, 'https://imgs.search.brave.com/KBU8s6u-poiFOlDx9ybDIcjm6gXUrrWS4FX1gyAZSVQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/am9jb29rcy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjEv/MDkvZ2FybGljLWJ1/dHRlci1zaHJpbXAt/MS02LmpwZw'),
('Classic Beef Stew', 1, 'Hearty stew made with tender beef chunks and vegetables.', 'Medium', 1, 120, 'https://imgs.search.brave.com/nezOO9dzBmPcXiplZ38K8Z7gFm7NKYfWfB0EGO7m9FI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwMS5ueXQuY29t/L2ltYWdlcy8yMDI0/LzEwLzI4L211bHRp/bWVkaWEvYmVlZi1z/dGV3LW1sZmsvYmVl/Zi1zdGV3LW1sZmst/anVtYm8uanBn'),
('Vegetarian Pasta Primavera', 1, 'Fresh vegetables tossed with pasta in a light sauce.', 'Easy', 14, 30, 'https://imgs.search.brave.com/k8URnCvLnmJm6Y4C3JFEjagC2AuJdiLaveqyA3ySMag/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YWNvdXBsZWNvb2tz/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMC8wMy9WZWdh/bi1QYXN0YS1Qcmlt/YXZlcmEtMDAyLmpw/Zw'),
('Lemon Garlic Chicken', 1, 'Flavorful chicken breast cooked with lemon and garlic.', 'Medium', 3, 40, 'https://imgs.search.brave.com/uuqgiIxkDDMFhZdEDs4G1CmmKuAzOjhzvQdQlxEtu5U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGhlZW5kbGVzc21l/YWwuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzA4L0xl/bW9uLUdhcmxpYy1D/aGlja2VuLU1hcmlu/YWRlLTMuanBn'),
('Chocolate Lava Cake', 1, 'Decadent dessert with a gooey chocolate center.', 'Hard', 4, 60, 'https://imgs.search.brave.com/7yiXRrCfAJwuiGBbwNzoQD012HJI4YjQusm2WkYX2s8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzExLzEyLzk4LzE0/LzM2MF9GXzExMTI5/ODE0NjZfV241ZmI5/cTdubkM1SHdZRjI3/bTdmZFV0NjRtZkVF/MHguanBn'),
('Chicken Alfredo', 1, 'Creamy pasta with tender chicken pieces in a rich Alfredo sauce.', 'Medium', 8, 30, 'https://imgs.search.brave.com/MCri5K56y_GIojGdKM3h7nP2z5DBKqwJlPDWLOtTVCk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YnVkZ2V0Ynl0ZXMu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIyLzA3L0NoaWNr/ZW4tQWxmcmVkby1h/Ym92ZS5qcGc'),
('Grilled Lamb Chops', 1, 'Succulent lamb chops grilled to perfection with a garlic herb marinade.', 'Hard', 6, 40, 'https://imgs.search.brave.com/xw539Pn0mKDte00WLpXYTRmdSxBq7mhoe7fEeqHmi_s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA2LzYwLzIyLzI3/LzM2MF9GXzY2MDIy/Mjc4OV9kbjdQUmtk/MUJPNUJpTUkzTlBX/d05kczI4OWwyM1JG/UC5qcGc'),
('Vegan Tacos', 1, 'Tacos filled with seasoned vegetables, perfect for a plant-based meal.', 'Easy', 13, 20, 'https://imgs.search.brave.com/r6eXPPG1DaQV-pYLzi-jbWygdTyvlp8NxdaIMnUHW9s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGVsaXNoa25vd2xl/ZGdlLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvQ3Jpc3B5LVZl/Z2FuLVRhY29zLXdp/dGgtUXVlc28tRGlw/cGluZy1TYXVjZV85/LmpwZw'),
('Pork Schnitzel', 1, 'Crispy breaded pork cutlets served with a tangy lemon sauce.', 'Medium', 9, 25, 'https://imgs.search.brave.com/aCMGJpo1BK_lUPEn5NflIZyqt68-scj-o_syajKjRHI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/am9jb29rcy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTkv/MDQvcG9yay1zY2hu/aXR6ZWwtMS0xMi5q/cGc');


-- Garlic Butter Shrimp Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(1, 17, '500g'), -- Shrimp
(1, 9, '3 cloves'), -- Garlic
(1, 3, '2 tbsp'), -- Butter
(1, 16, '1 tsp'); -- Salt

-- Classic Beef Stew Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(2, 2, '500g'), -- Beef
(2, 14, '1 large'), -- Onion
(2, 4, '2'), -- Carrots
(2, 19, '3'), -- Tomatoes
(2, 16, '1 tsp'), -- Salt
(2, 13, '2 tbsp'); -- Olive Oil

-- Vegetarian Pasta Primavera Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(3, 15, '250g'), -- Pasta
(3, 4, '2'), -- Carrots
(3, 18, '100g'), -- Spinach
(3, 11, '100ml'), -- Milk
(3, 13, '1 tbsp'), -- Olive Oil
(3, 16, '1 tsp'); -- Salt

-- Lemon Garlic Chicken Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(4, 6, '2 pieces'), -- Chicken Breast
(4, 17, '1'), -- Lemon
(4, 9, '2 cloves'), -- Garlic
(4, 13, '2 tbsp'), -- Olive Oil
(4, 16, '1 tsp'); -- Salt

-- Chocolate Lava Cake Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(5, 19, '100g'), -- Sugar
(5, 3, '100g'), -- Butter
(5, 8, '100g'), -- Flour
(5, 7, '2'), -- Eggs
(5, 5, '100g'); -- Chocolate

-- Chicken Alfredo Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(6, 6, '2 pieces'), -- Chicken Breast
(6, 15, '300g'), -- Pasta
(6, 9, '2 cloves'), -- Garlic
(6, 3, '100g'), -- Butter
(6, 18, '100g'), -- Spinach
(6, 11, '200ml'), -- Milk
(6, 13, '2 tbsp'); -- Olive Oil

-- Grilled Lamb Chops Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(7, 6, '4 pieces'), -- Lamb Chops
(7, 9, '4 cloves'), -- Garlic
(7, 13, '3 tbsp'), -- Olive Oil
(7, 16, '1 tsp'), -- Salt
(7, 18, '1 tsp'); -- Rosemary

-- Vegan Tacos Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(8, 4, '2'), -- Carrots
(8, 18, '100g'), -- Spinach
(8, 19, '1'), -- Tomato
(8, 16, '1 tsp'), -- Salt
(8, 12, '1 tbsp'); -- Olive Oil

-- Pork Schnitzel Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(9, 2, '500g'), -- Pork
(9, 8, '100g'), -- Flour
(9, 7, '2'), -- Eggs
(9, 19, '2 tbsp'), -- Lemon
(9, 3, '100g'); -- Butter


-- Insert Recipe Instructions

-- Insert Recipe Instructions for Garlic Butter Shrimp
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
(1, 1, 'Preheat the oven to 180°C (350°F).'),
(1, 2, 'In a large skillet, melt the butter over medium heat.'),
(1, 3, 'Add garlic and cook until fragrant, about 1 minute.'),
(1, 4, 'Add shrimp and cook for 5-7 minutes until pink and cooked through.'),
(1, 5, 'Season with salt and serve immediately.');

-- Insert Recipe Instructions for Classic Beef Stew
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
(2, 1, 'Brown the beef in a large pot over medium heat.'),
(2, 2, 'Add the onions and carrots, and cook until softened.'),
(2, 3, 'Add the tomatoes, broth, and seasonings, and simmer for 1-2 hours.');

-- Insert Recipe Instructions for Vegetarian Pasta Primavera
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
(3, 1, 'Cook pasta according to package directions.'),
(3, 2, 'In a large skillet, heat olive oil over medium heat.'),
(3, 3, 'Add carrots and cook for about 5 minutes until tender.'),
(3, 4, 'Add spinach and cook until wilted.'),
(3, 5, 'Add cooked pasta and milk, and toss to combine.'),
(3, 6, 'Season with salt and serve.');

-- Insert Recipe Instructions for Lemon Garlic Chicken
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
(4, 1, 'Preheat oven to 180°C (350°F).'),
(4, 2, 'In a small bowl, combine lemon juice, garlic, and olive oil.'),
(4, 3, 'Season the chicken breasts with salt and coat with the lemon-garlic mixture.'),
(4, 4, 'Place the chicken breasts in the oven and bake for 30-40 minutes, until cooked through.');

-- Insert Recipe Instructions for Chocolate Lava Cake
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
(5, 1, 'Preheat the oven to 200°C (400°F).'),
(5, 2, 'In a bowl, melt the butter and chocolate together.'),
(5, 3, 'Add sugar, flour, and eggs, and mix until smooth.'),
(5, 4, 'Pour the batter into greased ramekins and bake for 12-15 minutes, until the edges are set and the center is slightly soft.'),
(5, 5, 'Let the cakes cool for 2 minutes before serving.');

-- Insert Recipe Instructions for Chicken Alfredo
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
(6, 1, 'Cook pasta according to package directions.'),
(6, 2, 'In a large skillet, heat olive oil over medium heat and cook chicken until browned and cooked through.'),
(6, 3, 'Remove chicken and set aside.'),
(6, 4, 'In the same skillet, add garlic and cook until fragrant.'),
(6, 5, 'Add milk and butter to the skillet, stirring until the sauce thickens.'),
(6, 6, 'Return chicken to the skillet, and add spinach. Toss to combine.'),
(6, 7, 'Serve over pasta.');

-- Insert Recipe Instructions for Grilled Lamb Chops
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
(7, 1, 'Preheat grill to medium-high heat.'),
(7, 2, 'In a small bowl, mix garlic, olive oil, rosemary, and salt.'),
(7, 3, 'Rub the lamb chops with the garlic herb marinade and let sit for 10 minutes.'),
(7, 4, 'Grill lamb chops for 4-5 minutes on each side for medium-rare, or longer for desired doneness.'),
(7, 5, 'Let rest before serving.');

-- Insert Recipe Instructions for Vegan Tacos
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
(8, 1, 'Heat olive oil in a skillet over medium heat.'),
(8, 2, 'Add carrots and cook until softened, about 5 minutes.'),
(8, 3, 'Add spinach and cook until wilted.'),
(8, 4, 'Season with salt and remove from heat.'),
(8, 5, 'Serve in taco shells and garnish with fresh vegetables.');

-- Insert Recipe Instructions for Pork Schnitzel
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
(9, 1, 'Preheat the oven to 180°C (350°F).'),
(9, 2, 'Season the pork cutlets with salt.'),
(9, 3, 'Dip the cutlets in flour, then beaten eggs, then breadcrumbs.'),
(9, 4, 'In a large skillet, melt butter over medium heat and fry the cutlets until golden brown on both sides.'),
(9, 5, 'Serve with a lemon wedge.');





