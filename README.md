Pumpkin
=======

User moderated open commenting system

# API #

### POST topic ###
Create a new topic. 

Parameters: 

* text: 140 character description. 
* link: url for this topic.
 
Returns: new topic id.

Example: ```curl --data "text=Fun&link=http%3A%2F%2Freddit.com" http://127.0.0.1:31185/topic```

### GET topic ###
Get a list of current topics. 

Parameters: none.
 
Returns: list of current topics in JSON format.

Example: ```curl http://127.0.0.1:31185/topic```