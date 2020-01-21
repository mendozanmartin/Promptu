# Promptu

<p align="center">
  <img width="auto" height="400" src="images/promptu.png">
</p>

## Inspiration

For the TOHacks-2019 Hackathon, my team and I decided to take on the challenge of bringing light to certain social issues. Instead of tackling one social issue, we decided to tackle all of them. Behold Promptu, the social platform for raising awareness using natural language processing and a unique dataset called Quick Draw by Google.

## What it does

People who pass by a Promptu billboard (mural) will be invited to visit a website on their mobile device via short URL, NFC or QR code (for ease of access). On the mural, they will see a prompt such as "What's your favourite animal". Through their phone, the user will be able to answer that question and in turn receive 3 drawings sourced from Google's Quickdraw dataset. Once they pick one of the three drawings, they will see their drawing pop up on the big screen with a fact about the animal (at the moment, the fact shows on your phone). On your mobile screen, you will be invited to take action. The action can come in the form of an email subscription, online donations, visiting a website, signing a petition + more. Once a mural becomes full of drawings, the screen will be captured and refreshed (to be stored on external website/social media).

## How we built it

- Google DialogFlow
- Node.js + Socket.io + various libraries
- Google Quickdraw Dataset (AI)
- P5.js
- Google Speech-to-Text API

## View a live demo

1. Open two separate browsers, one on your phone and one preferably on a desktop/laptop.
2. On the desktop client, click 'Begin'.
3. Now on your phone, click the 'record' button and say your favorite animal (you can say however you would like).
4. To get a statistic and link on your phone, pick from the following animals (figure out which animals can be drawn):
  * Lion
  * Rhino
  * Sea turtle
  * Shark
  * Tiger
5. Pick one of the drawn animals and you should see it appear on the desktop (and be amazed).

<b>Mobile Client</b>
https://speechtodrawhack.herokuapp.com

<b>Desktop Client</b>
https://promptuhack.herokuapp.com

## My role

My Role in the hackathon was to make the magic happen (just kidding). I primarily worked on implementing the back-end API calls such as the Cloud Speech-to-Text API and the DialogFlow natural language processing. On the side, I also collaborated with my team on implementing the Mobile client front-end.

## What's next for Promptu

We aim to enhance the user experience by integrating a social call to action. Ideally, the finished product would include an option to continue the conversation on social media by sharing the mural via Instagram, Facebook, Snapchat, etc. Utilizing the #ImpactfulPrompts hashtag will generate a beautiful feed of unique murals categorized by topics.

Due to the nature of natural language processing, we wouldn't be doing the technology justice if we didn't incorporate some kind of dialogue. In future iterations, our goal is to allow back and forth dialogue oriented around certain social issues. An example of a prompt for this scenario would be "What do you know about child labour?" The user will then be able to engage in a diologue on their phone and even be able to control certain elements on the mural such as the environment (cloudy and raining). This would be done by extracting key entities in the users speech such as position, physical objects, etc.


