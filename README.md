Pumpkin
=======

User moderated open commenting system

# API Endpoints #

## Get all topics - /topic/all ##

#### Attributes ####
|||
|---|---|
| **Path** | /topic/all |
| **HTTP Method** | GET |

#### Parameters ####
_None_

#### Response ####
JSON of all topics and replies.

||JSON format|
|---|---|
| **Topic** | ```{ "id": topic_id, "text": text, "link": link, "weight": 0, "replies": {} }``` |
| **Reply** | ```{ "id": reply_id, "text": text, "votes": 0, "weight": 0, "replies": {}, "children_ids": [] }``` |

#### Example ####
|||
|---|---|
| **Request** | ```$.post('http://127.0.0.1:8000/topic/all')``` |
| **Response** | ```{"0":{"id":0,"text":"Cool search engine","link":"http://google.com","weight":0,```|
||```"replies":{"1":{"id":1,"text":"just a reply","votes":0,"weight":0,"replies":{},"children_ids":[]}}}}``` |

## Add new topic - /topic/add ##
|||
|---|---|
| **Path**     | /topic/add |
| **HTTP Method**     | POST |

#### Parameters ####
|||
|---|---|
| **text** | 140 character maximum text |
| **link** | URL |

Format: ```/topic/add?text=yourtext&link=yourlink```

#### Response ####
JSON of topic added.

||JSON format|
|---|---|
| **Topic** | ```{ "id": topic_id, "text": text, "link": link, "weight": 0, "replies": {} }``` |

#### Example ####
|||
|---|---|
| **Request** | ```$.post('http://127.0.0.1:8000/topic/add?text=yourtext&link=yourlink')``` |
| **Response** | ```{"id":3,"text":"yourtext","link":"yourlink","weight":0,"replies":{}}```|
