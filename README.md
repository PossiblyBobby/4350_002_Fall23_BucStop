# BucStop
### A Team About the Same as Bobby Project
### Members:
> Dan Tucker,      Isaac Simmons,      Tyson Bailey,
> 
> Anthony Vandergriff,      Chris Boyle,      Christian Crawford,
> 
> Grant Scutt,      Jean Bilong,      Jerry Galloway 

>  

#### CSCI 4350
#### Spring 2024, East Tennessee State University

### Overview:
This project is a game website made by and for ETSU students. It
is a place to put games created by ETSU students.
This project also communicates to a microservice with HTTP calls for the game information, the repository is hosted at [Micro Service](https://github.com/chrisseals98/GameInfoMicroService). It is deployed with the microservice using docker compose, see the scripts folder for the docker-compose.yml file.

### Backlog Information:
[Backlog](https://docs.google.com/document/d/1R9BcMio3UEcsW12iHYqRMY6N7B0hxiBK3DDSbcMKfIk/edit)

### Minimum Viable Product(MVP):
[MVP Doc link](https://docs.google.com/document/d/1Dqdo4Uw-TbotZB-qz9TD10u000-2M7HP1iOVBlIGznc/edit)

### Discord That We Used: 
[Discord Link](https://discord.gg/PY2gBgAKA9)
This is the Discord we used to work on the project. You can find conversations we had and
details you may need in order to work on the project this semester. Feel free to reach out to
us if you have any questions or need anything from us.

### Trello Board:
[Trello Link](https://trello.com/b/wSL8hHWm/about-the-same-as-bobby)
Trello board used to maintain the product backlog, sprint backlog, tasks, tasks completed,
and tasks completed in older sprints. You all can build on this to keep the project moving
forward. It will also provide you with some insight on what was previously completed and
how the process works.
Whenever you all join, you must contact an admin in order to change ownership of the
board. Just ping us on Discord and we will do that for you.

### Project Structure: 
To understand the project structure, familiarize yourself with the
MVC (Model View Controller) structure. When clicking on a game, 
a value will be passed to the controller, which will decide which 
game to load. This is divided between the MVC folders in the main
BucStop folder.

* Bucstop
	* Controllers
		* This folder has the controllers, which allow pages to 
			link together and pass information between them.
	* Models
		* This folder has the basis for the Game class.
	* Views
		* Games
			* This folder has the pages related to games, such as
				the index page and the default game page.
		* Home
			* This folder contains the main pages used by the site, 				
				such as the home page, admin page, and privacy page.
		* Shared 
			* This contains other important pages and/or resources 
				that aren't in the other two folders, including the
				default layout and the error page.
	* wwwroot
		* This folder contains the resources used by the project, 
			including images, the javascript games, the icons, etc.

### Project Architecture
[Goal for Project Architecture from Kinser](https://docs.google.com/document/d/1IBXFvhZrVZ5nEolayhD6J-PbU-ONx0ku-wSjetUB8IE/edit?usp=sharing)

### Help
For more documentation on how to run locally and how to set up deployments, see the docs below:
* [Running Locally](https://docs.google.com/document/d/1gfUpjZNfqWyv1ohUW1IaS8fOhXp0hOx6tFQVXBADa8Q/edit?usp=sharing)
* [How to Deploy](https://docs.google.com/document/d/1i0edcmvZm_j0zQLYiigNliW39FJuJbmhkxOCCb2NbVs/edit?usp=sharing)
* [Source Control Assistance](https://github.com/etsuDummy/KinserPedia/blob/main/GitHub%20Made%20Simple.pdf)
* [API Documentation](https://docs.google.com/document/d/1ZZ2wTub31NNqngSxBfGFOeK515jikKWqSBRc5ueS1bU/edit)
