# RecipEZ
The base url is:
`localhost:4000/api/` 

Nodemon does auto-reloading the same way grunt does on the frontend.
| Endpoints | Actions | Intended Outcome |
| --- | --- | --- |
| users | GET | Gets list of all users |
| | POST | Create a new user. Respond with details of new user |
| | OPTIONS | |
| users/:id | GET | Get details of specified user |
| | PUT | Replace entire user with supplied user |
| | DELETE | Delete specified user |
| recipes | GET | Gets list of all recipes |
| | POST | Creates a new recipe. Responds with details of new recipe |
| | OPTIONS | |
| recipes/:id | GET | Get details of specified recipe |
| | PUT | Replace entire recipe with supplied recipe |
| | DELETE | Delete specified recipe |

## Users
* Name, email, and password are required
* No two users can have the same email

### Example POST/PUT request body
```
{
    "name": "Hanna Koh",
    "email": "hanna@koh.com",
    "password": "password1",
    "tags": ["American", "Japanese"]
}
```

## Recipes
* Name, time, and cost are required

### Example POST/PUT request body
```
{
    "name": "Mac and Cheese",
    "image": "http://cdn1.tmbi.com/TOH/Images/Photos/37/300x300/exps47665_SD143203C10_24_5b.jpg",
    "ingredients": [{"name": "Water", "quantity": 3, "unit": "cups"},
                    {"name": "Store-bought box of mac and cheese", "quantity": 1, "unit": "box"}],
    "directions": ["Boil 3 cups of water", "Boil pasta from box", "Mix cheese packet"],
    "time": 30,
    "cost": 3.50,
    "tags": ["American"]
}
```


