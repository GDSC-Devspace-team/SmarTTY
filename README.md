# SmarTTY

Website: https://smartty.vercel.app/

> In computing, tty is a command in Unix and Unix-like operating systems to print the file name of the terminal connected to standard input. tty stands for TeleTYpewriter.

## Installation:

### Prerequisites:
- `node 14 or later`
- `yarn`

### Steps:

1. Install all the dependencies with `yarn install`
2. Build the tailwind css using `yarn tailwind`
3. Rebuild the project with `yarn rebuild`
4. Start the app with `yarn start`

## Screenshots:
![image](https://user-images.githubusercontent.com/74904820/163593893-92fab730-d81b-40ba-8f38-536352a6af50.png)


## Video on how to run:

https://user-images.githubusercontent.com/88224695/163598930-d56a1dd6-f606-4b48-8b01-b99fd226a148.mp4


## What problem are we solving?  

CLIs have been around for decades but there has been no significantly new ways to use them. We've decided to change that using SmarTTY. SmarTTY is voice assisted natural human language understanding Terminal which can help you perform CLI tasks with much ease. So you leave behind wasting time googling for commands and spend more time coding your applications!

<br>

## What is SmarTTY?  

Ever bored of writing the same CLI commands like `npx create-react-app my-app `or `django-admin createproject my project `or wasting time googling various other such commands? Or are you tired of pressing the up arrow key for that commands you typed 3 hours ago? What if you could say something like "create a react app named my-app" or "create a django project named my project" and have the terminal understand what to do just by using natural human language?

<br>

## How does SmarTTY work?  

SmarTTY uses electronjs as the container with xtermjs for the UI of the terminal and node-pty for connecting the shell with UI.
This will make up the SmarTTY terminal. Pretty simple so far. Now we add the magic to the recipe using Symbl.ai. We make use
Symbl.ai to understand natural human conversation and recognize the entities and intents. This is then used to recognize various CLI commands and execute them with ease.

## Sample Commands
- `show all directories`
- `make a new folder <folder name>`
- `move into folder <folder_name>`
