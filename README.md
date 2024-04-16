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
[Backlog](https://docs.google.com/document/d/1qtNMQAEP9aWnK6pfo39iGT0Dhm9uwL6oDHdy6B-Vy-4/edit#heading=h.mgz5ua27kudv)

### Minimum Viable Product(MVP):
[MVP Doc link](https://docs.google.com/document/d/1Dqdo4Uw-TbotZB-qz9TD10u000-2M7HP1iOVBlIGznc/edit)

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
