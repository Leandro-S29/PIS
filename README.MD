# RecipeNest 

Welcome to **RecipeNest** — your one-stop solution for discovering, sharing, and managing culinary recipes! We want users to explore a world of delightful recipes and add their own culinary creations to the mix.

## Features

- **User-Friendly Interface**: An intuitive design to browse, search, and add recipes effortlessly.
- **Recipe Categories**: Organize recipes by cuisines, meal types, or dietary preferences.
- **Community Contributions**: Share your favorite recipes and learn from others. (**On Going/Not implement yet**)
- **Favorites**: Save and revisit your favorite recipes anytime.
- **Category-Based Search**: Find recipes based on your favorite types of food.
- **Secure Authentication**: Sign up, log in in your profile with ease.

## Tech Stack

RecipeNest leverages the following technologies:

- **Backend**: [Node.js](https://nodejs.org/) | Javascript .
- **Frontend**: HTML.
- **Database**: [MySQL](https://www.mysql.com).
- **Authentication**: Self-Hosted and encrypted Authenticator.
- **API Integration**: [The Meal DB](https://www.themealdb.com).
- **Styling**: Custom CSS for an elegant UI.

## Installation

Follow these steps to set up RecipeNest locally:

1. Clone the repository:
   ```
   git clone https://github.com/Leandro-S29/PIS.git
   cd recipenest
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Insert our DataBase inside your Machine with the Script (The Views **MUST** be inserted into the DB too).
   - Change the BD Config file to your Machine Host

4. Start the application:
   ```
   nodemon app.js
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Explore Recipes**: Browse through a collection of submitted recipes. (**Admin Recipes Only** for NOW)
2. **Add Your Recipes**: Share your culinary ideas with the community. (Not implement) 
3. **Search**: Use our simple and easy search method, searching by the category of your favorite types of food.
4. **Save Favorites**: Click the heart icon to save recipes you love.

## Creators
- **Leandro Santos** | IPS Student
- **Guilherme Soares** | IPS Student

---

Thank you for checking out RecipeNest! If you have any questions, feel free to [open an issue](https://github.com/Leandro-S29/PIS/issues).
