## prerequisite

[nodejs](https://nodejs.org/en/download/)
[Laravel] (https://laravel.com)
PHP V7.3+ 
composer


## Installation

* git clone https://github.com/rnsharma93/covid_slayer.git
* go to server directory, run command - cd covid_slayer/server
* run command - composer install
* rename .env.example as .env and update database details (DB_HOST,DB_DATABASE,DB_USERNAME, DB_PASSWORD) and APP_URL 
* change GAME_DURATION time in seconds, default 60 seconds
* run command - php artisan migrate
* go to  client directory, covid_slayer/client 
* run command - npm install
* change local api url and production api url in .env file, api url should be server folder location
* run command - npm run start
